import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { mutationWithUser, queryWithUser } from "./auth";

export const paginate = queryWithUser({
  args: {
    paginationOpts: paginationOptsValidator,
    conversation: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    const paginate = await ctx.db
      .query("message")
      .withIndex("by_conversation", (q) =>
        q.eq("conversation", args.conversation)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    /*const page = await Promise.all(
      paginate.page.map(async (message) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), message.user))
          .first();

        const reply = await ctx.db
          .query("message")
          .filter((q) => q.eq(q.field("_id"), message.reply))
          .first();

        const storage = message.storage
          ? await ctx.storage.getUrl(message.storage)
          : undefined;

        return { ...message, user, reply, storage };
      })
    );*/

    return {
      ...paginate,
      page: paginate.page.sort((a, b) => a.timestamp - b.timestamp),
    };
  },
});

// to show in the conversation card the last message that was send
export const getLastMessageInConversation = queryWithUser({
  args: {
    conversation: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("message")
      .withIndex("by_conversation", (q) =>
        q.eq("conversation", args.conversation)
      )
      .order("desc")
      .first();
  },
});

// this is used in the front end to send message
export const send = mutationWithUser({
  args: {
    conversation: v.id("conversation"),
    type: v.string(),
    interactive: v.optional(v.any()),
    location: v.optional(v.any()),
    text: v.optional(
      v.object({
        body: v.string(),
        preview_url: v.optional(v.boolean()),
      })
    ),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversation);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    try {
      //create the message FAST to indicate to user its send!
      const response = await ctx.db.insert("message", {
        user: ctx.user,
        msg_id: args.type === "internal_message" ? "system" : "not_send_yet",
        conversation: conversation._id,
        business_phone_number_id: conversation.business_phone_number_id,
        recipient: conversation.customer_phone_number,
        type: args.type,
        timestamp: args.timestamp,
        ...(args.text ? { text: args.text } : {}),
        ...(args.interactive ? { interactive: args.interactive } : {}),
        ...(args.location ? { location: args.location } : {}),
      });

      // update conversation timestamp
      await ctx.scheduler.runAfter(0, internal.conversation.updateTimestamp, {
        conversation: args.conversation,
        timestamp: args.timestamp,
      });

      if (args.type !== "internal_message") {
        // lets send to whatsapp in the background
        await ctx.scheduler.runAfter(0, internal.whatsapp.send, {
          message: response,
          business_phone_number_id: conversation.business_phone_number_id,
          to: conversation.customer_phone_number,
          type: args.type,
          ...(args.text ? { text: args.text } : {}),
          ...(args.interactive ? { interactive: args.interactive } : {}),
          ...(args.location ? { location: args.location } : {}),
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
});

export const updateMessage = internalMutation({
  args: {
    message: v.id("message"),
    msg_id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.message, {
      msg_id: args.msg_id,
    });
  },
});
