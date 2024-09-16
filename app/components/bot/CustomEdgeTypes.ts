import { DeleteEdge } from "./edges/DeleteEdge";
import { LiveEdge } from "./edges/LiveEdge";

export const flowEdgeTypes = {
  "delete-edge": DeleteEdge,
};

export const liveEdgeTypes = {
  "delete-edge": LiveEdge,
};
