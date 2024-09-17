/* eslint-disable react/prop-types */
import { ActionIcon, Indicator, rem, Transition } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const ScrollToBottomButton: React.FC<{
  viewportRef: React.RefObject<HTMLDivElement>;
  label: number;
}> = ({ viewportRef, label }) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentViewport = viewportRef.current;

    if (!currentViewport) return;

    const handleScroll = () => {
      // Check if the scroll is at the bottom
      const isBottom =
        currentViewport.scrollHeight - currentViewport.scrollTop <=
        currentViewport.clientHeight + 1;

      setIsAtBottom(isBottom);
    };

    currentViewport.addEventListener("scroll", handleScroll);

    return () => {
      currentViewport.removeEventListener("scroll", handleScroll);
    };
  }, [viewportRef]);

  return (
    <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
      <Transition transition="slide-up" mounted={!isAtBottom}>
        {(transitionStyles) => (
          <Indicator
            disabled={label === 0 || !isAtBottom}
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
