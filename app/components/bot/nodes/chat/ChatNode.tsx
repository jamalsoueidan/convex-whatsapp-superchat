import { rem, Stack, Text } from "@mantine/core";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

import { IconAi } from "@tabler/icons-react";
import { NodeWrapper } from "../../NodeWrapper";
import { Chat } from "./ChatType";

export type ChatNode = Node<Chat, "chat">;

export const ChatNode = (props: NodeProps<ChatNode>) => {
  const {
    data: { config },
    id,
  } = props;

  return (
    <NodeWrapper {...props}>
      <Stack gap={rem(2)} px="xs" py={rem(2)} pos="relative" align="center">
        <IconAi stroke=".7" size="100px" />
        <Text c="dimmed" fz="sm">
          System {config.assistant}
        </Text>
        <Text c="dimmed" fz="sm">
          Assistant {config.assistant}
        </Text>
        <Text c="dimmed" fz="sm">
          Model {config.model}
        </Text>
        <Handle
          type="source"
          position={props.sourcePosition || Position.Right}
          id={id}
        />
      </Stack>
    </NodeWrapper>
  );
};
