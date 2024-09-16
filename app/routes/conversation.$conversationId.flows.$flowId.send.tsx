import {
  Badge,
  Button,
  Flex,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { GetFlow } from "convex/flow";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { useSendMessage } from "~/hooks/useSendMessage";

export default function FlowSend() {
  const navigate = useNavigate();
  const params = useParams();
  const get = useAction(api.flow.get);

  const [data, setData] = useState<GetFlow | null>(null);
  const send = useSendMessage();

  useEffect(() => {
    get({ flowId: params.flowId || "" }).then((value) => setData(value));
  }, [get, params]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      header: "Table Booking",
      body: "Hi! Thanks for choosing to book a table with us. Please select the date, time, and number of people so we can assist you with the reservation.",
      footer: "By Zigzag",
      flow_cta: "Book table",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        send({
          conversation: params.conversationId as Id<"conversation">,
          timestamp: Math.floor(Date.now() / 1000),
          type: "interactive",
          interactive: {
            type: "flow",
            header: {
              type: "text",
              text: values.header,
            },
            body: {
              text: values.body,
            },
            footer: {
              text: values.footer,
            },
            action: {
              name: "flow",
              parameters: {
                flow_message_version: "3",
                flow_token: "unused",
                flow_id: data?.id,
                mode: data?.status.toLocaleLowerCase(),
                flow_cta: values.flow_cta,
                flow_action: "navigate",
                flow_action_payload: {
                  screen: "INITIAL",
                },
              },
            },
          },
        });
        navigate(`/conversation/${params.conversationId}`);
      })}
    >
      <Stack gap="xs">
        <div>
          <Title order={3}>{data?.name}</Title>
          <Badge color={data?.status === "DRAFT" ? "yellow" : "green"}>
            {data?.status}
          </Badge>
        </div>

        {data?.status !== "PUBLISHED" ? <Text></Text> : null}
        <TextInput
          label="Header"
          {...form.getInputProps("header")}
          disabled={data?.status !== "PUBLISHED"}
        />
        <Textarea
          label="Body"
          {...form.getInputProps("body")}
          disabled={data?.status !== "PUBLISHED"}
        />
        <TextInput
          label="Footer"
          {...form.getInputProps("footer")}
          disabled={data?.status !== "PUBLISHED"}
        />
        <TextInput
          label="Button"
          {...form.getInputProps("flow_cta")}
          disabled={data?.status !== "PUBLISHED"}
        />
        <Flex justify="flex-end" gap="sm">
          <Button type="button" variant="subtle" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit">
            Send {data?.status !== "PUBLISHED" ? "Test" : ""}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
