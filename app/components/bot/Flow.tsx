import { useDebouncedCallback, usePrevious } from "@mantine/hooks";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
  OnConnectStartParams,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { ReactMutation } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { flowEdgeTypes } from "~/components/bot/CustomEdgeTypes";
import { CustomNodeTypes } from "~/components/bot/CustomNodeTypes";
import { ChatNode } from "~/components/bot/nodes/chat/ChatNode";
import { InteractiveButtonsNode } from "~/components/bot/nodes/interactive-buttons/InteractiveButtonsNode";
import { InteractiveFlowNode } from "~/components/bot/nodes/interactive-flow/InteractiveFlowNode";
import { InteractiveListNode } from "~/components/bot/nodes/interactive-list/InteractiveListNode";
import { LocationNode } from "~/components/bot/nodes/location/LocationNode";
import { MessageNode } from "~/components/bot/nodes/message/MessageNode";
import { PlusNode } from "~/components/bot/nodes/plus/PlusNode";
import { StartNode } from "~/components/bot/nodes/start/StartNode";
import { FlowPanel } from "./FlowPanel";

export const nodeTypes: NodeTypes = {
  "interactive-buttons": InteractiveButtonsNode,
  "interactive-list": InteractiveListNode,
  "interactive-flow": InteractiveFlowNode,
  chat: ChatNode,
  location: LocationNode,
  message: MessageNode,
  plus: PlusNode,
  start: StartNode,
};

export default function Flow({
  defaultNodes,
  defaultEdges,
  update,
}: {
  defaultNodes: Node[];
  defaultEdges: Edge[];
  update: ReactMutation<typeof api.bot.update>;
}) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const connectingNodeId = useRef<OnConnectStartParams | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(defaultEdges);

  const saveNodes = useDebouncedCallback(() => {
    update({
      id: params.botId as Id<"bot">,
      nodes,
    });
  }, 1000);

  const saveEdges = useDebouncedCallback(() => {
    update({
      id: params.botId as Id<"bot">,
      edges,
    });
  }, 1000);

  const { screenToFlowPosition, deleteElements, fitBounds, fitView } =
    useReactFlow();

  const onConnectStart = useCallback(
    (_: unknown, nodeAndHandle: OnConnectStartParams) => {
      connectingNodeId.current = nodeAndHandle;
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane) {
        let position = { x: 0, y: 0 };
        if (event instanceof MouseEvent) {
          position = { x: event.clientX, y: event.clientY };
        } else if (event instanceof TouchEvent) {
          position = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }

        const id = uuidv4();
        const newNode: CustomNodeTypes = {
          id,
          position: screenToFlowPosition(position),
          data: { name: `Node ${id}` },
          type: "plus",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectingNodeId.current?.nodeId || "",
            sourceHandle: connectingNodeId.current?.handleId || "",
            target: id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
            },
            style: {
              strokeWidth: 2,
            },
            type: "delete-edge",
            animated: true,
          })
        );
      }
    },
    [screenToFlowPosition, setEdges, setNodes]
  );

  const onEdgesDelete = (deletedEdges: Edge[]) => {
    deletedEdges.forEach((edge) => {
      const node = nodes.find(
        (node) => node.id === edge.target && node.type === "plus"
      );

      if (node && node.type === "plus") {
        const totalEdges = edges.filter((e) => e.target === node.id).length;
        if (totalEdges === 1) {
          deleteElements({ nodes: [node] });
        }
      }
    });
    navigate(`/bot/${params?.botId}/edit`);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      connectingNodeId.current = null;

      setEdges((edge: Array<Edge>) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
            },
            type: "delete-edge",
            animated: true,
          },
          edge
        )
      );
    },
    [setEdges]
  );

  const previous = usePrevious(params.nodeId);
  useEffect(() => {
    const nodeId = params.nodeId;
    const node = nodes.find((n) => n.id === nodeId);

    if (node) {
      setTimeout(() => {
        if (node.measured?.width && node.measured?.height) {
          const x = node.position.x;
          const y = node.position.y;
          const width = node.measured?.width;
          const height = node.measured?.height;

          fitBounds({
            x,
            y,
            width,
            height,
          });
        }
      }, 50);
    }
    if (previous && !nodeId) {
      setTimeout(() => {
        fitView();
      }, 250);
    }
  }, [params, nodes, previous, fitBounds, fitView, searchParams]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes: NodeChange<Node>[]) => {
        onNodesChange(changes);
        saveNodes();
      }}
      onEdgesChange={(changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);
        saveEdges();
      }}
      onEdgesDelete={onEdgesDelete}
      onConnect={onConnect}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      elementsSelectable={true}
      nodeTypes={nodeTypes}
      edgeTypes={flowEdgeTypes}
      fitView
    >
      <FlowPanel />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
