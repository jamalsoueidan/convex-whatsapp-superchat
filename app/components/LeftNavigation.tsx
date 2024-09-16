import "@mantine/core/styles.css";

import { useAuthActions } from "@convex-dev/auth/react";
import { ActionIcon, Avatar, Flex, Stack, Tooltip } from "@mantine/core";
import {
  IconBinaryTree2,
  IconHome,
  IconInbox,
  IconUsers,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

import { LeftNavigationLink } from "./LeftNavigationLink";

export const LeftNavigation = () => {
  const user = useQuery(api.auth.currentUser);
  const { signOut } = useAuthActions();

  return (
    <Flex
      align="flex-start"
      bg="gray.1"
      direction="column"
      justify="space-between"
    >
      <Stack justify="center" align="center" p="md">
        <LeftNavigationLink label="Home" icon={IconHome} to="/" />
        <LeftNavigationLink
          label="Conversations"
          icon={IconInbox}
          to="/conversation"
        />
        <LeftNavigationLink label="Team" icon={IconUsers} to="/team" />
        <LeftNavigationLink label="Bots" icon={IconBinaryTree2} to="/bot" />
      </Stack>
      <Stack justify="center" align="center" p="md">
        <Tooltip label="Logout">
          <ActionIcon
            variant="transparent"
            color="#555"
            aria-label="Logout"
            radius="xl"
            size="lg"
            onClick={signOut}
          >
            <Avatar color="cyan" radius="xl">
              {getInitials(user?.name || "")}
            </Avatar>
          </ActionIcon>
        </Tooltip>
      </Stack>
    </Flex>
  );
};

function getInitials(name: string) {
  const words = name.trim().split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}
