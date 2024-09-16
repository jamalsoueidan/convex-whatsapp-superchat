import {
  ActionIcon,
  Divider,
  Flex,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";

import {
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Link,
  Outlet,
  useLocation,
  useOutlet,
  useParams,
} from "@remix-run/react";
import { IconFiles, IconX } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { liveEdgeTypes } from "~/components/bot/CustomEdgeTypes";
import { nodeTypes } from "~/components/bot/Flow";
import { NodeAutoLayout } from "~/components/bot/NodeAutoLayout";
import { useMobile } from "~/hooks/useMobile";

export default function Live() {
  const inOutlet = !!useOutlet();
  const isMobile = useMobile();
  const params = useParams();
  const location = useLocation();
  const customerBot = useQuery(api.customer_bot.get, {
    customerBot: params?.customerBotId as Id<"customerBot">,
  });

  return (
    <>
      <Flex
        direction="column"
        w={!isMobile && inOutlet ? "calc(100% - 350px)" : "100%"}
        h="100%"
      >
        <Flex
          p="sm"
          align="center"
          justify="space-between"
          gap="xs"
          bg="green.5"
        >
          <Title order={5}>Live</Title>
          <ActionIcon
            variant="transparent"
            color="black"
            component={Link}
            to={`/bot/${params?.botId}/edit`}
          >
            <IconX />
          </ActionIcon>
        </Flex>
        <Divider />
        {customerBot ? (
          <ReactFlow
            nodes={
              customerBot.nodes
                .filter((node) => node.type !== "plus")
                .map((node) => ({
                  ...node,
                  selected: false, //remove blue line around selected node
                })) as never
            }
            edges={customerBot.edges.map((edge) => ({
              ...edge,
              animated: false,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
              },
            }))}
            elementsSelectable={false}
            nodeTypes={nodeTypes}
            edgeTypes={liveEdgeTypes}
            fitView
          >
            <Panel position="top-right">
              <Stack gap="xs">
                <Tooltip label="Logs" position="left">
                  <ActionIcon
                    size="lg"
                    component={Link}
                    to={location.pathname.includes("logs") ? "../edit" : "logs"}
                  >
                    <IconFiles />
                  </ActionIcon>
                </Tooltip>
                <NodeAutoLayout />
              </Stack>
            </Panel>
            <Controls />
            <Background />
          </ReactFlow>
        ) : null}
      </Flex>
      <Outlet />
    </>
  );
}
