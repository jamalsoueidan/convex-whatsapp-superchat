import { Card, Flex, Text } from "@mantine/core";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";

import dayjs from "dayjs";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { ChatScrollToBottom } from "~/components/conversation/chat/ChatScrollToBottom";
import { useInteractiveObserver } from "~/hooks/useInteractiveObserver";
import { MessageAudio } from "./messages/MessageAudio";
import { MessageImage } from "./messages/MessageImage";
import { MessageInteractive } from "./messages/MessageInteractive";
import { MessageInteractiveReply } from "./messages/MessageInteractiveReply";
import { MessageInternal } from "./messages/MessageInternal";
import { MessageLocation } from "./messages/MessageLocation";
import { MessageSystem } from "./messages/MessageSystem";
import { MessageText } from "./messages/MessageText";
import { MessageUnknown } from "./messages/MessageUnknown";
import { MessageVideo } from "./messages/MessageVideo";
import { MessageWrapperProps } from "./messages/MessageWrapper";

const MessageComponents: Record<
  string,
  React.FC<{ msg: MessageWrapperProps["msg"] }>
> = {
  text: MessageText,
  image: MessageImage,
  video: MessageVideo,
  audio: MessageAudio,
  interactive: MessageInteractive,
  interactive_reply: MessageInteractiveReply,
  system: MessageSystem,
  location: MessageLocation,
  internal_message: MessageInternal,
};

export const ChatMessages = ({
  messages,
  onTopReached,
  onBottomReached,
  unreadMessageCount,
  viewport,
}: {
  messages: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"];
  onTopReached?: () => void;
  onBottomReached?: () => void;
  unreadMessageCount: number;
  viewport: React.RefObject<HTMLDivElement>;
}) => {
  const { ref: topObserverTarget, visible: topVisible } =
    useInteractiveObserver();
  const { ref: bottomObserverTarget, visible: bottomVisible } =
    useInteractiveObserver();

  useEffect(() => {
    if (topVisible && onTopReached) {
      onTopReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topVisible]);

  useEffect(() => {
    if (bottomVisible && onBottomReached) {
      onBottomReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomVisible]);

  const formatDate = useCallback((timestamp: number) => {
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
  }, []);

  const scrollToBotom = useCallback(() => {
    if (!viewport.current) return;
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "instant",
    });
  }, [viewport]);

  const groupedMessages = useMemo(
    () =>
      messages.reduce((groups, msg) => {
        const date = formatDate(msg.timestamp);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(msg);
        groups[date].sort((a, b) => a.timestamp - b.timestamp);
        return groups;
      }, {} as Record<string, typeof messages>),
    [formatDate, messages]
  );

  return (
    <Fragment>
      <Flex
        direction="column-reverse"
        flex={1}
        pos="sticky"
        style={{
          overflow: "auto",
          overflowAnchor: "none",
        }}
        ref={viewport}
      >
        <div ref={bottomObserverTarget} style={{ visibility: "hidden" }}>
          <Text fz="xs">OnBottomReached</Text>
        </div>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Flex justify="center" p="0" m="0">
                <Card
                  px="xs"
                  py="2px"
                  mt="4px"
                  shadow="xs"
                  radius="md"
                  miw="80px"
                  mih="24px"
                >
                  <Text c="dimmed" fz="xs" fw="400" ta="center">
                    {date}
                  </Text>
                </Card>
              </Flex>
            </div>

            {groupedMessages[date].map((msg) => {
              const MessageComponent =
                MessageComponents[msg.type] || MessageUnknown;
              return <MessageComponent msg={msg} key={msg._id} />;
            })}
          </div>
        ))}
        <div ref={topObserverTarget} style={{ visibility: "hidden" }}>
          <Text fz="xs">onTopReached</Text>
        </div>
      </Flex>
      <ChatScrollToBottom
        isAtBottom={bottomVisible}
        label={unreadMessageCount}
        scrollToBotom={scrollToBotom}
      />
    </Fragment>
  );
};
