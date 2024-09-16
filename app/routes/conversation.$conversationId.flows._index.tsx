import { LoadingOverlay, Stack } from "@mantine/core";
import { api } from "convex/_generated/api";
import { Flow } from "convex/flow";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { FlowItem } from "~/components/conversation/chat/attachments/flows/FlowItem";

export default function ConversationFlowsIndex() {
  const list = useAction(api.flow.list);
  const [data, setData] = useState<Array<Flow> | null>(null);

  useEffect(() => {
    list().then((value) => setData(value.data));
  }, [list]);

  return (
    <>
      {data ? (
        <Stack>
          {data
            ?.filter((f) => f.status !== "DEPRECATED")
            .map((flow) => (
              <FlowItem flow={flow} key={flow.id} />
            ))}
        </Stack>
      ) : (
        <LoadingOverlay
          visible={!data}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      )}
    </>
  );
}
