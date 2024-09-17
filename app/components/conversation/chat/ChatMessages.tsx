import { Card, Flex, Text } from "@mantine/core";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useScroll } from "~/providers/ScrollProvider";
import { MessageImage } from "./messages/MessageImage";
import { MessageInteractive } from "./messages/MessageInteractive";
import { MessageInteractiveReply } from "./messages/MessageInteractiveReply";
import { MessageInternal } from "./messages/MessageInternal";
import { MessageLocation } from "./messages/MessageLocation";
import { MessageSystem } from "./messages/MessageSystem";
import { MessageText } from "./messages/MessageText";
import { MessageUnknown } from "./messages/MessageUnknown";
import { MessageWrapperProps } from "./messages/MessageWrapper";

export function ChatMessages({
  messages,
  viewportRef,
}: {
  messages: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"];
  viewportRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollPosition } = useScroll();
  const [stickyStates, setStickyStates] = useState<Record<string, boolean>>({});

  const formatDate = (timestamp: number) => {
    const messageDate = dayjs(timestamp * 1000);
    const currentDate = dayjs();

    const daysDifference = currentDate.diff(messageDate, "day");

    if (daysDifference <= 4) {
      // If the message is within the last 4 days, show the day name
      return messageDate.format("dddd");
    } else {
      // Otherwise, show the full date (MM/DD/YYYY)
      return messageDate.format("DD/MM/YYYY");
    }
  };

  // Function to determine if the day has changed between two messages
  const hasDayChanged = (
    currentMessage: UsePaginatedQueryReturnType<
      typeof api.message.paginate
    >["results"][0],
    previousMessage: UsePaginatedQueryReturnType<
      typeof api.message.paginate
    >["results"][0]
  ) => {
    return !dayjs(currentMessage.timestamp * 1000).isSame(
      previousMessage.timestamp * 1000,
      "day"
    );
  };

  useEffect(() => {
    if (!viewportRef.current) return;
    const messagesElements =
      viewportRef.current.querySelectorAll("[data-message-id]");

    const newStickyStates: Record<string, boolean> = {};

    messagesElements.forEach((element: Element) => {
      const rect = element.getBoundingClientRect();
      const messageDate = element.getAttribute("data-message-date");

      if (messageDate && !newStickyStates[messageDate]) {
        // Make the date sticky if it's above the current viewport (i.e., it has scrolled past)
        newStickyStates[messageDate] = rect.top <= 70;
      }
    });

    setStickyStates(newStickyStates);
  }, [scrollPosition, viewportRef]);

  const MessageComponents: Record<
    string,
    React.FC<{ msg: MessageWrapperProps["msg"] }>
  > = {
    text: MessageText,
    image: MessageImage,
    interactive: MessageInteractive,
    interactive_reply: MessageInteractiveReply,
    system: MessageSystem,
    location: MessageLocation,
    internal_message: MessageInternal,
  };

  return (
    <div>
      {messages.reverse().map((msg, index) => {
        const MessageComponent = MessageComponents[msg.type] || MessageUnknown;

        const showDateHeader =
          index === 0 || hasDayChanged(msg, messages[index - 1]);

        const date = dayjs(msg.timestamp * 1000).format("MM/DD/YYYY");

        const isSticky = stickyStates[date];

        return (
          <div
            key={msg._id}
            id={msg._id}
            data-message-id={msg._id}
            data-message-date={date}
          >
            {showDateHeader && (
              <Flex justify="center" p="0" m="0">
                <Card
                  px="xs"
                  py="2px"
                  mt="4px"
                  shadow="xs"
                  radius="md"
                  miw="80px"
                  style={{
                    position: isSticky ? "absolute" : "static",
                    top: isSticky ? "0px" : "auto",
                    zIndex: index + 10,
                  }}
                >
                  <Text c="dimmed" fz="xs" fw="400" ta="center">
                    {formatDate(msg.timestamp)}
                  </Text>
                </Card>
              </Flex>
            )}
            <MessageComponent msg={msg} />
          </div>
        );
      })}
    </div>
  );
}
