import {
  Avatar,
  Badge,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { Link } from "@remix-run/react";
import { Doc } from "convex/_generated/dataModel";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCountUnreadMessages } from "~/hooks/useCountUnreadMessages";
import { useLastMessageConversation } from "~/hooks/useLastMessageConversation";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const ConversationCard = ({
  conversation,
  selected,
}: {
  conversation: Doc<"conversation">;
  selected: boolean;
}) => {
  const message = useLastMessageConversation(conversation._id);
  const receivedDate = new Date(conversation.timestamp * 1000);
  const unreadMessageCount = useCountUnreadMessages(conversation._id);

  return (
    <>
      <Card
        p="xs"
        mr="xs"
        component={Link}
        to={`/conversation/${conversation._id}`}
        prefetch="intent"
        bg={selected ? "gray.1" : undefined}
        radius="0"
      >
        <Group>
          <Avatar size="lg" />
          <Flex flex={1}>
            <Stack gap="0" flex={1}>
              <Text>{conversation.name}</Text>
              {message ? (
                <Text lineClamp={1}>
                  {truncateText(
                    message.text?.body ||
                      message.interactive?.body?.text ||
                      message.interactive_reply?.flow_name ||
                      "",
                    25 // Set the maximum length (e.g., 100 characters)
                  )}
                </Text>
              ) : null}
            </Stack>
            <Stack align="flex-end" justify="center" gap="2px">
              <Text c="green" size="xs" fw="500">
                {formatReceivedDate(receivedDate)}
              </Text>
              {unreadMessageCount > 0 && (
                <Badge color="green" size="md" radius="200px" p="7px">
                  {unreadMessageCount}
                </Badge>
              )}
            </Stack>
          </Flex>
        </Group>
      </Card>
      <Divider p="0" m="0" mr="xs" />
    </>
  );
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

function formatReceivedDate(receivedDate: Date) {
  const now = dayjs();
  const date = dayjs(receivedDate);

  if (date.isSame(now, "day")) {
    // If the date is today, return the time (e.g., 13:34)
    return date.format("HH:mm");
  } else if (date.isSame(now.subtract(1, "day"), "day")) {
    // If the date is yesterday, return 'yesterday'
    return "yesterday";
  } else if (
    date.isSameOrAfter(now.startOf("week")) &&
    date.isSameOrBefore(now.endOf("week"))
  ) {
    // If the date is within this week, return the day of the week (e.g., Saturday)
    return date.format("dddd");
  } else {
    // If the date is further away, return the full date (e.g., 18/08/2024)
    return date.format("DD/MM/YYYY");
  }
}
