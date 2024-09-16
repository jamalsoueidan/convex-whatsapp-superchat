import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { queryWithUser } from "./auth";

export const list = queryWithUser({
  args: {
    bot: v.id("bot"),
  },
  handler: async (ctx, args) => {
    const bots = await ctx.db
      .query("customerBot")
      .withIndex("by_bot", (q) => q.eq("bot", args.bot))
      .order("desc")
      .collect();

    const botsWithConversations = await Promise.all(
      bots.map(async (bot) => {
        const conversation = await ctx.db
          .query("conversation")
          .withIndex("by_business_and_customer", (q) =>
            q
              .eq("business_phone_number_id", bot.business_phone_number_id)
              .eq("customer_phone_number", bot.customer_phone_number)
          )
          .first();

        return {
          ...bot,
          conversation,
        };
      })
    );

    return botsWithConversations;
  },
});

export const get = queryWithUser({
  args: { customerBot: v.id("customerBot") },
  handler: (ctx, args) => {
    return ctx.db.get(args.customerBot);
  },
});

export const update = internalMutation({
  args: v.any(),
  handler: (ctx, args) => {
    const { _id, ...rest } = args;
    return ctx.db.patch(_id, rest);
  },
});
