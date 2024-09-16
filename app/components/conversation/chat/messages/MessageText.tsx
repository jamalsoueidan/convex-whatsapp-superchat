import { Text } from "@mantine/core";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageText = ({ msg }: MessageWrapperProps) => {
  return (
    <MessageWrapper msg={msg}>
      <Text
        size="sm"
        c="gray.9"
        style={{ whiteSpace: "pre-line" }}
        dangerouslySetInnerHTML={{
          __html: (msg.text?.body || "").replace(/\n\n/g, "<br />"),
        }}
      />

      <MessageTime msg={msg} />
    </MessageWrapper>
  );
};
