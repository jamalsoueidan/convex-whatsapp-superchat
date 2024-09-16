/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, Flex, rem, Text } from "@mantine/core";
import { MessageWrapperProps } from "../MessageWrapper";

export const MessageInteractiveReplyList = ({ msg }: MessageWrapperProps) => {
  const interactiveReply = msg.interactive_reply;

  return (
    <Flex direction="column" gap={rem(4)} mt={rem(4)}>
      <Text fz="sm">User picked:</Text>
      <Button color="green.6" size="compact-sm">
        {interactiveReply?.list_reply?.title}
      </Button>
    </Flex>
  );
};
