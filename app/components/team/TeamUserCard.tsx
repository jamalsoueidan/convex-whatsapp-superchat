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
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const TeamUserCard = ({
  user,
  selected,
}: {
  user: Doc<"users">;
  selected: boolean;
}) => {
  const updatedAt = dayjs(user?._creationTime || 0);

  return (
    <>
      <Card
        p="xs"
        component={Link}
        to={`/team/${user._id}`}
        prefetch="intent"
        bg={selected ? "gray.1" : undefined}
        radius="0"
      >
        <Group>
          <Avatar size="lg" />
          <Flex flex={1}>
            <Stack gap="0" flex={1}>
              <Text>{user.name}</Text>

              <Text lineClamp={1}>last login {updatedAt.fromNow()}</Text>
            </Stack>
            <Stack align="flex-end" justify="center" gap="2px">
              {user.accessLevel > 3 ? (
                <Badge color="green" size="md" radius="200px" p="7px">
                  Admin
                </Badge>
              ) : null}
              {user.accessLevel === 2 ? (
                <Badge color="green" size="md" radius="200px" p="7px">
                  TeamAdmin
                </Badge>
              ) : null}
            </Stack>
          </Flex>
        </Group>
      </Card>
      <Divider p="0" m="0" mr="xs" />
    </>
  );
};
