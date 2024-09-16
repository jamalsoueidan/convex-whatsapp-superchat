import { Text } from "@mantine/core";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageUnknown = ({ msg }: MessageWrapperProps) => {
  return (
    <MessageWrapper msg={msg}>
      <Text size="xs" c="gray.6">
        unknown {msg.type}
      </Text>
      <MessageTime msg={msg} />
    </MessageWrapper>
  );
};
