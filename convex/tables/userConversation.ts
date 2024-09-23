import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const UserConversation = Table("userConversation", {
  user: v.id("users"),
  conversation: v.id("conversation"),
  last_seen_at: v.number(),
});
