import { ScrollArea, ScrollAreaProps } from "@mantine/core";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

export const InfiniteScroll = forwardRef<
  HTMLDivElement | null,
  {
    data: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"];
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
    loadMore: (numItems: number) => void;
    children: ReactNode;
  } & ScrollAreaProps
>(({ data, status, loadMore, children, onScrollPositionChange }, ref) => {
  const viewport = useRef<HTMLDivElement>(null);

  // Use useImperativeHandle to expose the ref
  useImperativeHandle(ref, () => viewport.current as HTMLDivElement);
  const message = useRef<string | null>(null);

  const scrollToMessage = useCallback(() => {
    if (!message.current) return;
    const element = document.getElementById(message.current);

    if (element) {
      element.scrollIntoView({ behavior: "instant", block: "start" });
    }
    message.current = null;
  }, []);

  // Load more when user scrolls to the top
  const onTopReached = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(20);
      message.current = data[data.length - 1]._id;
      console.log(data[data.length - 1]);
    }
  }, [status, data, loadMore]);

  useLayoutEffect(() => {
    if (status === "CanLoadMore" && message.current) {
      scrollToMessage();
    }
  }, [data, scrollToMessage, status]);

  return (
    <ScrollArea
      type="auto"
      bg="#efeae2"
      px="xs"
      flex="1"
      onScrollPositionChange={onScrollPositionChange}
      onTopReached={onTopReached}
      viewportRef={viewport}
    >
      {children}
    </ScrollArea>
  );
});

InfiniteScroll.displayName = "InfiniteScroll";
