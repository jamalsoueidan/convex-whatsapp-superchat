import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useCountUnreadMessages = (conversation: Id<"conversation">) => {
  const unreadMessageCount = useQuery(api.user_conversation.count, {
    conversation,
  });
  return unreadMessageCount || 0;
};
