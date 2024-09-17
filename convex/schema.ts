import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    updatingTime: v.number(),
    accessLevel: v.number(),
    // other "users" fields...
  }).searchIndex("search_name", {
    searchField: "name",
  }),
  data: defineTable({
    entry: v.array(
      v.object({
        changes: v.array(
          v.object({
            field: v.string(),
            value: v.object({
              contacts: v.optional(
                v.array(
                  v.object({
                    profile: v.object({ name: v.string() }),
                    wa_id: v.string(),
                  })
                )
              ),
              messages: v.optional(
                v.array(
                  v.object({
                    context: v.optional(
                      v.object({
                        from: v.string(),
                        id: v.string(),
                      })
                    ),
                    from: v.string(),
                    id: v.string(),
                    interactive: v.optional(
                      v.object({
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
                        nfm_reply: v.optional(
                          v.object({
                            body: v.string(),
                            name: v.string(),
                            response_json: v.string(),
                          })
                        ),
                        type: v.string(),
                      })
                    ),
                    text: v.optional(v.object({ body: v.string() })),
                    timestamp: v.string(),
                    type: v.string(),
                    video: v.optional(
                      v.object({
                        id: v.string(),
                        mime_type: v.string(),
                        sha256: v.string(),
                      })
                    ),
                    image: v.optional(
                      v.object({
                        id: v.string(),
                        mime_type: v.string(),
                        sha256: v.string(),
                      })
                    ),
                  })
                )
              ),
              messaging_product: v.string(),
              metadata: v.object({
                display_phone_number: v.string(),
                phone_number_id: v.string(),
              }),
              statuses: v.optional(
                v.array(
                  v.object({
                    conversation: v.optional(
                      v.object({
                        expiration_timestamp: v.optional(v.string()),
                        id: v.string(),
                        origin: v.object({
                          type: v.string(),
                        }),
                      })
                    ),
                    id: v.string(),
                    pricing: v.optional(
                      v.object({
                        billable: v.boolean(),
                        category: v.string(),
                        pricing_model: v.string(),
                      })
                    ),
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
                    recipient_id: v.string(),
                    status: v.string(),
                    timestamp: v.string(),
                  })
                )
              ),
            }),
          })
        ),
        id: v.string(),
      })
    ),
    object: v.string(),
  }),
  conversation: defineTable({
    business_phone_number_id: v.string(),
    customer_phone_number: v.string(),
    name: v.string(),
    timestamp: v.float64(),
  })
    .index("by_business_and_customer", [
      "business_phone_number_id",
      "customer_phone_number",
    ])
    .searchIndex("search_name", {
      searchField: "name",
    }),
  userConversation: defineTable({
    user: v.id("users"),
    conversation: v.id("conversation"),
    last_seen_at: v.number(),
  }).index("by_user_and_conversation", ["user", "conversation"]),
  message: defineTable({
    business_phone_number_id: v.string(),
    bot: v.optional(v.id("customerBot")),
    reply: v.optional(v.id("message")),
    user: v.optional(v.id("users")),
    storage: v.optional(v.id("_storage")),
    conversation: v.id("conversation"),
    msg_id: v.string(),
    recipient: v.string(),
    timestamp: v.float64(),
    type: v.string(),
    interactive_reply: v.optional(
      v.object({
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
      })
    ),
    interactive: v.optional(
      v.object({
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
      })
    ),
    statuses: v.optional(
      v.array(
        v.object({
          status: v.string(),
          timestamp: v.float64(),
          error: v.optional(v.string()),
        })
      )
    ),
    text: v.optional(
      v.object({
        body: v.string(),
        preview_url: v.optional(v.boolean()),
      })
    ),
    location: v.optional(
      v.object({
        name: v.string(),
        address: v.string(),
        latitude: v.string(),
        longitude: v.string(),
      })
    ),
  }).index("by_conversation", ["conversation"]),
  bot: defineTable({
    user: v.id("users"),
    created_at: v.number(),
    updated_at: v.number(),
    title: v.string(),
    nodes: v.array(v.any()),
    edges: v.array(v.any()),
    status: v.union(v.literal("draft"), v.literal("live")),
  }).index("by_status", ["status"]),
  customerBot: defineTable({
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
  })
    .index("by_business_and_customer_and_status", [
      "business_phone_number_id",
      "customer_phone_number",
      "status",
    ])
    .index("by_status", ["status"])
    .index("by_bot", ["bot"]),
});

export default schema;
