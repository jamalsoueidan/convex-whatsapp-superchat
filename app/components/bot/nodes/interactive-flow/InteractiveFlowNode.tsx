import { Box, Button, rem, Stack, Text, Title } from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";

import { NodeWrapper } from "../../NodeWrapper";
import { InteractiveFlow } from "./InteractiveFlowType";

export type InteractiveFlowNode = Node<InteractiveFlow, "interactive-flow">;

export const InteractiveFlowNode = (props: NodeProps<InteractiveFlowNode>) => {
  const connections = useHandleConnections({ type: "source", id: props.id });

  const {
    data: {
      trigger,
      whatsapp: { interactive },
    },
  } = props;

  const done = trigger?.done;
  const flow_name = trigger?.done?.flow_name;
  const object = done && flow_name ? done[flow_name] : {};

  return (
    <NodeWrapper {...props}>
      <Stack gap={rem(2)} pos="relative" p="sm">
        <Title order={4}>{interactive.header.text}</Title>
        <Text fz="md">{interactive.body.text}</Text>
        <Text c="dimmed" fz="sm">
          {interactive.footer.text}
        </Text>
        <Handle
          type="source"
          position={props.sourcePosition || Position.Right}
          id={props.id}
          isConnectable={connections.length === 0}
        />
        <Box mt="sm">
          {!done ? (
            interactive.action.parameters.flow_id ? (
              <Button variant="outline" color="gray.6" w="100%">
                {interactive.action.parameters.flow_cta}
              </Button>
            ) : (
              <Text c="red" fw="500" fz="sm">
                Please choose a flow
              </Text>
            )
          ) : (
            Object.keys(object)
              .filter((p) => p !== "flow_token")
              .map((key) => (
                <Text key={key} c="gray" fz="sm">
                  <strong>{object[key].question}</strong> {object[key].value}
                </Text>
              ))
          )}
        </Box>
      </Stack>
    </NodeWrapper>
  );
};
