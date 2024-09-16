import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { postFB } from "./functions";

export const send = internalAction({
  args: {
    message: v.id("message"),
    business_phone_number_id: v.string(),
    to: v.string(),
    type: v.string(),
    interactive: v.optional(v.any()),
    location: v.optional(v.any()),
    text: v.optional(
      v.object({
        body: v.string(),
        preview_url: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const response = await postFB(
      `https://graph.facebook.com/v20.0/${args.business_phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: args.to,
        type: args.type,
        ...(args.text ? { text: args.text } : {}),
        ...(args.interactive ? { interactive: args.interactive } : {}),
        ...(args.location ? { location: args.location } : {}),
      }
    );

    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }

    await ctx.runMutation(internal.message.updateMessage, {
      message: args.message,
      msg_id: json.messages[0].id,
    });
  },
});
