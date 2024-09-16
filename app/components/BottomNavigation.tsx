import { Flex } from "@mantine/core";
import { IconBinaryTree2, IconInbox, IconUsers } from "@tabler/icons-react";
import { useMobile } from "~/hooks/useMobile";
import { BottomNavigationLink } from "./BottomNavigationLink";

export function BottomNavigation() {
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <Flex
      align="center"
      justify="space-around"
      h="80px"
      style={{
        backgroundColor: "white",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 100,
      }}
    >
      <BottomNavigationLink to="/conversation" label="Chat" icon={IconInbox} />
      <BottomNavigationLink to="/team" label="Team" icon={IconUsers} />
      <BottomNavigationLink to="/bot" label="Bots" icon={IconBinaryTree2} />
      <BottomNavigationLink to="/tools" label="Blah" icon={IconUsers} />
    </Flex>
  );
}
