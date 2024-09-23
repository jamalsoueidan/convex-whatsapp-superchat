import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const CustomerBot = Table("customerBot", {
  business_phone_number_id: v.string(),
  customer_phone_number: v.string(),
  current_node_id: v.string(),
  status: v.union(v.literal("waiting"), v.literal("completed")),
  bot: v.id("bot"),
  created_at: v.number(),
  updated_at: v.number(),
  nodes: v.array(
    v.object({
      data: v.object({
        config: v.optional(
          v.object({
            assistant: v.optional(v.string()),
            model: v.optional(v.string()),
            require_response: v.boolean(),
            system: v.optional(v.string()),
          })
        ),
        trigger: v.optional(v.any()),
        name: v.optional(v.string()),
        type: v.optional(v.string()),
        whatsapp: v.optional(
          v.object({
            interactive: v.optional(
              v.object({
                action: v.object({
                  button: v.optional(v.string()),
                  buttons: v.optional(
                    //interactive-buttons
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
                    //interative-flow
                    v.object({
                      flow_action: v.string(),
                      flow_id: v.string(),
                      flow_action_payload: v.object({
                        screen: v.string(),
                      }),
                      flow_cta: v.string(),
                      flow_message_version: v.string(),
                      flow_token: v.string(),
                      mode: v.string(),
                    })
                  ),
                  sections: v.optional(
                    //interactive-list
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
              })
            ),
            location: v.optional(
              v.object({
                address: v.string(),
                latitude: v.string(),
                longitude: v.string(),
                name: v.string(),
              })
            ),
            text: v.optional(
              v.object({
                body: v.string(),
                preview_url: v.boolean(),
              })
            ),
            type: v.string(),
          })
        ),
      }),
      dragging: v.optional(v.boolean()),
      id: v.string(),
      measured: v.object({
        height: v.float64(),
        width: v.float64(),
      }),
      position: v.object({
        x: v.float64(),
        y: v.float64(),
      }),
      selected: v.optional(v.boolean()),
      sourcePosition: v.string(),
      targetPosition: v.string(),
      type: v.string(),
    })
  ),
  edges: v.array(
    v.object({
      animated: v.boolean(),
      id: v.string(),
      markerEnd: v.optional(
        v.object({
          height: v.float64(),
          type: v.string(),
          width: v.float64(),
        })
      ),
      selected: v.optional(v.boolean()),
      source: v.string(),
      sourceHandle: v.optional(v.string()),
      style: v.optional(v.object({ strokeWidth: v.float64() })),
      target: v.string(),
      targetHandle: v.optional(v.string()),
      type: v.string(),
    })
  ),
});
