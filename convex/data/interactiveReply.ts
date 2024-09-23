import { pick } from "convex-helpers";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction, internalMutation } from "../_generated/server";
import { interactive_reply, Message } from "../tables/message";

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
                    context: v.object({
                      from: v.string(),
                      id: v.string(),
                    }),
                    from: v.string(),
                    id: v.string(),
                    timestamp: v.string(),
                    type: v.string(),
                    interactive: v.object({
                      type: v.string(),
                      //flow_token: v.optional(v.string()),
                      nfm_reply: v.optional(
                        v.object({
                          body: v.string(),
                          name: v.string(),
                          response_json: v.string(),
                        })
                      ),
                      button_reply: v.optional(
                        v.object({
                          id: v.string(),
                          title: v.string(),
                        })
                      ),
                      list_reply: v.optional(
                        v.object({
                          id: v.string(),
                          title: v.string(),
                          description: v.optional(v.string()),
                        })
                      ),
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
    const value = args.entry[0].changes[0].value;
    const business_phone_number_id = value.metadata.phone_number_id.toString();
    if (!value.messages) {
      return; //throw error;
    }
    const message = value.messages[0];

    const reply = await ctx.runMutation(internal.data.status.update, {
      msg_id: message.context.id,
      status: {
        status: "replied",
        timestamp: parseInt(message.timestamp, 10),
      },
    });

    if (!reply) {
      return;
    }

    if (message.interactive.type === "nfm_reply") {
      if (!message.interactive.nfm_reply) {
        return; //throw error
      }
      const interactive_reply = convertValuesToType(
        JSON.parse(message.interactive.nfm_reply.response_json)
      );

      // TDOO:
      // missing creating a reply to the user when going through the flow

      await ctx.runMutation(internal.data.interactiveReply.insert, {
        msg_id: message.id,
        bot: reply.bot,
        reply: reply._id,
        business_phone_number_id,
        conversation: reply?.conversation,
        direction: "incoming",
        timestamp: parseInt(message.timestamp, 10) + 5,
        interactive_reply: {
          flow_reply: interactive_reply,
          type: "flow_reply",
        },
        type: "interactive_reply",
      });
    } else {
      await ctx.runMutation(internal.data.interactiveReply.insert, {
        msg_id: message.id,
        bot: reply?.bot,
        reply: reply?._id,
        business_phone_number_id,
        conversation: reply?.conversation,
        direction: "incoming",
        timestamp: parseInt(message.timestamp) + 5,
        interactive_reply: message.interactive,
        type: "interactive_reply", //message.type,
      });
    }
  },
});

export const insert = internalMutation({
  args: {
    ...pick(Message.withoutSystemFields, [
      "msg_id",
      "bot",
      "reply",
      "business_phone_number_id",
      "conversation",
      "direction",
      "timestamp",
      "type",
    ]),
    interactive_reply,
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.insert("message", args);
    // send to bot
    await ctx.scheduler.runAfter(0, internal.bot.run, { message });
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertValuesToType(obj: Record<string, any>) {
  // Create a new object to store the converted values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const item = obj[key];

    // Check if the item contains both `type` and `value` properties
    if (item && typeof item === "object" && "type" in item && "value" in item) {
      // Copy the original properties
      newObj[key] = { ...item };

      // Convert the value based on its type
      switch (item.type) {
        case "number":
          newObj[key].value = Number(item.value);
          break;
        case "date":
          newObj[key].value = Number(item.value);
          break;
        case "string":
          newObj[key].value = String(item.value);
          break;
        // Add other cases for different types if needed
        default:
          newObj[key].value = item.value; // Keep the value unchanged if no matching type
          break;
      }
    } else {
      // If it doesn't follow the `type` and `value` rule, copy it as is, could be flow_token?
      // we dont save flow_token in the db!!
      // newObj[key] = item;
    }
  });

  return newObj;
}
