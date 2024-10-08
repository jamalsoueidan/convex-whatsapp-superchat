import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback } from "react";

export function useLastSeenConversation(
  conversationId: Id<"conversation">
): [number, () => void] {
  const userConversation = useQuery(api.user_conversation.get, {
    conversation: conversationId,
  });
  const update = useMutation(api.user_conversation.update);

  const lastSeenAt = userConversation ? userConversation.last_seen_at : 0;

  const setLastSeenAt = useCallback(() => {
    update({
      conversation: conversationId,
      last_seen_at: Math.floor(Date.now() / 1000), // should be same as backend +20, this a bug now fix later,
    });
  }, [conversationId, update]);

  return [lastSeenAt, setLastSeenAt];
}
