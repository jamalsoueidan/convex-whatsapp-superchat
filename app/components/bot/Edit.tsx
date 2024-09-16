import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSearchParams } from "@remix-run/react";
import { Doc } from "convex/_generated/dataModel";
import { ReactMutation } from "convex/react";
import { FunctionReference } from "convex/server";
import { useCallback } from "react";
import { CustomModal } from "../CustomModal";

export function BotEdit({
  bot,
  update,
}: {
  bot: Doc<"bot">;
  update: ReactMutation<FunctionReference<"mutation">>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onValuesChange = useCallback(
    (values: Doc<"bot">) => {
      update({
        id: values._id,
        title: values.title,
        status: values.status,
      });
    },
    [update]
  );

  const form = useForm({
    initialValues: bot,
    onValuesChange,
  });

  const toggle = searchParams.get("modal") == "edit";

  return (
    <CustomModal
      opened={!!toggle}
      onClose={() =>
        setSearchParams((prev) => {
          prev.delete("modal");
          return prev;
        })
      }
      title={`Edit ${bot.title} bot`}
    >
      <Stack>
        <TextInput {...form.getInputProps("title")} label="Title" />
        <SegmentedControl
          {...form.getInputProps("status")}
          data={[
            { label: "Draft", value: "draft" },
            { label: "Live", value: "live" },
          ]}
        />
      </Stack>
    </CustomModal>
  );
}
