/* eslint-disable react/prop-types */
import { ActionIcon, Indicator, rem, Transition } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useEffect } from "react";

export const ScrollToBottomButton: React.FC<{
  viewportRef: React.RefObject<HTMLDivElement>;
  label: number;
}> = ({ viewportRef, label }) => {
  const isAtBottom =
    viewportRef.current &&
    viewportRef.current.scrollHeight - viewportRef.current.scrollTop ===
      viewportRef.current.clientHeight;

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    console.log("isAtBottom", isAtBottom);
  }, [isAtBottom]);

  return (
    <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
      <Transition transition="slide-up" mounted={!!isAtBottom}>
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
