import { Edge, Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { CustomNodeTypes } from "../../CustomNodeTypes";
import { Location } from "./LocationType";

export const LocationDefault: Location = {
  whatsapp: {
    type: "location",
    location: {
      name: "Philz Coffee",
      address: "101 Forest Ave, Palo Alto, CA 94301",
      latitude: "37.44216251868683",
      longitude: "-122.16153582049394",
    },
  },
};

export const createLocationNode = (replace: Node) => {
  const { id, position } = replace;

  const nodes: CustomNodeTypes[] = [];
  const edges: Edge[] = [];

  const newComponent: Location = JSON.parse(JSON.stringify(LocationDefault));

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
    type: "location",
  });

  return { nodes, edges };
};
