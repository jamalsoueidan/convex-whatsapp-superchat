import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "convex/_generated/api";
import { Flow } from "convex/flow";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { NodeControlWrapperComponent } from "../../NodeControlWrapperType";
import { InteractiveFlowNode } from "./InteractiveFlowNode";

export function InteractiveFlowControls({
  onValuesChange,
  node,
}: NodeControlWrapperComponent<InteractiveFlowNode>) {
  const form = useForm({
    initialValues: node.data,
    onValuesChange,
  });

  const list = useAction(api.flow.list);
  const [data, setData] = useState<Array<Flow> | null>(null);

  useEffect(() => {
    list().then((value) => setData(value.data));
  }, [list]);

  return (
    <Stack>
      <TextInput
        {...form.getInputProps("whatsapp.interactive.header.text")}
        label="Header"
      />
      <TextInput
        {...form.getInputProps("whatsapp.interactive.body.text")}
        label="Body"
      />
      <TextInput
        {...form.getInputProps("whatsapp.interactive.footer.text")}
        label="Footer"
      />
      <TextInput
        {...form.getInputProps(
          "whatsapp.interactive.action.parameters.flow_cta"
        )}
        label="Button"
      />

      <Select
        {...form.getInputProps(
          "whatsapp.interactive.action.parameters.flow_id"
        )}
        data={data?.map((flow) => ({
          value: flow.id,
          label: flow.name,
        }))}
        label="Flow"
        placeholder="Pick a flow"
      />
    </Stack>
  );
}
