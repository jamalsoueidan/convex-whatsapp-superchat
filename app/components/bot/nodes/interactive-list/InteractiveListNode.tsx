import { Box, Button, Divider, rem, Stack, Text } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { Node, NodeProps, Position } from "@xyflow/react";

import { CustomHandle } from "../../handlers/CustomHandler";
import { NodeWrapper } from "../../NodeWrapper";
import { InteractiveList } from "./InteractiveListType";

export type InteractiveListNode = Node<InteractiveList, "interactive-list">;

export const InteractiveListNode = (props: NodeProps<InteractiveListNode>) => {
  const {
    data: {
      trigger,
      whatsapp: { interactive },
    },
    sourcePosition,
  } = props;

  return (
    <NodeWrapper {...props}>
      <Stack gap={rem(2)} pos="relative" p="xs">
        <Text fw="bold">{interactive.header.text}</Text>
        <Text>{interactive.body.text}</Text>
        <Text c="dimmed" fz="sm">
          {interactive.footer.text}
        </Text>
        <Button variant="outline" leftSection={<IconMenu2 />} disabled>
          {interactive.action.button}
        </Button>
      </Stack>

      {interactive.action.sections.map((section) => {
        return (
          <Stack key={section.title} gap={rem(2)} mb="xs">
            <Text c="dimmed" fz="sm" fw="bold" px="xs">
              {section.title}
            </Text>
            <Divider />
            <Stack pt="xs" gap={rem(3)}>
              {section.rows.map((row) => {
                return (
                  <Box pos="relative" key={row.id} px="xs">
                    <Button
                      size="compact-sm"
                      variant={
                        trigger?.done?.list_reply?.id === row.id
                          ? "filled"
                          : "outline"
                      }
                      color={
                        trigger?.done?.list_reply?.id === row.id
                          ? "green.6"
                          : "gray.4"
                      }
                      disabled={trigger?.done?.list_reply?.id !== row.id}
                      fullWidth
                    >
                      {row.title}
                    </Button>
                    <CustomHandle
                      type="source"
                      position={sourcePosition || Position.Right}
                      id={row.id}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        );
      })}
    </NodeWrapper>
  );
};
