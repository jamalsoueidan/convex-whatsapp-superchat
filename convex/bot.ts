import { FunctionReference } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { internalAction, internalMutation } from "./_generated/server";
import { mutationWithUser, queryWithUser } from "./auth";
import { nodeArgs } from "./node";

export const list = queryWithUser({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("bot").order("desc").collect();
  },
});

export const create = mutationWithUser({
  args: {
    title: v.string(),
    timestamp: v.number(),
  },
  handler: (ctx, args) => {
    const nodes = [
      {
        id: crypto.randomUUID(),
        position: { x: 0, y: 0 },
        type: "start",
        data: { type: "on_received_message" },
      },
      {
        id: crypto.randomUUID(),
        position: { x: 0, y: 0 },
        type: "plus",
        data: {},
      },
    ];

    return ctx.db.insert("bot", {
      user: ctx.user,
      edges: [
        {
          id: `${nodes[0].id}-${nodes[1].id}`,
          source: nodes[0].id,
          target: nodes[1].id,
          type: "delete-edge",
          animated: true,
        },
      ],
      nodes,
      title: args.title,
      created_at: args.timestamp,
      updated_at: args.timestamp,
      status: "draft",
    });
  },
});

export const get = queryWithUser({
  args: { bot: v.id("bot") },
  handler: (ctx, args) => {
    return ctx.db.get(args.bot);
  },
});

export const update = mutationWithUser({
  args: {
    id: v.id("bot"),
    nodes: v.optional(v.array(v.any())),
    edges: v.optional(v.array(v.any())),
    title: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("live"))),
  },
  handler: (ctx, args) => {
    const { id, ...rest } = args;
    return ctx.db.patch(id, rest);
  },
});

export const run = internalMutation({
  args: { message: v.id("message") },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("_id"), args.message))
      .first();

    if (!message) {
      throw new Error("Message not found");
    }

    const conversation = await ctx.db
      .query("conversation")
      .withIndex("by_id", (q) => q.eq("_id", message.conversation))
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const runningBotExist = await ctx.db
      .query("customerBot")
      .withIndex("by_business_and_customer_and_status", (q) =>
        q
          .eq("business_phone_number_id", conversation.business_phone_number_id)
          .eq("customer_phone_number", conversation.customer_phone_number)
          .eq("status", "waiting")
      )
      .first();

    if (!runningBotExist) {
      const bots = await ctx.db
        .query("bot")
        .withIndex("by_status", (q) => q.eq("status", "live"))
        .collect();

      for (const bot of bots) {
        console.log(
          "started bot:",
          bot.title,
          "for user",
          conversation.customer_phone_number
        );
        // Find the start node
        const startNodeIndex = bot.nodes.findIndex(
          (node) => node.type === "start"
        );
        if (startNodeIndex > -1) {
          bot.nodes[startNodeIndex].data.trigger = {
            status: "done",
            done: { message: args.message },
          }; //save the message id that started the flow!

          // Find the edge that starts from the current node
          const currentEdge = bot.edges.find(
            (edge) => edge.source === bot.nodes[startNodeIndex].id
          );

          // Set the current_node_id to the the next node, we dont care about the start.
          const nextNode = bot.nodes.find(
            (node) => node.id === currentEdge?.target
          );

          await ctx.db.insert("customerBot", {
            business_phone_number_id: conversation.business_phone_number_id,
            customer_phone_number: conversation.customer_phone_number,
            bot: bot._id,
            nodes: bot.nodes,
            edges: bot.edges,
            current_node_id: nextNode?.id,
            created_at: Math.floor(Date.now() / 1000),
            updated_at: Math.floor(Date.now() / 1000),
            status: "waiting",
          });

          break;
        }
      }
    }

    const customerBot = await ctx.db
      .query("customerBot")
      .withIndex("by_business_and_customer_and_status", (q) =>
        q
          .eq("business_phone_number_id", conversation.business_phone_number_id)
          .eq("customer_phone_number", conversation.customer_phone_number)
          .eq("status", "waiting")
      )
      .first();

    if (customerBot) {
      await ctx.scheduler.runAfter(0, internal.bot.start, {
        customerBot,
        message,
        conversation,
        nodeIndex: 0, //just to satify nodeArgs
      });
    }
  },
});

export const start = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { customerBot, message, conversation } = args;

    const nodeIndex = customerBot.nodes.findIndex(
      (node) => node.id === customerBot.current_node_id
    );

    if (nodeIndex > -1) {
      const node = customerBot.nodes[nodeIndex];

      const response = await ctx.runAction(nodeTypes[node.type], {
        nodeIndex: nodeIndex,
        customerBot,
        message,
        conversation,
      });

      customerBot.status = "waiting";
      customerBot.nodes[nodeIndex] = response.updatedNode;
      customerBot.updated_at = Math.floor(Date.now() / 1000);

      await ctx.runMutation(internal.customer_bot.update, customerBot);

      if (response.done) {
        const nextNodeIndex = findNextNode(
          customerBot,
          customerBot.nodes[nodeIndex].id,
          response.sourceHandle,
          response.targetId
        );
        console.log("found nextNodeIndex", nextNodeIndex);
        if (nextNodeIndex > -1) {
          console.log(
            "moving to next node",
            customerBot.nodes[nextNodeIndex].type
          );

          await ctx.runMutation(internal.customer_bot.update, {
            _id: customerBot._id,
            current_node_id: customerBot.nodes[nextNodeIndex].id,
          });

          customerBot.current_node_id = customerBot.nodes[nextNodeIndex].id;

          await ctx.scheduler.runAfter(0, internal.bot.start, {
            customerBot,
            message,
            conversation,
            nodeIndex: 0, //just to satify nodeArgs
          });
        } else {
          await ctx.runMutation(internal.customer_bot.update, {
            _id: customerBot._id,
            status: "completed",
          });
        }
      }
    }
  },
});

const nodeTypes: Record<
  string,
  FunctionReference<"action", "public" | "internal">
> = {
  "interactive-buttons": internal.node.interactiveButtons,
  "interactive-list": internal.node.interactiveList,
  location: internal.node.location,
  "interactive-flow": internal.node.interactiveFlow,
  message: internal.node.message,
  chat: internal.node.chat,
};

const findNextNode = function (
  customerBot: Doc<"customerBot">,
  currentNodeId: string,
  sourceHandle?: string,
  targetId?: string //used with AI multiply target handler for one source handler
) {
  console.log("find next node", currentNodeId, sourceHandle, targetId);
  if (sourceHandle) {
    const currentEdge = customerBot.edges.find(
      (edge) =>
        edge.source === currentNodeId && edge.sourceHandle === sourceHandle
    );

    return customerBot.nodes.findIndex(
      (node) => node.id === currentEdge?.target && node.type !== "plus"
    );
  } else if (targetId) {
    return customerBot.nodes.findIndex((node) => node.id === targetId);
  } else {
    const currentEdge = customerBot.edges.find(
      (edge) => edge.source === currentNodeId
    );
    return customerBot.nodes.findIndex(
      (node) => node.id === currentEdge?.target && node.type !== "plus"
    );
  }
};
