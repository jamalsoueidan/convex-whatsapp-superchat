import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { NodeControlWrapperComponent } from "../../NodeControlWrapperType";
import { InteractiveListNode } from "./InteractiveListNode";

export function InteractiveListControls({
  onValuesChange,
  node,
}: NodeControlWrapperComponent<InteractiveListNode>) {
  const form = useForm({
    initialValues: node.data,
    onValuesChange,
  });

  const sections = form
    .getValues()
    .whatsapp.interactive.action.sections.map((section, sectionIndex) => {
      const rows = section.rows.map((row, rowIndex) => (
        <React.Fragment key={row.id}>
          <Group gap="xs">
            <TextInput
              withAsterisk
              label="Row title"
              flex="1"
              {...form.getInputProps(
                `whatsapp.interactive.action.sections.${sectionIndex}.rows.${rowIndex}.title`
              )}
              maxLength={60}
            />

            <ActionIcon
              color="red"
              mt="lg"
              onClick={() =>
                form.removeListItem(
                  `whatsapp.interactive.action.sections.${sectionIndex}.rows`,
                  rowIndex
                )
              }
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
          <TextInput
            withAsterisk
            label="Row description"
            flex="1"
            {...form.getInputProps(
              `whatsapp.interactive.action.sections.${sectionIndex}.rows.${rowIndex}.description`
            )}
            maxLength={72}
          />
        </React.Fragment>
      ));

      return (
        <React.Fragment key={sectionIndex}>
          <Group gap="xs">
            <TextInput
              withAsterisk
              label="Section title"
              required
              flex="1"
              {...form.getInputProps(
                `whatsapp.interactive.action.sections.${sectionIndex}.title`
              )}
              maxLength={24}
            />

            <ActionIcon
              color="red"
              mt="lg"
              onClick={() =>
                form.removeListItem(
                  "whatsapp.interactive.action.sections",
                  sectionIndex
                )
              }
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Group>
          <Stack gap="xs" px="md">
            {rows}
          </Stack>
          <Group justify="center">
            <Button
              variant="light"
              size="xs"
              onClick={() =>
                form.insertListItem(
                  `whatsapp.interactive.action.sections.${sectionIndex}.rows`,
                  {
                    id: uuidv4(),
                    title: "",
                  }
                )
              }
            >
              Add row
            </Button>
          </Group>
        </React.Fragment>
      );
    });

  return (
    <>
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
          {...form.getInputProps("whatsapp.interactive.action.button")}
          label="Action button"
        />
      </Stack>
      <Card.Section>
        <Divider my="lg" />
      </Card.Section>
      <Stack>
        {sections}
        <Group justify="center">
          <Button
            onClick={() =>
              form.insertListItem("whatsapp.interactive.action.sections", {
                title: "",
                rows: [],
              })
            }
          >
            Add section
          </Button>
        </Group>
      </Stack>
    </>
  );
}
