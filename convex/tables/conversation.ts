import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const Conversation = Table("conversation", {
  business_phone_number_id: v.string(),
  customer_phone_number: v.string(),
  name: v.string(),
  timestamp: v.float64(),
  incoming_timestamp: v.optional(v.float64()),
  outgoing_timestamp: v.optional(v.float64()),
});
