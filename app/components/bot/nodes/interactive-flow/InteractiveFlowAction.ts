import { Edge, Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { CustomNodeTypes } from "../../CustomNodeTypes";
import { InteractiveFlow } from "./InteractiveFlowType";

export const InteractiveFlowDefault: InteractiveFlow = {
  whatsapp: {
    type: "interactive",
    interactive: {
      type: "flow",
      header: {
        type: "text",
        text: "Header",
      },
      body: {
        text: "Body",
      },
      footer: {
        text: "Footer",
      },
      action: {
        name: "flow",
        parameters: {
          flow_message_version: "3",
          flow_token: "unused",
          flow_id: undefined, //must choose
          mode: "draft",
          flow_cta: "click me button",
          flow_action: "navigate",
          flow_action_payload: {
            screen: "INITIAL",
          },
        },
      },
    },
  },
};

export const createInteractiveFlowNode = (replace: Node) => {
  const { id } = replace;

  const nodes: CustomNodeTypes[] = [];
  const edges: Edge[] = [];

  const newComponent: InteractiveFlow = JSON.parse(
    JSON.stringify(InteractiveFlowDefault)
  );

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
    ...replace,
    data: newComponent,
    type: "interactive-flow",
  });

  return { nodes, edges };
};
