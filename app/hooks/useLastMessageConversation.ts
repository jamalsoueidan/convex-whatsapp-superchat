import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useLastMessageConversation(conversation: Id<"conversation">) {
  return useQuery(api.message.getLastMessageInConversation, { conversation });
}
