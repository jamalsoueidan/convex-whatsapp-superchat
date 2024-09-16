import { Box } from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { Start } from "./StartType";

export type StartNode = Node<Start, "start">;

export const StartNode = (props: NodeProps<StartNode>) => {
  const connections = useHandleConnections({ type: "source", id: props.id });

  return (
    <NodeWrapper withTarget={false} {...props}>
      <Box p="xs" pos="relative">
        {props.data.type}
        <Handle
          position={props.sourcePosition || Position.Right}
          id={props.id}
          type="source"
          isConnectable={connections.length === 0}
        />
      </Box>
    </NodeWrapper>
  );
};
