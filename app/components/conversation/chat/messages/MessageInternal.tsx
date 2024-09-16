import { Text } from "@mantine/core";
import "./MessageSystem.css";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageInternal = ({ msg }: MessageWrapperProps) => {
  return (
    <MessageWrapper msg={msg} bg="yellow.1">
      <Text
        size="sm"
        c="gray.9"
        style={{ whiteSpace: "pre-line" }}
        dangerouslySetInnerHTML={{
          __html: (msg.text?.body || "")
            .replace(/\n\n/g, "<br />")
            .replace(/^<p>|<\/p>$/g, ""),
        }}
      />
      <MessageTime msg={msg} />
    </MessageWrapper>
  );
};
