import { ActionIcon, Badge, Card, Flex, Group, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { IconArrowRight, IconEye } from "@tabler/icons-react";
import { Flow } from "convex/flow";

export const FlowItem = ({ flow }: { flow: Flow }) => {
  return (
    <Card
      withBorder
      component={Link}
      to={`${flow.id}/send`}
      style={{ cursor: "pointer" }}
    >
      <Group justify="space-between">
        <Flex direction="column">
          <Text>{flow.name.substring(0, 25)}</Text>
          <Badge color={flow.status === "DRAFT" ? "yellow" : "green"}>
            {flow.status}
          </Badge>
        </Flex>
        <Flex gap="xs">
          <ActionIcon
            component={Link}
            to={`${flow.id}/preview`}
            variant="transparent"
            color="black"
          >
            <IconEye />
          </ActionIcon>
          <ActionIcon variant="transparent" color="black">
            <IconArrowRight />
          </ActionIcon>
        </Flex>
      </Group>
    </Card>
  );
};
