/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Card, Notification, Text } from "@mantine/core";
import { useMemo } from "react";

import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";
import { MessageInteractiveReplyButtons } from "./interactive_replies/MessageInteractiveReplyButtons";
import { MessageInteractiveReplyFlow } from "./interactive_replies/MessageInteractiveReplyFlow";
import { MessageInteractiveReplyList } from "./interactive_replies/MessageInteractiveReplyList";

export const MessageInteractiveReply = ({ msg }: MessageWrapperProps) => {
  const type = msg.interactive_reply?.type;

  const component = useMemo(() => {
    switch (type) {
      case "flow_reply":
        return <MessageInteractiveReplyFlow msg={msg} />;
      case "button_reply":
        return <MessageInteractiveReplyButtons msg={msg} />;
      case "list_reply":
        return <MessageInteractiveReplyList msg={msg} />;
      default:
        return <Text>Unknown interactive reply {type}</Text>;
    }
  }, [msg, type]);

  return (
    <MessageWrapper msg={msg}>
      <Card.Section>
        <Notification
          color="green"
          bg="green.1"
          px="md"
          py="4px"
          mt="md"
          mx="md"
          mb="4px"
          radius="md"
          withCloseButton={false}
        >
          <Text size="xs" c="dimmed">
            {msg.reply?.interactive?.header?.text}
          </Text>
          <Text size="xs" c="dimmed">
            {msg.reply?.interactive?.body?.text}
          </Text>
          <Text size="xs" c="dimmed">
            {msg.reply?.interactive?.footer?.text}
          </Text>
        </Notification>
      </Card.Section>
      {component}
      <MessageTime msg={msg} />
    </MessageWrapper>
  );
};
