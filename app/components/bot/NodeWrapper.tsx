import {
  ActionIcon,
  Box,
  BoxProps,
  Divider,
  Flex,
  Group,
  rem,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "@remix-run/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  Handle,
  NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";

export type InteractiveTrigger = {
  trigger?: {
    status: "done" | "waiting";
    created_at: number;
    updated_at?: number;
    sourceHandle?: string; //incase node have multi selection, and the trigger is done, figure out which sourcehandle was selected
  };
};

export function NodeWrapper({
  children,
  bg,
  withTarget = true,
  ...props
}: NodeProps &
  Pick<BoxProps, "bg"> & { children: React.ReactNode; withTarget?: boolean }) {
  const navigate = useNavigate();
  const { deleteElements } = useReactFlow();
  const params = useParams();

  const data = props.data as InteractiveTrigger;

  const deleteNode = useCallback(() => {
    deleteElements({ nodes: [props] });
  }, [deleteElements, props]);

  return (
    <>
      <Box
        bg={bg || "white"}
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          ...(props.selected
            ? { outline: "2px solid var(--mantine-color-blue-6)" }
            : {}),
          ...(data?.trigger?.status === "done"
            ? { border: "3px solid var(--mantine-color-green-7)" }
            : {}),
          ...(data?.trigger?.status === "waiting"
            ? { border: "3px solid var(--mantine-color-yellow-4)" }
            : {}),
        }}
        miw="200px"
        maw="300px"
      >
        <Group
          gap="xs"
          p="xs"
          justify="space-between"
          align="center"
          pos="relative"
        >
          <Title order={4}>{capitalizeFirstLetter(props.type!)}</Title>
          <NodeToolbar position={Position.Bottom}>
            <Flex gap={rem(5)}>
              <ActionIcon size="md" onClick={deleteNode} color="red">
                <IconTrash
                  style={{ width: "80%", height: "80%" }}
                  stroke="1.5"
                />
              </ActionIcon>
              <ActionIcon
                onClick={() =>
                  navigate(`/bot/${params.botId}/edit/control/${props.id}`)
                }
              >
                <IconEdit
                  style={{ width: "80%", height: "80%" }}
                  stroke="1.5"
                />
              </ActionIcon>
            </Flex>
          </NodeToolbar>
          {withTarget ? (
            <Handle
              type="target"
              position={props.targetPosition || Position.Top}
              id={props.id}
            />
          ) : null}
        </Group>
        <Divider />
        {children}
      </Box>
    </>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
