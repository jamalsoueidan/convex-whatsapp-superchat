import { ActionIcon, Avatar, Flex, Text } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import { IconArrowLeft, IconGripVertical } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useConversation } from "~/providers/ConversationProvider";

dayjs.extend(relativeTime);

export function ChatHeader() {
  const location = useLocation();
  const isMatch = location.pathname.endsWith("/settings");
  const conversation = useConversation();
  const receivedDate = dayjs(conversation.timestamp * 1000);

  return (
    <Flex
      px="sm"
      py="xs"
      h="60px"
      align="center"
      bg="#3a5664"
      justify="space-between"
    >
      <Flex gap="0" align="center">
        <ActionIcon
          variant="transparent"
          aria-label="Back"
          color="white"
          component={Link}
          to="/conversation"
          hiddenFrom="md"
        >
          <IconArrowLeft stroke={2.5} />
        </ActionIcon>
        <Flex gap="xs">
          <Avatar color="white" radius="xl" bg="gray.1" size="md" />
          <Flex direction="column" gap="0">
            <Text lh="xs" c="white">
              {conversation.name || conversation.customer_phone_number}{" "}
            </Text>
            <Text lh="xs" fz="xs" c="white">
              last seen {receivedDate.fromNow()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="md" align="center">
        <ActionIcon
          variant="transparent"
          aria-label="Back"
          color="white"
          component={Link}
          to={
            !isMatch
              ? `/conversation/${conversation._id}/settings`
              : `/conversation/${conversation._id}`
          }
        >
          <IconGripVertical stroke={2.5} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
}
