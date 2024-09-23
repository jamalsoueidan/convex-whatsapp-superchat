/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as bot from "../bot.js";
import type * as conversation from "../conversation.js";
import type * as customer_bot from "../customer_bot.js";
import type * as data_contacts from "../data/contacts.js";
import type * as data_conversation from "../data/conversation.js";
import type * as data_interactiveReply from "../data/interactiveReply.js";
import type * as data_location from "../data/location.js";
import type * as data_media from "../data/media.js";
import type * as data_status from "../data/status.js";
import type * as data_text from "../data/text.js";
import type * as data_unsupported from "../data/unsupported.js";
import type * as flow from "../flow.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as node from "../node.js";
import type * as openai from "../openai.js";
import type * as tables_bot from "../tables/bot.js";
import type * as tables_conversation from "../tables/conversation.js";
import type * as tables_customerBot from "../tables/customerBot.js";
import type * as tables_data from "../tables/data.js";
import type * as tables_message from "../tables/message.js";
import type * as tables_user from "../tables/user.js";
import type * as tables_userConversation from "../tables/userConversation.js";
import type * as users from "../users.js";
import type * as user_conversation from "../user_conversation.js";
import type * as webhooks from "../webhooks.js";
import type * as whatsapp from "../whatsapp.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bot: typeof bot;
  conversation: typeof conversation;
  customer_bot: typeof customer_bot;
  "data/contacts": typeof data_contacts;
  "data/conversation": typeof data_conversation;
  "data/interactiveReply": typeof data_interactiveReply;
  "data/location": typeof data_location;
  "data/media": typeof data_media;
  "data/status": typeof data_status;
  "data/text": typeof data_text;
  "data/unsupported": typeof data_unsupported;
  flow: typeof flow;
  http: typeof http;
  message: typeof message;
  node: typeof node;
  openai: typeof openai;
  "tables/bot": typeof tables_bot;
  "tables/conversation": typeof tables_conversation;
  "tables/customerBot": typeof tables_customerBot;
  "tables/data": typeof tables_data;
  "tables/message": typeof tables_message;
  "tables/user": typeof tables_user;
  "tables/userConversation": typeof tables_userConversation;
  users: typeof users;
  user_conversation: typeof user_conversation;
  webhooks: typeof webhooks;
  whatsapp: typeof whatsapp;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
