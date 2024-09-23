import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { useLastSeenConversation } from "~/hooks/useLastSeenConversation";

import { useConversation } from "~/providers/ConversationProvider";
import { useUser } from "~/providers/UserProvider";
import { ChatEditor } from "./ChatEditor";
import { ChatMessages } from "./ChatMessages";

export function ChatBody() {
  const user = useUser();
  const conversation = useConversation();
  const viewport = useRef<HTMLDivElement>(null);
  const { results, status, loadMore } = usePaginatedQuery(
    api.message.paginate,
    { conversation: conversation._id },
    { initialNumItems: 15 }
  );

  const [, setLastSeenAt] = useLastSeenConversation(conversation._id);

  const previousMessage = useRef<Id<"message"> | null>(null);

  const scrollToBotom = useCallback(() => {
    if (!viewport.current) return;
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (results.length === 0) return;
    const lastMessage = results[0];

    const isLastMessageNew = previousMessage.current !== lastMessage._id;
    const isMyMessage = lastMessage.user?._id === user?._id;

    if (isLastMessageNew && isMyMessage) {
      previousMessage.current = lastMessage._id;
      return scrollToBotom();
    }
  }, [results, scrollToBotom, user?._id]);

  const onTopReached = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(5);
    }
  }, [loadMore, status]);

  const onBottomReached = useCallback(() => {
    setLastSeenAt();
  }, [setLastSeenAt]);

  return (
    <Fragment>
      <ChatMessages
        messages={results}
        onTopReached={onTopReached}
        onBottomReached={onBottomReached}
        unreadMessageCount={conversation.unreadMessageCount}
        viewport={viewport}
      />
      <ChatEditor />
    </Fragment>
  );
}
