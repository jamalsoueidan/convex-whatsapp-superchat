import { v } from "convex/values";
import { mutationWithUser, queryWithUser } from "./auth";

export const search = queryWithUser({
  args: { query: v.string() },
  handler: (ctx, args) => {
    if (args.query === "") {
      return ctx.db.query("users").take(5);
    }

    return ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .collect();
  },
});

export const getAll = queryWithUser({
  args: {},
  handler: (ctx) => {
    return ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), ctx.user))
      .collect();
  },
});

export const update = mutationWithUser({
  args: { user: v.id("users"), accessLevel: v.number() },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db.get(ctx.user);
    const editingUser = await ctx.db.get(args.user);

    if (!currentUser || !editingUser) {
      throw new Error("User not found");
    }

    if (
      editingUser?.accessLevel >= currentUser.accessLevel ||
      args.accessLevel > currentUser.accessLevel
    ) {
      throw new Error("Cannot update user with higher access level");
    }

    return ctx.db.patch(args.user, { accessLevel: args.accessLevel });
  },
});

export const get = queryWithUser({
  args: { user: v.id("users") },
  handler: (ctx, args) => {
    if (args.user === ctx.user) {
      throw new Error("Cannot update yourself");
    }

    return ctx.db.get(args.user);
  },
});
