/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Group, rem, Text } from "@mantine/core";

import { IconGps } from "@tabler/icons-react";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageLocation = ({ msg }: MessageWrapperProps) => {
  return (
    <MessageWrapper msg={msg}>
      <Group gap={rem(3)}>
        <IconGps stroke="1" />
        <Text size="sm" c="gray.9" fw="bold">
          Send location
        </Text>
      </Group>

      <Text size="xs" c="dimmed">
        {msg.location?.name}
      </Text>
      <Text size="xs" c="dimmed">
        {msg.location?.address}
      </Text>
      <Text size="xs" c="dimmed">
        {msg.location?.latitude}
      </Text>

      <MessageTime msg={msg} />
    </MessageWrapper>
  );
};
