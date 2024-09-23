import { em, Flex, Group, rem, Text } from "@mantine/core";
import { IconCheck, IconChecks } from "@tabler/icons-react";
import dayjs from "dayjs";

import { MessageWrapperProps } from "./MessageWrapper";

export function MessageTime({
  msg,
  withChecks = true,
}: MessageWrapperProps & { withChecks?: boolean }) {
  const messageDate = dayjs(msg.timestamp * 1000);
  const isRead = !!msg.statuses?.find((r) => r.status === "read");
  const isFailed = !!msg.statuses?.find((r) => r.status === "failed");

  const checks = isFailed ? (
    <IconCheck size={em(16)} style={{ color: isRead ? "#53bdeb" : "gray" }} />
  ) : (
    <IconChecks size={em(16)} style={{ color: isRead ? "#53bdeb" : "gray" }} />
  );
  return (
    <Flex justify="flex-end">
      <Group gap="4px">
        <Text size={rem(11)} c="gray.6" lh="0">
          {messageDate.format("HH:mm")}
        </Text>
        {withChecks ? checks : null}
      </Group>
    </Flex>
  );
}
