import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const getAll = query({
  handler: (ctx) => {
    return ctx.db.query("conversation").collect();
  },
});

export const getId = query({
  args: { conversation: v.id("conversation") },
  handler: (ctx, args) => {
    return ctx.db.get(args.conversation);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: (ctx, args) => {
    return ctx.db
      .query("conversation")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .collect();
  },
});

export const findID = internalQuery({
  args: { conversation: v.id("conversation") },
  handler: (ctx, args) => {
    return ctx.db.get(args.conversation);
  },
});

export const updateTimestamp = internalMutation({
  args: { conversation: v.id("conversation"), timestamp: v.number() },
  handler: (ctx, args) => {
    return ctx.db.patch(args.conversation, {
      timestamp: args.timestamp,
    });
  },
});
