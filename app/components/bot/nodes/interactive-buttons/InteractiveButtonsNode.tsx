import { Box, Button, rem, Stack, Text } from "@mantine/core";
import { Node, NodeProps, Position } from "@xyflow/react";

import { CustomHandle } from "../../handlers/CustomHandler";
import { NodeWrapper } from "../../NodeWrapper";
import { InteractiveButtons } from "./InteractiveButtonsType";

export type InteractiveButtonsNode = Node<
  InteractiveButtons,
  "interactive-buttons"
>;

export const InteractiveButtonsNode = (
  props: NodeProps<InteractiveButtonsNode>
) => {
  const {
    data: {
      trigger,
      whatsapp: { interactive },
    },
  } = props;

  return (
    <NodeWrapper {...props}>
      <Box p="sm" pos="relative">
        <Text fw="bold">{interactive.header.text}</Text>
        <Text>{interactive.body.text}</Text>
        <Text c="dimmed" fz="sm">
          {interactive.footer.text}
        </Text>
      </Box>
      <Stack gap={rem(4)} my="sm">
        {interactive.action.buttons.map((button) => {
          return (
            <Box pos="relative" key={button.reply.id} px="sm">
              <Button
                variant={
                  trigger?.done?.button_reply?.id === button.reply.id
                    ? "filled"
                    : "outline"
                }
                color={
                  trigger?.done?.button_reply?.id === button.reply.id
                    ? "green.6"
                    : "gray.6"
                }
                key={button.reply.id}
                w="100%"
              >
                {button.reply.title}
              </Button>
              <CustomHandle
                type="source"
                position={props.sourcePosition || Position.Right}
                id={button.reply.id}
              />
            </Box>
          );
        })}
      </Stack>
    </NodeWrapper>
  );
};
