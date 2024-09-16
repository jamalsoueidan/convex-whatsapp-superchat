import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const insert = internalMutation({
  args: {
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
              statuses: v.optional(
                v.array(
                  v.object({
                    recipient_id: v.number(),
                    timestamp: v.string(),
                  })
                )
              ),
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
              messages: v.optional(v.any()),
            }),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const value = args.entry[0].changes[0].value;
    const business_phone_number_id = value.metadata.phone_number_id.toString();
    let customer_phone_number = "";
    let set = {
      business_phone_number_id,
      customer_phone_number,
      timestamp: 0,
      name: "unknown",
    };

    if (value.statuses) {
      const status = value.statuses[0];
      customer_phone_number = status.recipient_id.toString();

      set = {
        business_phone_number_id,
        customer_phone_number,
        name: "unknown",
        timestamp: parseInt(status.timestamp, 10),
      };
    }

    if (value.contacts) {
      const contact = value.contacts[0];
      customer_phone_number = contact.wa_id.toString();
      set = {
        business_phone_number_id,
        customer_phone_number,
        name: contact.profile.name,
        ...(value.messages
          ? { timestamp: parseInt(value.messages[0].timestamp, 10) }
          : { timestamp: 0 }),
      };
    }

    const conversation = await ctx.db
      .query("conversation")
      .withIndex("by_business_and_customer", (q) =>
        q
          .eq("business_phone_number_id", business_phone_number_id)
          .eq("customer_phone_number", customer_phone_number)
      )
      .first();

    if (conversation) {
      await ctx.db.patch(conversation._id, set);
      return conversation._id;
    } else {
      return await ctx.db.insert("conversation", set);
    }
  },
});
