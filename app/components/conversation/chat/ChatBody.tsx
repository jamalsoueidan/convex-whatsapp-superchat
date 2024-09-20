import { useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { useLastSeenConversation } from "~/hooks/useLastSeenConversation";

import { useCountUnreadMessages } from "~/hooks/useCountUnreadMessages";
import { ChatEditor } from "./ChatEditor";
import { ChatMessages } from "./ChatMessages";

export function ChatBody() {
  const user = useQuery(api.auth.currentUser);
  const { conversationId } = useParams();
  const viewport = useRef<HTMLDivElement>(null);
  const { results, status, loadMore } = usePaginatedQuery(
    api.message.paginate,
    { conversation: conversationId as Id<"conversation"> },
    { initialNumItems: 15 }
  );

  const unreadMessageCount = useCountUnreadMessages(
    conversationId as Id<"conversation">
  );
  const [, setLastSeenAt] = useLastSeenConversation(
    conversationId as Id<"conversation">
  );

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
        unreadMessageCount={unreadMessageCount}
        viewport={viewport}
      />
      <ChatEditor />
    </Fragment>
  );
}
