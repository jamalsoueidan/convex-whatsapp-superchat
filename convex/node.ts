import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";
import schema from "./schema";

export const nodeArgs = {
  nodeIndex: v.number(),
  customerBot: v.object({
    _id: v.id("customerBot"),
    _creationTime: v.any(),
    ...schema.tables.customerBot.validator.fields,
  }),
  message: v.object({
    _id: v.id("message"),
    _creationTime: v.any(),
    ...schema.tables.message.validator.fields,
  }),
  conversation: v.object({
    _id: v.id("conversation"),
    _creationTime: v.any(),
    ...schema.tables.conversation.validator.fields,
  }),
};

export const interactiveButtons = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];
    const { trigger, whatsapp } = node.data;

    if (!whatsapp) {
      throw new Error("Node missing whatsapp");
    }

    const { interactive, type } = whatsapp;
    if (!interactive || !type) {
      throw new Error("Node missing type and interactive");
    }

    if (!trigger) {
      const result = await ctx.runMutation(internal.node.send, {
        conversation: message.conversation,
        timestamp: message.timestamp,
        customerBot: customerBot._id,
        interactive,
        type,
      });
      node.data.trigger = {
        status: "waiting",
        created_at: message.timestamp,
        updated_at: null,
        count: (trigger?.count || 0) + 1,
        waiting: {
          message: result,
        },
      };
    } else if (message.reply === trigger.waiting.message) {
      if (!message.interactive_reply?.button_reply?.id) {
        throw new Error(
          "Something went wrong, no button_reply.id in the message"
        );
      }

      node.data.trigger = {
        ...node.data.trigger,
        status: "done",
        sourceHandle: message.interactive_reply.button_reply.id, //for nodes with multi selection, must return the sourceHandleId, save us time later!
        reply_count: (trigger?.reply_count || 0) + 1,
        done: {
          message: message._id,
          ...message.interactive_reply,
        },
        updated_at: message.timestamp,
      };

      return {
        updatedNode: node,
        done: true,
        sourceHandle: message.interactive_reply.button_reply.id,
      };
    }

    return { updatedNode: node, done: false };
  },
});

export const interactiveList = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];
    const { trigger, whatsapp } = node.data;

    if (!whatsapp) {
      throw new Error("Node missing whatsapp");
    }

    const { interactive, type } = whatsapp;
    if (!interactive || !type) {
      throw new Error("Node missing type and interactive");
    }

    if (!trigger) {
      const result = await ctx.runMutation(internal.node.send, {
        conversation: message.conversation,
        timestamp: message.timestamp,
        customerBot: customerBot._id,
        interactive,
        type,
      });

      node.data.trigger = {
        status: "waiting",
        created_at: message.timestamp,
        updated_at: null,
        count: (trigger?.count || 0) + 1,
        waiting: {
          message: result,
        },
      };
    } else if (message.reply === trigger.waiting.message) {
      if (!message.interactive_reply?.list_reply?.id) {
        throw new Error(
          "Something went wrong, no button_reply.id in the message"
        );
      }

      node.data.trigger = {
        ...node.data.trigger,
        status: "done",
        sourceHandle: message.interactive_reply.list_reply.id, //for nodes with multi selection, must return the sourceHandleId, save us time later!
        reply_count: (trigger?.reply_count || 0) + 1,
        done: {
          message: message._id,
          ...message.interactive_reply,
        },
        updated_at: message.timestamp,
      };

      return {
        updatedNode: node,
        done: true,
        sourceHandle: message.interactive_reply.list_reply.id,
      };
    }

    return { updatedNode: node, done: false };
  },
});

export const location = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];
    const { trigger, whatsapp } = node.data;

    if (!whatsapp) {
      throw new Error("Node missing whatsapp");
    }

    const { location, type } = whatsapp;
    if (!location || !type) {
      throw new Error("Node missing type and location");
    }

    if (!trigger) {
      const result = await ctx.runMutation(internal.node.send, {
        conversation: message.conversation,
        timestamp: message.timestamp,
        customerBot: customerBot._id,
        location,
        type,
      });

      node.data.trigger = {
        status: "done",
        created_at: message.timestamp,
        updated_at: null,
        count: (trigger?.count || 0) + 1,
        done: {
          message: result,
        },
      };
    }

    return { updatedNode: node, done: true };
  },
});

export const interactiveFlow = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];
    const { trigger, whatsapp } = node.data;

    if (!whatsapp) {
      throw new Error("Node missing whatsapp");
    }

    const { interactive, type } = whatsapp;
    if (!interactive || !type) {
      throw new Error("Node missing type and interactive");
    }

    if (!trigger) {
      const result = await ctx.runMutation(internal.node.send, {
        conversation: message.conversation,
        timestamp: message.timestamp,
        customerBot: customerBot._id,
        interactive,
        type,
      });

      node.data.trigger = {
        status: "waiting",
        created_at: message.timestamp,
        updated_at: null,
        count: (trigger?.count || 0) + 1,
        waiting: {
          message: result,
        },
      };
    } else if (message.reply === trigger.waiting.message) {
      if (!message.interactive_reply) {
        throw new Error(
          "Something went wrong, no button_reply.id in the message"
        );
      }

      node.data.trigger = {
        ...node.data.trigger,
        status: "done",
        reply_count: (trigger?.reply_count || 0) + 1,
        done: {
          message: message._id,
          ...message.interactive_reply,
        },
        updated_at: message.timestamp,
      };

      return {
        updatedNode: node,
        done: true,
      };
    }

    return { updatedNode: node, done: false };
  },
});

export const message = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];
    const { trigger, whatsapp, config } = node.data;

    if (!whatsapp || !config) {
      throw new Error("Node missing whatsapp or config");
    }

    const { text, type } = whatsapp;
    if (!text || !type) {
      throw new Error("Node missing type and interactive");
    }

    if (!trigger) {
      const result = await ctx.runMutation(internal.node.send, {
        conversation: message.conversation,
        timestamp: message.timestamp,
        customerBot: customerBot._id,
        text,
        type,
      });

      node.data.trigger = {
        status: config.require_response ? "waiting" : "done",
        created_at: message.timestamp,
        updated_at: message.timestamp,
        waiting: {
          message: result,
        },
      };

      return { updatedNode: node, done: !config.require_response };
    } else {
      node.data.trigger = {
        ...node.data.trigger,
        status: "done",
        done: {
          message: message._id.toString(),
          type: message.type,
          text: message.text,
          //media: message, //missing if response is media
        },
        updated_at: message.timestamp,
      };

      return {
        updatedNode: node,
        done: true,
      };
    }
  },
});

export const chat = internalAction({
  args: nodeArgs,
  handler: async (ctx, args) => {
    const { nodeIndex, message, customerBot } = args;

    const node = customerBot.nodes[nodeIndex];

    const edges = customerBot.edges.filter((edge) => edge.source === node.id);

    // Find all nodes connected to the node (based on edges)
    const nodes = customerBot.nodes.filter((nodeItem) =>
      edges.some((edge) => edge.target === nodeItem.id)
    );

    const chatgptResponse = await ctx.runAction(internal.openai.askChat, {
      content: message.text?.body || ":)",
      nodes,
    });

    const result = await ctx.runMutation(internal.node.send, {
      conversation: message.conversation,
      timestamp: message.timestamp,
      customerBot: customerBot._id,
      text: {
        body: JSON.parse(chatgptResponse.choices[0].message.content).message,
      },
      type: "text",
    });

    const targetId: string = JSON.parse(
      chatgptResponse.choices[0].message.content
    ).node_id;

    node.data.trigger = {
      status: "waiting",
      created_at: message.timestamp,
      updated_at: null,
      count: (node.data.trigger?.count || 0) + 1,
      waiting: {
        message: result,
        chat: [chatgptResponse],
      },
    };

    return { updatedNode: node, done: !!targetId, targetId };
  },
});

// this is used in the front end to send message
export const send = internalMutation({
  args: {
    customerBot: v.id("customerBot"),
    conversation: v.id("conversation"),
    type: v.string(),
    interactive: v.optional(v.any()),
    location: v.optional(v.any()),
    text: v.optional(
      v.object({
        body: v.string(),
        preview_url: v.optional(v.boolean()),
      })
    ),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversation);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    try {
      const response = await ctx.db.insert("message", {
        bot: args.customerBot,
        msg_id: args.type === "internal_message" ? "system" : "not_send_yet",
        conversation: conversation._id,
        business_phone_number_id: conversation.business_phone_number_id,
        recipient: conversation.customer_phone_number,
        type: args.type,
        timestamp: args.timestamp + 3,
        ...(args.text ? { text: args.text } : {}),
        ...(args.interactive ? { interactive: args.interactive } : {}),
        ...(args.location ? { location: args.location } : {}),
      });

      // update conversation timestamp
      await ctx.scheduler.runAfter(0, internal.conversation.updateTimestamp, {
        conversation: args.conversation,
        timestamp: args.timestamp + 3,
      });

      if (args.type !== "internal_message") {
        // lets send to whatsapp in the background
        await ctx.scheduler.runAfter(0, internal.whatsapp.send, {
          message: response,
          business_phone_number_id: conversation.business_phone_number_id,
          to: conversation.customer_phone_number,
          type: args.type,
          ...(args.text ? { text: args.text } : {}),
          ...(args.interactive ? { interactive: args.interactive } : {}),
          ...(args.location ? { location: args.location } : {}),
        });
      }

      return response;
    } catch (err) {
      console.log(err);
    }
  },
});
