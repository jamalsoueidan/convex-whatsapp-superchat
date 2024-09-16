import { Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NodeControlWrapperComponent } from "../../NodeControlWrapperType";
import { MessageNode } from "./MessageNode";

export function MessageControls({
  onValuesChange,
  node,
}: NodeControlWrapperComponent<MessageNode>) {
  const form = useForm({
    initialValues: node.data,
    onValuesChange,
  });

  return (
    <Stack>
      <Textarea {...form.getInputProps("whatsapp.text.body")} label="Body" />
      <Switch
        label="Require response"
        {...form.getInputProps("config.require_response", { type: "checkbox" })}
      />
    </Stack>
  );
}
