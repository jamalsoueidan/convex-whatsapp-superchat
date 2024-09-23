/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button, Card, Divider, Group, rem, Text } from "@mantine/core";

import { Link } from "@remix-run/react";
import { IconGps } from "@tabler/icons-react";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageLocation = ({ msg }: MessageWrapperProps) => {
  const { latitude, longitude } = msg.location!;

  return (
    <MessageWrapper msg={msg}>
      <Group gap={rem(3)}>
        <IconGps stroke="1" />
        <Text size="sm" c="gray.9" fw="bold">
          Location
        </Text>
      </Group>
      {msg.location?.name && (
        <Text size="xs" c="dimmed">
          {msg.location?.name}
        </Text>
      )}
      {msg.location?.address && (
        <Text size="xs" c="dimmed">
          {msg.location?.address}
        </Text>
      )}

      <Text size="xs" c="dimmed">
        {latitude},{longitude}
      </Text>

      <MessageTime msg={msg} />
      <Card.Section>
        <Divider />
      </Card.Section>
      <Button
        variant="transparent"
        component={Link}
        to={`https://maps.google.com?q=${latitude},${longitude}`}
        target="_blank"
      >
        View map
      </Button>
    </MessageWrapper>
  );
};
