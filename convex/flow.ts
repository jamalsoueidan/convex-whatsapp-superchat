import { v } from "convex/values";
import { actionWithUser } from "./auth";
import { getFB } from "./functions";

export type Flow = {
  id: string;
  name: string;
  status: "DEPRECATED" | "PUBLISHED" | "DRAFT";
  categories: string[];
  validation_errors: string[];
};

export type GetFlow = {
  preview: {
    preview_url: string;
    expires_at: string;
  };
} & Flow;

export type Json = {
  data: Flow[];
};

export const list = actionWithUser({
  args: {},
  handler: async () => {
    const response = await getFB(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/flows?status=DRAFT`
    );

    return response.json() as Promise<Json>;
  },
});

export const get = actionWithUser({
  args: {
    flowId: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await getFB(
      `https://graph.facebook.com/v20.0/${args.flowId}?fields=id,name,categories,preview,status,validation_errors,json_version,data_api_version,data_channel_uri,whatsapp_business_account,application`
    );

    return response.json() as Promise<GetFlow>;
  },
});
