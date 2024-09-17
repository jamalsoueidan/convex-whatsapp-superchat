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
                    context: v.optional(
                      v.object({
                        id: v.string(),
                      })
                    ),
                    from: v.string(),
                    id: v.string(),
                    timestamp: v.string(),
                    type: v.union(v.literal("image"), v.literal("video")),
                    image: v.optional(
                      v.object({
                        mime_type: v.string(),
                        sha256: v.string(),
                        id: v.string(),
                      })
                    ),
                    video: v.optional(
                      v.object({
                        mime_type: v.string(),
                        sha256: v.string(),
                        id: v.string(),
                      })
                    ),
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
    const entry = args.entry[0];
    const change = entry.changes[0];
    const value = change.value;
    if (!value.messages) {
      return; //throw error
    }
    const message = value.messages[0];
    let id = "";
    if (message.image) {
      id = message.image.id;
    } else if (message.video) {
      id = message.video.id;
    }
    const business_phone_number_id = value.metadata.phone_number_id.toString();
    const conversation = await ctx.runMutation(
      internal.datatypes.conversation.insert,
      args as never
    );

    const response = await fetch(`https://graph.facebook.com/v20.0/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, // No need to use an array for Bearer token
      },
    });

    const image = await response.json();

    const requestFile = await fetch(image.url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
    });

    const file = await requestFile.blob();

    const storage = await ctx.storage.store(file);

    await ctx.runMutation(internal.datatypes.media.insert, {
      msg_id: message.id,
      business_phone_number_id,
      conversation,
      recipient: value.metadata.display_phone_number.toString(),
      timestamp: parseInt(message.timestamp, 10),
      storage,
      type: message.type,
    });
  },
});

export const insert = internalMutation({
  args: {
    business_phone_number_id: v.string(),
    conversation: v.any(),
    msg_id: v.string(),
    recipient: v.string(),
    storage: v.id("_storage"),
    timestamp: v.number(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("message", args);
  },
});
