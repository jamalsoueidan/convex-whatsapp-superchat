import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  httpAction,
  internalAction,
  internalMutation,
} from "./_generated/server";

export const webhooks = httpAction(async (ctx, request) => {
  const url = new URL(request.url);

  const challenge = url.searchParams.get("hub.challenge");

  if (challenge) {
    return new Response(challenge, {
      status: 200,
    });
  }

  const body = await request.json();
  //console.log(body.entry[0].changes[0].value.statuses[0]);
  await ctx.scheduler.runAfter(0, internal.webhooks.incoming, body);
  return new Response("OK", { status: 200 });
});

export const incoming = internalAction({
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
        await ctx.runAction(internal.data.text.run, args);
      } else if (type === "image" || type === "video" || type === "audio") {
        await ctx.runAction(internal.data.media.run, args);
      } else if (type === "interactive") {
        await ctx.runAction(internal.data.interactiveReply.run, args);
      } else if (type === "location") {
        await ctx.runAction(internal.data.location.run, args);
      }
    } else if (value.statuses) {
      await ctx.runAction(internal.data.status.run, args);
    } else {
      throw new Error("unspported");
    }

    await ctx.runMutation(internal.webhooks.insert, args);
  },
});

export const insert = internalMutation({
  args: v.any(),
  handler: async (ctx, args) => {
    await ctx.db.insert("data", args);
  },
});
