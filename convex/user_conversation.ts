import { v } from "convex/values";
import { mutationWithUser, queryWithUser } from "./auth";

export const find = queryWithUser({
  args: {
    conversation: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userConversation")
      .withIndex("by_user_and_conversation", (q) =>
        q.eq("user", ctx.user).eq("conversation", args.conversation)
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
    const uc = await ctx.db
      .query("userConversation")
      .withIndex("by_user_and_conversation", (q) =>
        q.eq("user", ctx.user).eq("conversation", args.conversation)
      )
      .first();

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
    return null;
  },
});

export const count = queryWithUser({
  args: {
    conversation: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    const uc = await ctx.db
      .query("userConversation")
      .withIndex("by_user_and_conversation", (q) =>
        q.eq("user", ctx.user).eq("conversation", args.conversation)
      )
      .first();

    if (uc) {
      const messages = await ctx.db
        .query("message")
        .withIndex("by_conversation", (q) =>
          q.eq("conversation", args.conversation)
        )
        .filter((q) =>
          q.and(
            q.gte(q.field("timestamp"), uc.last_seen_at),
            q.neq(q.field("user"), ctx.user)
          )
        )
        .collect();
      return messages.length;
    }

    return 0;
  },
});
