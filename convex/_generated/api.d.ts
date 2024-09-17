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
import type * as data from "../data.js";
import type * as datatypes_conversation from "../datatypes/conversation.js";
import type * as datatypes_interactiveReply from "../datatypes/interactiveReply.js";
import type * as datatypes_media from "../datatypes/media.js";
import type * as datatypes_status from "../datatypes/status.js";
import type * as datatypes_text from "../datatypes/text.js";
import type * as flow from "../flow.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as node from "../node.js";
import type * as openai from "../openai.js";
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
  data: typeof data;
  "datatypes/conversation": typeof datatypes_conversation;
  "datatypes/interactiveReply": typeof datatypes_interactiveReply;
  "datatypes/media": typeof datatypes_media;
  "datatypes/status": typeof datatypes_status;
  "datatypes/text": typeof datatypes_text;
  flow: typeof flow;
  http: typeof http;
  message: typeof message;
  node: typeof node;
  openai: typeof openai;
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
