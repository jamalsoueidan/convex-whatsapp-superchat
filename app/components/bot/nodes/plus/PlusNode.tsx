import { Button } from "@mantine/core";
import { Link, useParams } from "@remix-run/react";
import { IconPlus } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { Plus } from "./PlusType";

export type PlusNode = Node<Plus, "plus">;

export const PlusNode = ({ id, targetPosition }: NodeProps<PlusNode>) => {
  const params = useParams();

  return (
    <>
      <Button
        variant="default"
        size="lg"
        radius="md"
        pos="relative"
        component={Link}
        to={`/bot/${params.botId}/edit/replace/${id}`}
      >
        <IconPlus />
      </Button>
      <Handle
        position={targetPosition || Position.Left}
        id={id}
        type="target"
      />
    </>
  );
};
