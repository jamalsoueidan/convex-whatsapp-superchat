import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { mutationWithUser, queryWithUser } from "./auth";

export const get = queryWithUser({
  args: {
    conversation: v.id("conversation"),
  },
  handler: (ctx, args) => {
    return ctx.db
      .query("userConversation")
      .withIndex("by_conversation_and_user", (q) =>
        q.eq("conversation", args.conversation).eq("user", ctx.user)
      )
      .first();
  },
});

export const update = mutationWithUser({
  args: {
    conversation: v.id("conversation"),
    last_seen_at: v.number(),
  },
  handler: async (ctx, args) => {
    const uc = await get(ctx, args);

    if (uc) {
      await ctx.db.patch(uc._id, {
        last_seen_at: args.last_seen_at,
      });
    } else {
      await ctx.db.insert("userConversation", {
        user: ctx.user,
        conversation: args.conversation,
        last_seen_at: args.last_seen_at,
      });
    }
  },
});

export const countUnreadMessages = internalQuery({
  args: {
    conversation: v.id("conversation"),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const uc = await ctx.db
      .query("userConversation")
      .withIndex("by_conversation_and_user", (q) =>
        q.eq("conversation", args.conversation).eq("user", args.user)
      )
      .unique();

    if (uc) {
      const messages = await ctx.db
        .query("message")
        .withIndex("by_conversation_and_timestamp", (q) =>
          q
            .eq("conversation", args.conversation)
            .gte("timestamp", uc.last_seen_at)
        )
        .filter((q) => q.neq(q.field("user"), args.user))
        .collect();
      return messages.length;
    }

    return 0;
  },
});
