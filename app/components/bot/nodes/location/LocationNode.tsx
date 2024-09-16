import { rem, Stack, Text } from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";

import { IconGps } from "@tabler/icons-react";
import { NodeWrapper } from "../../NodeWrapper";
import { Location } from "./LocationType";

export type LocationNode = Node<Location, "location">;

export const LocationNode = (props: NodeProps<LocationNode>) => {
  const connections = useHandleConnections({ type: "source", id: props.id });
  const {
    data: { whatsapp },
    id,
  } = props;

  return (
    <NodeWrapper {...props}>
      <Stack gap={rem(2)} px="xs" py={rem(2)} pos="relative" align="center">
        <IconGps stroke=".7" size="100px" />
        <Text c="dimmed" fz="sm">
          {whatsapp.location.name}
        </Text>
        <Text c="dimmed" fz="sm">
          {whatsapp.location.address}
        </Text>
        <Text c="dimmed" fz="sm">
          Latitude {whatsapp.location.latitude}
        </Text>
        <Text c="dimmed" fz="sm">
          Longitude {whatsapp.location.longitude}
        </Text>
        <Handle
          type="source"
          position={props.sourcePosition || Position.Right}
          id={id}
          isConnectable={connections.length === 0}
        />
      </Stack>
    </NodeWrapper>
  );
};
