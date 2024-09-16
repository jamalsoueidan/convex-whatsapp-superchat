import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Flex,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "@remix-run/react";

import { IconArrowLeft } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { Doc, Id } from "convex/_generated/dataModel";
import { ReactMutation, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const TeamUserForm = ({
  user,
  update,
}: {
  user: Doc<"users">;
  update: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        accessLevel: number;
        user: Id<"users">;
      },
      null,
      string | undefined
    >
  >;
}) => {
  const loggedUser = useQuery(api.auth.currentUser);

  const updatedAt = dayjs(user?.updatingTime || 0);
  const createdAt = dayjs(user?._creationTime);

  const setChecked = (name: string, accessLevel: number) => {
    update({
      user: user._id,
      accessLevel,
    });
  };

  if (!loggedUser) return null;

  return (
    <>
      <Flex flex="1" direction="column">
        <Group gap="xs" mih="60px" p="xs" bg="#f0f2f5">
          <ActionIcon
            variant="transparent"
            aria-label="Back"
            color="black"
            component={Link}
            to="/team"
            hiddenFrom="md"
          >
            <IconArrowLeft stroke={2} />
          </ActionIcon>
          <Avatar size="md" />
          <Flex flex={1} align="center" gap="xs">
            <Text>{user?.name}</Text>

            <Stack align="flex-end" justify="center" gap="2px">
              {user?.accessLevel > 3 ? (
                <Badge color="green" size="md" radius="200px" p="7px">
                  Admin
                </Badge>
              ) : null}
              {user?.accessLevel === 2 ? (
                <Badge color="green" size="md" radius="200px" p="7px">
                  TeamAdmin
                </Badge>
              ) : null}
            </Stack>
          </Flex>
        </Group>

        <Divider />
        <Flex bg="#efeae2" flex={1} p="lg" direction="column" gap="md">
          <Group>
            <Title order={4}>Name:</Title>
            <Text>{user?.name}</Text>
          </Group>
          <Group>
            <Title order={4}>Email:</Title>
            <Text>{obfuscateEmail(user?.email || "test@test.com")}</Text>
          </Group>
          <Group>
            <Title order={4}>Created at:</Title>
            <Text>{createdAt.format("DD/MM/YYYY")}</Text>
          </Group>
          <Group>
            <Title order={4}>Last login:</Title>
            <Text>{updatedAt.fromNow()}</Text>
          </Group>

          <Switch
            label="Should be admin?"
            color="green"
            checked={user?.accessLevel > 3}
            onChange={() =>
              setChecked("accessLevel", user.accessLevel === 3 ? 0 : 3)
            }
            disabled={loggedUser?.accessLevel < 3}
            onLabel="Yes"
            offLabel="No"
            size="lg"
          />

          <Switch
            label="Should be team admin?"
            color="green"
            checked={user?.accessLevel === 2}
            onChange={() =>
              setChecked("accessLevel", user.accessLevel === 2 ? 0 : 2)
            }
            disabled={loggedUser?.accessLevel < 3}
            onLabel="Yes"
            offLabel="No"
            size="lg"
          />
        </Flex>
      </Flex>
    </>
  );
};

function obfuscateEmail(email: string) {
  return email.replace(/(@).+(?=\.)/g, "@...");
}
