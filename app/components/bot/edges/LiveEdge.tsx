import { ActionIcon } from "@mantine/core";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useMemo } from "react";
import { InteractiveTrigger } from "../NodeWrapper";

export function LiveEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  target,
  source,
  markerEnd,
}: EdgeProps) {
  const { getNode } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const sourceNode = getNode(source);
  const sourceData = sourceNode?.data as InteractiveTrigger;

  const targetNode = getNode(target);
  const targetData = targetNode?.data as InteractiveTrigger;

  const hasMultiplyHandlers = !!sourceData.trigger?.sourceHandle;

  const color = useMemo(() => {
    if (hasMultiplyHandlers) {
      if (sourceHandleId === sourceData.trigger?.sourceHandle) {
        return "var(--mantine-color-green-7)";
      } else {
        return "gray";
      }
    } else {
      if (targetData.trigger?.status === "done") {
        return "var(--mantine-color-green-4)";
      }

      if (sourceData.trigger?.status == "done") {
        return "var(--mantine-color-yellow-4)";
      }
    }

    return "gray";
  }, [hasMultiplyHandlers, sourceData, sourceHandleId, targetData]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{ strokeWidth: 3, stroke: color }}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        {targetData.trigger && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan"
          >
            <ActionIcon variant="filled" color={color} size="sm" radius="xl">
              {color === "var(--mantine-color-green-7)" ? (
                <IconCheck />
              ) : (
                <IconLoader2 />
              )}
            </ActionIcon>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
