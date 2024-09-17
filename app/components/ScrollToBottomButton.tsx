/* eslint-disable react/prop-types */
import { ActionIcon, Indicator, rem, Transition } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { useCallback, useEffect, useState } from "react";

export const ScrollToBottomButton: React.FC<{
  viewportRef: React.RefObject<HTMLDivElement>;
  label: number;
  messages: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"];
}> = ({ viewportRef, label, messages }) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [viewportRef]);

  const checkIfAtBottom = useCallback(() => {
    if (!viewportRef.current) return;

    const isBottom =
      viewportRef.current.scrollHeight - viewportRef.current.scrollTop <=
      viewportRef.current.clientHeight + 1;

    setIsAtBottom(isBottom);
  }, [viewportRef]);

  useEffect(() => {
    const currentViewport = viewportRef.current;

    if (!currentViewport) return;

    const handleScroll = () => {
      checkIfAtBottom();
    };

    currentViewport.addEventListener("scroll", handleScroll);

    return () => {
      currentViewport.removeEventListener("scroll", handleScroll);
    };
  }, [checkIfAtBottom, viewportRef]);

  useEffect(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom, messages]);

  return (
    <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
      <Transition transition="slide-up" mounted={!isAtBottom}>
        {(transitionStyles) => (
          <Indicator
            disabled={label === 0 || !!isAtBottom}
            position="top-start"
            offset={7}
            inline
            label={label}
            color="green"
            size={18}
          >
            <ActionIcon
              variant="default"
              style={transitionStyles}
              onClick={scrollToBottom}
              color="white"
              radius="xl"
              size="xl"
            >
              <IconArrowDown style={{ width: rem(24), height: rem(24) }} />
            </ActionIcon>
          </Indicator>
        )}
      </Transition>
    </div>
  );
};
