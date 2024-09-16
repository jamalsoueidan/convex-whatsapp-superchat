import { rem, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NodeControlWrapperComponent } from "../../NodeControlWrapperType";
import { LocationNode } from "./LocationNode";

export function LocationControls({
  onValuesChange,
  node,
}: NodeControlWrapperComponent<LocationNode>) {
  const form = useForm({
    initialValues: node.data,
    onValuesChange,
  });

  return (
    <Stack mb={rem(4)}>
      <TextInput
        {...form.getInputProps("whatsapp.location.name")}
        label="Name"
      />{" "}
      <TextInput
        {...form.getInputProps("whatsapp.location.address")}
        label="Address"
      />{" "}
      <TextInput
        {...form.getInputProps("whatsapp.location.latitude")}
        label="Latitude"
      />
      <TextInput
        {...form.getInputProps("whatsapp.location.longitude")}
        label="Longitude"
      />
    </Stack>
  );
}
