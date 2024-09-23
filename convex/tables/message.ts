import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const direction = v.union(
  v.literal("incoming"),
  v.literal("outgoing"),
  v.literal("system")
);

export const text = v.object({
  body: v.string(),
  preview_url: v.optional(v.boolean()),
});

export const location = v.object({
  name: v.string(),
  address: v.string(),
  latitude: v.string(),
  longitude: v.string(),
});

export const status = v.object({
  status: v.string(),
  timestamp: v.float64(),
  error: v.optional(v.string()),
});

export const statuses = v.array(status);

export const interactive = v.object({
  action: v.object({
    button: v.optional(v.string()),
    buttons: v.optional(
      v.array(
        v.object({
          reply: v.object({
            id: v.string(),
            title: v.string(),
          }),
          type: v.string(),
        })
      )
    ),
    name: v.optional(v.string()),
    parameters: v.optional(
      v.object({
        flow_action: v.string(),
        flow_action_payload: v.object({
          screen: v.string(),
        }),
        flow_cta: v.string(),
        flow_id: v.string(),
        flow_message_version: v.string(),
        flow_token: v.string(),
        mode: v.string(),
      })
    ),
    sections: v.optional(
      v.array(
        v.object({
          rows: v.array(
            v.object({
              description: v.optional(v.string()),
              id: v.string(),
              title: v.string(),
            })
          ),
          title: v.string(),
        })
      )
    ),
  }),
  body: v.object({ text: v.string() }),
  footer: v.object({ text: v.string() }),
  header: v.object({
    text: v.string(),
    type: v.string(),
  }),
  type: v.string(),
});

export const interactive_reply = v.object({
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
  flow_reply: v.optional(
    v.record(
      v.string(),
      v.object({
        question: v.string(),
        type: v.string(),
        value: v.union(v.string(), v.number()),
      })
    )
  ),
  type: v.string(), //convert this to union of button_reply, list_reply, and flow_reply
});

export const storage = v.id("_storage");

export const Message = Table("message", {
  business_phone_number_id: v.string(),
  bot: v.optional(v.id("customerBot")),
  reply: v.optional(v.id("message")),
  user: v.optional(v.id("users")),
  storage: v.optional(storage),
  conversation: v.id("conversation"),
  msg_id: v.string(),
  direction,
  timestamp: v.float64(),
  type: v.string(),
  interactive_reply: v.optional(interactive_reply),
  interactive: v.optional(interactive),
  statuses: v.optional(statuses),
  text: v.optional(text),
  location: v.optional(location),
});
