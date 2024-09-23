import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction, internalMutation } from "../_generated/server";

export const run = internalAction({
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
              statuses: v.optional(
                v.array(
                  v.object({
                    id: v.string(),
                    timestamp: v.string(),
                    status: v.string(),
                    recipient_id: v.string(),
                    conversation: v.optional(v.any()),
                    pricing: v.optional(v.any()),
                    errors: v.optional(
                      v.array(
                        v.object({
                          code: v.number(),
                          title: v.string(),
                          message: v.string(),
                          error_data: v.object({
                            details: v.string(),
                          }),
                          href: v.string(),
                        })
                      )
                    ),
                  })
                )
              ),
              contacts: v.optional(v.any()),
              messages: v.optional(v.any()),
            }),
          })
        ),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const value = args.entry[0].changes[0].value;
    if (!value.statuses) {
      return;
    }

    const statuses = value.statuses[0];
    const msg_id = statuses.id;

    await ctx.runMutation(internal.data.status.update, {
      msg_id,
      status: {
        status: statuses.status,
        timestamp: parseInt(statuses.timestamp, 10),
        error: statuses.errors
          ? statuses.errors[0].error_data.details
          : undefined,
      },
    });
  },
});

export const update = internalMutation({
  args: v.object({
    msg_id: v.string(),
    status: v.object({
      status: v.string(),
      timestamp: v.number(),
      error: v.optional(v.string()),
    }),
  }),
  handler: async (ctx, args) => {
    const reply = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("msg_id"), args.msg_id))
      .first();

    if (reply) {
      await ctx.db.patch(reply._id, {
        ...reply,
        statuses: reply.statuses
          ? [...reply.statuses, args.status]
          : [args.status],
      });
    }

    return reply;
  },
});
