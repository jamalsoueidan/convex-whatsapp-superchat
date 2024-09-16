import { Button, Stack } from "@mantine/core";
import { Edge, Node, useReactFlow } from "@xyflow/react";

import { useNavigate, useParams } from "@remix-run/react";
import { CustomModal } from "~/components/CustomModal";
import { createChatNode } from "~/components/bot/nodes/chat/ChatAction";
import { createInteractiveButtonNode } from "~/components/bot/nodes/interactive-buttons/InteractiveButtonsAction";
import { createInteractiveFlowNode } from "~/components/bot/nodes/interactive-flow/InteractiveFlowAction";
import { createInteractiveListNode } from "~/components/bot/nodes/interactive-list/InteractiveListActions";
import { createLocationNode } from "~/components/bot/nodes/location/LocationAction";
import { createMessageNode } from "~/components/bot/nodes/message/MessageAction";

export default function ModalNodePicker() {
  const navigate = useNavigate();
  const params = useParams();

  const { setNodes, setEdges, getNode } = useReactFlow();

  const currentNode = getNode(params.nodeId || "");

  if (!currentNode) return null;

  const addOnclick = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setNodes((prev: Array<Node>) => {
      return [...prev.filter((node) => node.id !== currentNode.id), ...nodes];
    });

    setEdges((prev: Array<Edge>) => {
      return [...prev, ...edges];
    });

    navigate(`/bot/${params.botId}/edit`);
  };

  return (
    <CustomModal
      opened={true}
      onClose={() => navigate(`/bot/${params.botId}/edit`)}
      title="Add trigger"
    >
      <Stack>
        <Button onClick={() => addOnclick(createChatNode(currentNode))}>
          ChatGPT
        </Button>
        <Button
          onClick={() => addOnclick(createInteractiveListNode(currentNode))}
        >
          Interactive List
        </Button>

        <Button
          onClick={() => addOnclick(createInteractiveFlowNode(currentNode))}
        >
          Interactive Flow
        </Button>

        <Button
          onClick={() => addOnclick(createInteractiveButtonNode(currentNode))}
        >
          Interactive Buttons
        </Button>
        <Button onClick={() => addOnclick(createMessageNode(currentNode))}>
          Message
        </Button>
        <Button onClick={() => addOnclick(createLocationNode(currentNode))}>
          Location
        </Button>
      </Stack>
    </CustomModal>
  );
}
