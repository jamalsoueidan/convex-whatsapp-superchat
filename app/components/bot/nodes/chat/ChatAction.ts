import { Edge, Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { CustomNodeTypes } from "../../CustomNodeTypes";
import { Chat } from "./ChatType";

export const chatDefault: Chat = {
  config: {
    require_response: true,
    system: "You are a helpful assistant.",
    assistant: "You are a helpful assistant.",
    model: "gpt-4o-mini",
  },
};

export const createChatNode = (replace: Node) => {
  const { id, position } = replace;

  const nodes: CustomNodeTypes[] = [];
  const edges: Edge[] = [];

  const newComponent: Chat = JSON.parse(JSON.stringify(chatDefault));

  const selectNode: CustomNodeTypes = {
    id: uuidv4(),
    position: { x: 0, y: 0 },
    type: "plus",
    data: { name: "" },
  };
  nodes.push(selectNode);
  edges.push({
    id: `${id}-${selectNode.id}`,
    source: id,
    target: selectNode.id,
    type: "delete-edge",
    animated: true,
  });

  nodes.push({
    id,
    data: newComponent,
    position,
    type: "chat",
  });

  return { nodes, edges };
};
