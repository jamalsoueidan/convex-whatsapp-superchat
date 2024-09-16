import { Edge, Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { CustomNodeTypes } from "../../CustomNodeTypes";
import { InteractiveButtons } from "./InteractiveButtonsType";

export const InteractiveButtonsDefault: InteractiveButtons = {
  whatsapp: {
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: "Title",
      },
      body: {
        text: "Body",
      },
      footer: {
        text: "Footer",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: uuidv4(),
              title: "Button",
            },
          },
        ],
      },
    },
  },
};

export const createInteractiveButtonNode = (replace: Node) => {
  const { id } = replace;

  const nodes: CustomNodeTypes[] = [];
  const edges: Edge[] = [];

  const newComponent: InteractiveButtons = JSON.parse(
    JSON.stringify(InteractiveButtonsDefault)
  );

  newComponent.whatsapp.interactive.action.buttons =
    newComponent.whatsapp.interactive.action.buttons.map((button) => {
      button.reply.id = uuidv4();
      const selectNode: CustomNodeTypes = {
        id: button.reply.id,
        position: { x: 0, y: 0 },
        type: "plus",
        data: { name: "" },
      };

      nodes.push(selectNode);
      edges.push({
        id: `${id}-${selectNode.id}`,
        source: id,
        sourceHandle: selectNode.id,
        target: selectNode.id,
        type: "delete-edge",
        animated: true,
      });

      return button;
    });

  nodes.push({
    ...replace,
    id,
    data: newComponent,
    type: "interactive-buttons",
  });

  return { nodes, edges };
};
