import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import { Bot } from "./tables/bot";
import { Conversation } from "./tables/conversation";
import { CustomerBot } from "./tables/customerBot";
import { Data } from "./tables/data";
import { Message } from "./tables/message";
import { User } from "./tables/user";
import { UserConversation } from "./tables/userConversation";

export default defineSchema({
  ...authTables,
  users: User.table.searchIndex("search_name", {
    searchField: "name",
  }),
  data: Data.table,
  conversation: Conversation.table
    .index("by_business_and_customer", [
      "business_phone_number_id",
      "customer_phone_number",
    ])
    .searchIndex("search_name", {
      searchField: "name",
    }),
  userConversation: UserConversation.table.index("by_conversation_and_user", [
    "conversation",
    "user",
  ]),
  message: Message.table
    .index("by_conversation", ["conversation"])
    .index("by_conversation_and_direction", ["conversation", "direction"])
    .index("by_conversation_and_timestamp", ["conversation", "timestamp"]),
  bot: Bot.table.index("by_status", ["status"]),
  customerBot: CustomerBot.table
    .index("by_business_and_customer_and_status", [
      "business_phone_number_id",
      "customer_phone_number",
      "status",
    ])
    .index("by_status", ["status"])
    .index("by_bot", ["bot"]),
});
