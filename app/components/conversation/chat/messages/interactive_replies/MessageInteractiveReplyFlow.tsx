/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Stack, Text } from "@mantine/core";

import { MessageWrapperProps } from "../MessageWrapper";

export const MessageInteractiveReplyFlow = ({ msg }: MessageWrapperProps) => {
  const flowReply = msg.interactive_reply?.flow_reply;

  if (!flowReply) {
    return null;
  }

  return (
    <Stack gap="xs">
      {Object.keys(flowReply).map((key) => (
        <div key={key}>
          <Text size="sm" c="gray.9" mt="4px" fw="bold">
            {flowReply[key].question}
          </Text>
          <Text size="sm" c="gray.9">
            {flowReply[key].type === "date"
              ? new Date(flowReply[key].value || "").toLocaleDateString()
              : flowReply[key].value}
          </Text>
        </div>
      ))}
    </Stack>
  );
};
