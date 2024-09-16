import { rem, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NodeControlWrapperComponent } from "../../NodeControlWrapperType";
import { ChatNode } from "./ChatNode";

export function ChatControls({
  onValuesChange,
  node,
}: NodeControlWrapperComponent<ChatNode>) {
  const form = useForm({
    initialValues: node.data,
    onValuesChange,
  });

  return (
    <Stack mb={rem(4)}>
      <Textarea {...form.getInputProps("config.system")} label="System" />
      <Textarea {...form.getInputProps("config.assistant")} label="Assistant" />
      <Select
        {...form.getInputProps("config.model")}
        data={["gpt-4o-mini"]}
        label="Longitude"
      />
    </Stack>
  );
}
