import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useConversation } from "~/providers/ConversationProvider";

export const useSendMessage = () => {
  const user = useQuery(api.auth.currentUser);
  const conversation = useConversation();

  const send = useMutation(api.message.send).withOptimisticUpdate(
    (localStore, args) => {
      const paginationValues = localStore.getAllQueries(api.message.paginate);
      const value = paginationValues.filter(
        (value) => value.args.conversation === conversation._id
      )[0];
      if (value && value.value) {
        localStore.setQuery(api.message.paginate, value.args, {
          ...value.value,
          page: [
            ...value.value.page,
            {
              _id: crypto.randomUUID() as Id<"message">,
              user,
              _creationTime: Date.now(),
              business_phone_number_id: conversation.business_phone_number_id,
              msg_id: "not_send_yet",
              recipient: conversation.customer_phone_number,
              ...args,
            },
          ] as never,
        });
      }
    }
  );

  return send;
};
