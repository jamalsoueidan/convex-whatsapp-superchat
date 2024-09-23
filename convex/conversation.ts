import { asyncMap } from "convex-helpers";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { queryWithUser } from "./auth";
import { countUnreadMessages } from "./user_conversation";

export const getAll = queryWithUser({
  handler: (ctx) => {
    return asyncMap(
      ctx.db.query("conversation").order("desc").collect(),
      async (conversation) => {
        const unreadMessageCount = await countUnreadMessages(ctx, {
          conversation: conversation._id,
          user: ctx.user,
        });

        return {
          ...conversation,
          unreadMessageCount,
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
