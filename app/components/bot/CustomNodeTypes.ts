import { ChatNode } from "./nodes/chat/ChatNode";
import { InteractiveButtonsNode } from "./nodes/interactive-buttons/InteractiveButtonsNode";
import { InteractiveFlowNode } from "./nodes/interactive-flow/InteractiveFlowNode";
import { InteractiveListNode } from "./nodes/interactive-list/InteractiveListNode";
import { LocationNode } from "./nodes/location/LocationNode";
import { MessageNode } from "./nodes/message/MessageNode";
import { PlusNode } from "./nodes/plus/PlusNode";
import { StartNode } from "./nodes/start/StartNode";

export type CustomNodeTypes =
  | ChatNode
  | InteractiveButtonsNode
  | InteractiveListNode
  | InteractiveFlowNode
  | LocationNode
  | MessageNode
  | StartNode
  | PlusNode;
