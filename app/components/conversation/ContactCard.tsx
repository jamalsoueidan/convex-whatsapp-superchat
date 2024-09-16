import { Avatar, Card, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { Doc } from "convex/_generated/dataModel";
import dayjs from "dayjs";

export const ContactCard = ({
  conversation,
}: {
  conversation: Doc<"conversation">;
}) => {
  const timestamp = dayjs((conversation?.timestamp || 0) * 1000);

  return (
    <>
      <Card
        p="xs"
        component={Link}
        to={`/conversation/${conversation._id}`}
        radius="0"
      >
        <Group w="100%">
          <Avatar size="md" />
          <Stack flex={1}>
            <Flex justify="space-between" align="center">
              <Text>{conversation.name}</Text>
              <Text c="green" size="xs" fw="500">
                {timestamp.fromNow()}
              </Text>
            </Flex>
            <Divider />
          </Stack>
        </Group>
      </Card>
    </>
  );
};
