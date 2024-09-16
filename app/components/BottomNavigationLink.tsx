import { ActionIcon, Flex, Text, UnstyledButton } from "@mantine/core";
import { NavLink } from "@remix-run/react";
import { Icon } from "@tabler/icons-react";

export function BottomNavigationLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: Icon;
}) {
  const Component = icon;

  return (
    <UnstyledButton component={NavLink} to={to} prefetch="intent">
      {({ isActive }) => (
        <Flex direction="column" align="center" justify="center" gap="5px">
          <ActionIcon
            bg={isActive ? "gray.3" : "transparent"}
            c="black"
            radius="xl"
            w="60px"
          >
            <Component size={24} stroke={isActive ? "2.2" : "1.5"} />
          </ActionIcon>
          <Text fw={isActive ? "500" : undefined}>{label}</Text>
        </Flex>
      )}
    </UnstyledButton>
  );
}
