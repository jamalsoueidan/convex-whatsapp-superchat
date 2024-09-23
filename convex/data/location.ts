import { pick } from "convex-helpers";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction, internalMutation } from "../_generated/server";
import { location, Message } from "./../tables/message";

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
                    from: v.string(),
                    id: v.string(),
                    timestamp: v.string(),
                    type: v.literal("location"),
                    location: v.object({
                      latitude: v.float64(),
                      longitude: v.float64(),
                      name: v.optional(v.string()),
                      url: v.optional(v.string()),
                    }),
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
        await ctx.runMutation(internal.data.location.insert, {
          msg_id: message.id,
          business_phone_number_id,
          conversation,
          direction: "incoming",
          timestamp: parseInt(message.timestamp, 10),
          location: {
            name: message.location.name || "",
            address: message.location.url || "",
            latitude: message.location.latitude.toString(),
            longitude: message.location.longitude.toString(),
          },
          type: message.type,
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
    location,
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.insert("message", args);
    // send to bot
    await ctx.scheduler.runAfter(0, internal.bot.run, { message });
  },
});