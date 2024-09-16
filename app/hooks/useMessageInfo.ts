import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { useConversation } from "~/providers/ConversationProvider";

export function useMessageInfo(
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0]
) {
  const conversation = useConversation();
  const receivedDate = new Date(msg.timestamp * 1000);
  const isRecipientDifferent =
    msg.recipient !== conversation?.customer_phone_number;

  return {
    receivedDate,
    isRecipientDifferent,
  };
}
