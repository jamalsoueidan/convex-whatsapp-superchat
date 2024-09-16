import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

export const webhooks = internalAction({
  args: v.object({
    object: v.string(),
    entry: v.array(
      v.object({
        id: v.string(),
        changes: v.array(
          v.object({
            field: v.string(),
            value: v.object({
              messaging_product: v.string(),
              metadata: v.object({
                phone_number_id: v.string(),
                display_phone_number: v.string(),
              }),
              contacts: v.optional(
                v.array(
                  v.object({
                    profile: v.object({
                      name: v.string(),
                    }),
                    wa_id: v.string(),
                  })
                )
              ),
              statuses: v.optional(v.array(v.any())),
              messages: v.optional(v.array(v.any())),
            }),
          })
        ),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const value = args.entry[0].changes[0].value;
    if (value.messages) {
      const type = value.messages[0].type;

      if (type === "text") {
        await ctx.runAction(internal.datatypes.text.run, args);
      } else if (type === "image") {
        await ctx.runAction(internal.datatypes.media.run, args);
      } else if (type === "video") {
        await ctx.runAction(internal.datatypes.media.run, args);
      } else if (type === "interactive") {
        await ctx.runAction(internal.datatypes.interactiveReply.run, args);
      }
    } else if (value.statuses) {
      await ctx.runAction(internal.datatypes.status.run, args);
    } else {
      throw new Error("unspported");
    }

    await ctx.runMutation(internal.data.insert, args);
  },
});

export const insert = internalMutation({
  args: v.any(),
  handler: async (ctx, args) => {
    await ctx.db.insert("data", args);
  },
});
