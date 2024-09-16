import { ActionIcon, Tooltip } from "@mantine/core";
import { NavLink } from "@remix-run/react";
import { Icon } from "@tabler/icons-react";

export function LeftNavigationLink({
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
    <Tooltip label={label} position="bottom">
      <NavLink to={to} prefetch="intent">
        {({ isActive }) => (
          <ActionIcon
            bg={isActive ? "white" : "transparent"}
            variant="transparent"
            color={isActive ? "black" : "#555"}
            aria-label={label}
            radius="xl"
            size="lg"
          >
            <Component
              style={{ width: "70%", height: "70%" }}
              stroke={isActive ? "1.5" : "1"}
            />
          </ActionIcon>
        )}
      </NavLink>
    </Tooltip>
  );
}
