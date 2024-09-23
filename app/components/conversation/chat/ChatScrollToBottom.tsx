/* eslint-disable react/prop-types */
import { ActionIcon, Indicator, rem, Transition } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";

export const ChatScrollToBottom: React.FC<{
  isAtBottom: boolean;
  label: number | string;
  scrollToBotom: () => void;
}> = ({ isAtBottom, label, scrollToBotom }) => {
  return (
    <div style={{ position: "fixed", bottom: "130px", right: "25px" }}>
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
              onClick={scrollToBotom}
              color="white"
              radius="xl"
              size="lg"
            >
              <IconArrowDown style={{ width: rem(24), height: rem(24) }} />
            </ActionIcon>
          </Indicator>
        )}
      </Transition>
    </div>
  );
};
