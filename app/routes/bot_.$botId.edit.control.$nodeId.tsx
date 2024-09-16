/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Card,
  Divider,
  Drawer,
  Flex,
  noop,
  ScrollArea,
  Title,
} from "@mantine/core";
import { NodeTypes, useReactFlow } from "@xyflow/react";

import { Link, useParams } from "@remix-run/react";
import { IconX } from "@tabler/icons-react";
import { useCallback } from "react";
import { InteractiveButtonsControls } from "~/components/bot/nodes/interactive-buttons/InteractiveButtonsControls";
import { InteractiveFlowControls } from "~/components/bot/nodes/interactive-flow/InteractiveFlowControls";
import { InteractiveListControls } from "~/components/bot/nodes/interactive-list/InteractiveListControls";
import { LocationControls } from "~/components/bot/nodes/location/LocationControls";
import { MessageControls } from "~/components/bot/nodes/message/MessageControls";
import { StartControls } from "~/components/bot/nodes/start/StartControls";
import { useMobile } from "~/hooks/useMobile";

const controlTypes: Record<string, any> = {
  "interactive-list": InteractiveListControls,
  "interactive-buttons": InteractiveButtonsControls,
  "interactive-flow": InteractiveFlowControls,
  location: LocationControls,
  message: MessageControls,
  start: StartControls,
};

export default function NodeDrawer() {
  const isMobile = useMobile();
  const params = useParams();
  const { getNode, updateNodeData } = useReactFlow();

  const node = getNode(params.nodeId || "");

  const onValuesChange = useCallback(
    (values: Partial<NodeTypes["data"]>) => {
      const nodeId = params.nodeId;
      if (nodeId) {
        updateNodeData(nodeId, values);
      }
    },
    [params.nodeId, updateNodeData]
  );

  if (!node) {
    return null;
  }

  const Component = controlTypes[node.type || ""];

  return (
    <Drawer.Root
      position="right"
      size={isMobile ? "100%" : "350px"}
      opened={true}
      onClose={noop}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Drawer.Content>
        <Drawer.Body p="0">
          <Flex
            h="60px"
            w="100%"
            align="center"
            justify="space-between"
            px="sm"
          >
            <Title order={3}>{node.type}</Title>
            <ActionIcon
              component={Link}
              to={`/bot/${params.botId}/edit`}
              variant="transparent"
              color="black"
            >
              <IconX />
            </ActionIcon>
          </Flex>

          <Divider />

          <Card>
            {Component ? (
              <Component
                node={node}
                onValuesChange={onValuesChange}
                key={node.id}
              />
            ) : (
              <Title order={5}>No controls for this node</Title>
            )}
          </Card>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
