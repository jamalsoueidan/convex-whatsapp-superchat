import { asyncMap, pick } from "convex-helpers";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { mutationWithUser, queryWithUser } from "./auth";
import { Conversation } from "./tables/conversation";
import { countUnreadMessages } from "./user_conversation";

export const getAll = queryWithUser({
  handler: async (ctx) => {
    const timestamp = Math.floor(Date.now() / 1000) - 24 * 60;
    console.log(timestamp);
    return asyncMap(
      await filter(
        ctx.db.query("conversation"),
        (c) => timestamp > (c.incoming_timestamp || 0)
      ).collect(),
      async (conversation) => {
        return {
          ...conversation,
          unreadMessageCount: await countUnreadMessages(ctx, {
            conversation: conversation._id,
            user: ctx.user,
          }),
        };
      }
    );
  },
});

export const getId = queryWithUser({
  args: { conversation: v.id("conversation") },
  handler: async (ctx, args) => {
    const conversation = await getByConversation(ctx, args);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return {
      ...conversation,
      unreadMessageCount: await countUnreadMessages(ctx, {
        ...args,
        user: ctx.user,
      }),
    };
  },
});

export const create = mutationWithUser({
  args: {
    ...pick(Conversation.withoutSystemFields, [
      "name",
      "customer_phone_number",
      "timestamp",
    ]),
    conversation: v.id("conversation"), //so we know which business_phone_number_id to use
  },
  handler: async (ctx, args) => {
    const conversation = await getId(ctx, args);

    const existingConversation = await ctx.db
      .query("conversation")
      .withIndex("by_business_and_customer", (q) =>
        q
          .eq("business_phone_number_id", conversation.business_phone_number_id)
          .eq("customer_phone_number", args.customer_phone_number)
      )
      .unique();

    if (!existingConversation) {
      await ctx.db.insert("conversation", {
        name: args.name,
        customer_phone_number: args.customer_phone_number,
        business_phone_number_id: conversation.business_phone_number_id,
        timestamp: args.timestamp,
      });
    } else {
      throw new Error("Contact already exists");
    }
  },
});

export const getByConversation = internalQuery({
  args: { conversation: v.id("conversation") },
  handler: (ctx, args) => {
    return ctx.db.get(args.conversation);
  },
});

export const search = queryWithUser({
  args: { query: v.string() },
  handler: (ctx, args) => {
    return ctx.db
      .query("conversation")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .collect();
  },
});

export const updateTimestamp = internalMutation({
  args: {
    conversation: v.id("conversation"),
    timestamp: v.number(),
    outgoing_timestamp: v.number(),
  },
  handler: (ctx, args) => {
    return ctx.db.patch(args.conversation, {
      timestamp: args.timestamp,
      outgoing_timestamp: args.outgoing_timestamp,
    });
  },
});
