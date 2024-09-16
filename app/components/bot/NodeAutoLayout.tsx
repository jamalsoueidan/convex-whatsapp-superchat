import { ActionIcon, Tooltip } from "@mantine/core";
import { IconAlignCenter } from "@tabler/icons-react";
import {
  Edge,
  Node,
  Position,
  useNodesInitialized,
  useReactFlow,
} from "@xyflow/react";
import dagre from "dagre";
import { useEffect, useState } from "react";

// https://ncoughlin.com/posts/react-flow-dagre-custom-nodes
type RankDir = "TB" | "BT" | "LR" | "RL";
const options: { rankdir: RankDir } = { rankdir: "LR" };

const getHandleYPosition = (
  handleId?: string | null,
  nodeId?: string
): number => {
  const handleElement = document.querySelector(
    `[data-handleid="${handleId || ""}"][data-nodeid="${nodeId}"]`
  );

  if (handleElement) {
    const rect = handleElement.getBoundingClientRect();
    return rect.y;
  }

  return Number.POSITIVE_INFINITY; // Return a large number if the handle is not found to push it at the end.
};

const getLayoutedElements = (nodes: Node[], edges: Array<Edge>) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph(options);

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      ...node,
      width: node.measured!.width! + 50,
      height: node.measured!.height! + 50,
    });
  });

  // FIX problem of overlapping nodes
  edges.sort((edgeA, edgeB) => {
    const handleYA = getHandleYPosition(edgeA.sourceHandle, edgeA.source);
    const handleYB = getHandleYPosition(edgeB.sourceHandle, edgeB.source);
    return handleYA - handleYB;
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positions = {
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  };

  const newNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: x - node.measured!.width! / 2,
        y: y - node.measured!.height! / 2,
      },
      targetPosition: positions.targetPosition,
      sourcePosition: positions.sourcePosition,
    };
  });

  return { nodes: newNodes, edges };
};

export const NodeAutoLayout = () => {
  const [layout, setLayout] = useState(false);
  const nodesInitialized = useNodesInitialized({
    includeHiddenNodes: false,
  });
  //Todo: when clicking node, zoom on it, and show it instead of the whole flow.

  const { getNodes, setNodes, getEdges, setEdges, fitView } = useReactFlow();

  useEffect(() => {
    if (nodesInitialized) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(getNodes(), getEdges());

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      window.requestAnimationFrame(() => {
        fitView({ maxZoom: 1.5 });
      });
    }
  }, [nodesInitialized, fitView, getEdges, getNodes, setEdges, setNodes]);

  useEffect(() => {
    if (layout) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(getNodes(), getEdges());

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLayout(false);

      window.requestAnimationFrame(() => {
        fitView({ maxZoom: 1.5 });
      });
    }
  }, [
    nodesInitialized,
    fitView,
    getEdges,
    getNodes,
    setEdges,
    setNodes,
    layout,
  ]);

  return (
    <Tooltip label="Layout" position="left">
      <ActionIcon size="lg" onClick={() => setLayout(true)}>
        <IconAlignCenter />
      </ActionIcon>
    </Tooltip>
  );
};
