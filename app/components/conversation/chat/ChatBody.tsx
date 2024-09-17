import { useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { useLastSeenConversation } from "~/hooks/useLastSeenConversation";
import { ChatMessages } from "./ChatMessages";

import { ScrollToBottomButton } from "~/components/ScrollToBottomButton";
import { useCountUnreadMessages } from "~/hooks/useCountUnreadMessages";
import { ChatEditor } from "./ChatEditor";

export function ChatBody() {
  const user = useQuery(api.auth.currentUser);
  const { conversationId } = useParams();
  const viewport = useRef<HTMLDivElement>(null);
  const { results, status, loadMore } = usePaginatedQuery(
    api.message.paginate,
    { conversation: conversationId as Id<"conversation"> },
    { initialNumItems: 25 }
  );
  const unreadMessageCount = useCountUnreadMessages(
    conversationId as Id<"conversation">
  );
  const [, setLastSeenAt] = useLastSeenConversation(
    conversationId as Id<"conversation">
  );

  results.sort((a, b) => b.timestamp - a.timestamp);

  const previousMessage = useRef<Id<"message"> | null>(null);

  const scrollToBotom = useCallback(() => {
    if (!viewport.current) return;
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "instant",
    });
  }, []);

  // Scroll to bottom when a new message is sent from me
  // Scroll to bottom on first load
  useEffect(() => {
    if (results.length === 0) return;
    const lastMessage = results[results.length - 1];

    //first time load conversation
    if (!previousMessage.current) {
      previousMessage.current = lastMessage._id;
      setLastSeenAt();
      return scrollToBotom();
    }

    const isLastMessageNew = previousMessage.current !== lastMessage._id;
    const isMyMessage = lastMessage.user?._id === user?._id;

    if (isLastMessageNew && isMyMessage) {
      previousMessage.current = lastMessage._id;
      return scrollToBotom();
    }
  }, [results, scrollToBotom, setLastSeenAt, user?._id]);

  const onScrollPositionChange = useCallback(() => {
    if (!viewport.current) return;
    const isBottom =
      viewport.current?.scrollHeight -
        viewport.current.scrollTop -
        viewport.current.clientHeight <
      10;

    if (isBottom) {
      setLastSeenAt();
    }
  }, [setLastSeenAt]);

  // in case the message is few, and we dont have a scrollbar
  useEffect(() => {
    if (!viewport.current) return;

    const hasMoreToScroll =
      viewport.current.scrollHeight -
        viewport.current.scrollTop -
        viewport.current.clientHeight >
      0;

    if (!hasMoreToScroll && results.length > 0) {
      setLastSeenAt();
    }
  }, [results, setLastSeenAt]);

  if (status !== "LoadingFirstPage") {
    return null;
  }

  return (
    <>
      <InfiniteScroll
        data={results}
        status={status}
        loadMore={loadMore}
        ref={viewport}
        onScrollPositionChange={onScrollPositionChange}
      >
        <ChatMessages viewportRef={viewport} messages={results} />
        <ScrollToBottomButton
          viewportRef={viewport}
          label={unreadMessageCount}
        />
      </InfiniteScroll>
      <ChatEditor />
    </>
  );
}
