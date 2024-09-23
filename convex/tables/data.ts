import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const Data = Table("data", {
  entry: v.array(
    v.object({
      id: v.string(),
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
                  audio: v.optional(v.any()),
                  video: v.optional(v.any()),
                  image: v.optional(v.any()),
                  location: v.optional(v.any()),
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
    })
  ),
  object: v.string(),
});
