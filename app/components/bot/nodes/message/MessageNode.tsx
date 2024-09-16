import { Card, Divider, Image, rem, Stack, Text } from "@mantine/core";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";

import { NodeWrapper } from "../../NodeWrapper";
import { Message } from "./MessageType";

export type MessageNode = Node<Message, "message">;

export const MessageNode = (props: NodeProps<MessageNode>) => {
  const connections = useHandleConnections({ type: "source", id: props.id });
  const {
    data: { trigger, whatsapp, config },
    id,
  } = props;

  return (
    <NodeWrapper {...props}>
      <Stack gap={rem(2)} px="xs" py={rem(2)} pos="relative">
        <Text
          c="dimmed"
          fz="sm"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{
            __html: whatsapp.text.body.replace(/\n\n/g, "<br />"),
          }}
        />
        <Handle
          type="source"
          position={props.sourcePosition || Position.Right}
          id={id}
          isConnectable={connections.length === 0}
        />
      </Stack>
      <Divider />
      <Text fz={rem(10)} ta="right" px="xs">
        {config.require_response ? "*Require response" : "Send Message"}
      </Text>
      {trigger?.done?.media ? (
        <>
          <Card p={rem(4)} radius="lg" mt="lg">
            <Text fw="500">Replied with image</Text>
            <Image
              src={`https://data.mongodb-api.com/app/facebook-ckxlfbp/endpoint/media?id=${trigger.done.media?.file_name}`}
              mah={200}
              maw={300}
              loading="lazy"
            />
          </Card>
        </>
      ) : null}
      {trigger?.done?.text ? (
        <>
          <Card p={rem(4)} radius="lg" mt="lg">
            <Text fw="500">Replied with text</Text>
            {trigger.done.text.body}
          </Card>
        </>
      ) : null}
    </NodeWrapper>
  );
};
