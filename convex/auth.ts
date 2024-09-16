import Facebook from "@auth/core/providers/facebook";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Facebook],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        await ctx.db.patch(args.existingUserId, { updatingTime: Date.now() });
        return args.existingUserId;
      }

      return ctx.db.insert("users", {
        ...args.profile,
        accessLevel: 0,
        updatingTime: Date.now(),
      });
    },
  },
});

export const mutationWithUser = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new ConvexError("User must be logged in.");
    }
    return { user };
  })
);

export const actionWithUser = customAction(
  action,
  customCtx(async (ctx) => {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new ConvexError("User must be logged in.");
    }
    return { user };
  })
);

export const queryWithUser = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new ConvexError("User must be logged in.");
    }
    return { user };
  })
);

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});
