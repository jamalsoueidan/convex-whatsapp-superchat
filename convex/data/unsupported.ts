import { pick } from "convex-helpers";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction, internalMutation } from "../_generated/server";
import { Message, text } from "./../tables/message";

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
              messages: v.optional(
                v.array(
                  v.object({
                    errors: v.array(
                      v.object({
                        code: v.number(),
                        title: v.string(),
                        message: v.string(),
                        error_data: v.object({
                          details: v.string(),
                        }),
                      })
                    ),
                    from: v.string(),
                    id: v.string(),
                    timestamp: v.string(),
                    type: v.literal("unsupported"),
                  })
                )
              ),
            }),
          })
        ),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const conversation = await ctx.runMutation(
      internal.data.conversation.insert,
      args
    );
    const value = args.entry[0].changes[0].value;
    if (value.messages) {
      const message = value.messages[0];
      const business_phone_number_id = value.metadata.phone_number_id;
      if (conversation) {
        await ctx.runMutation(internal.data.text.insert, {
          msg_id: message.id,
          business_phone_number_id,
          conversation,
          direction: "incoming",
          timestamp: parseInt(message.timestamp, 10),
          type: message.type,
          text: {
            body: message.errors[0].error_data.details,
          },
        });
      }
    }
  },
});

export const insert = internalMutation({
  args: {
    ...pick(Message.withoutSystemFields, [
      "msg_id",
      "business_phone_number_id",
      "conversation",
      "timestamp",
      "direction",
      "type",
    ]),
    text,
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.insert("message", args);
    // send to bot
    await ctx.scheduler.runAfter(0, internal.bot.run, { message });
  },
});
