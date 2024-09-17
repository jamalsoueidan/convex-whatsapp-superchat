import { ScrollArea, ScrollAreaProps } from "@mantine/core";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useScroll } from "~/providers/ScrollProvider";

export const InfiniteScroll = forwardRef<
  HTMLDivElement | null,
  {
    data: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"];
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
    loadMore: (numItems: number) => void;
    children: ReactNode;
  } & ScrollAreaProps
>(({ data, status, loadMore, children }, ref) => {
  const { setScrollPosition } = useScroll();

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
  }, []);

  // Load more when user scrolls to the top
  const onTopReached = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(20);
      message.current = data[0]._id;
    }
  }, [status, data, loadMore]);

  useEffect(() => {
    if (status === "CanLoadMore" && message.current) {
      scrollToMessage();
      message.current = null;
    }
  }, [data, scrollToMessage, status]);

  return (
    <ScrollArea
      type="auto"
      bg="#efeae2"
      px="xs"
      flex="1"
      onScrollPositionChange={setScrollPosition}
      onTopReached={onTopReached}
      viewportRef={viewport}
    >
      {children}
    </ScrollArea>
  );
});

InfiniteScroll.displayName = "InfiniteScroll";
