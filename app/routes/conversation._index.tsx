import { Flex, Stack, Text, Title } from "@mantine/core";
import { IconPhone } from "@tabler/icons-react";

export default function ConversationIndex() {
  return (
    <Flex
      bg="#f0f2f5"
      flex="1"
      direction="column"
      style={{ overflow: "hidden" }}
      align="center"
      justify="center"
      gap="md"
    >
      <IconPhone size={128} stroke={1} />
      <Title order={3} fw={600}>
        Select a conversation
      </Title>
      <Stack gap="0">
        <Text c="gray">
          Send and receive message s without keeping your phone online.
        </Text>
        <Text c="gray">
          Send and receive message s without keeping your phone online.
        </Text>
      </Stack>
    </Flex>
  );
}
