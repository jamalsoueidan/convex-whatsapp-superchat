import {
  ActionIcon,
  Button,
  noop,
  Select,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "@remix-run/react";
import { IconFiles, IconPrinter, IconSend } from "@tabler/icons-react";
import { Panel, useReactFlow } from "@xyflow/react";
import { useCallback, useState } from "react";
import { CustomModal } from "../CustomModal";
import { NodeAutoLayout } from "./NodeAutoLayout";

export function FlowPanel() {
  const location = useLocation();
  const { getNodes, getEdges } = useReactFlow();
  const [opened, { close }] = useDisclosure(false);

  const [value, setValue] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState("");

  const send = useCallback(noop, []);

  return (
    <Panel position="top-right">
      <Stack gap="xs">
        <Tooltip label="Logs" position="left" closeDelay={1}>
          <ActionIcon
            size="lg"
            component={Link}
            to={location.pathname.includes("logs") ? "../edit" : "logs"}
          >
            <IconFiles />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Print" position="left">
          <ActionIcon
            size="lg"
            onClick={() => {
              const edges = getEdges();
              const nodes = getNodes();
              const node = nodes.find((node) => node.type === "chat");
              const edgesConnectedChat = edges.filter(
                (edge) => edge.source === node?.id
              );
              console.log(
                nodes.filter((nodeItem) =>
                  edgesConnectedChat.some((edge) => edge.target === nodeItem.id)
                )
              );
            }}
          >
            <IconPrinter />
          </ActionIcon>
        </Tooltip>
        <NodeAutoLayout />
      </Stack>

      <CustomModal opened={opened} onClose={close} title="Send bot">
        <Stack>
          <Select
            label="Contacts"
            placeholder="Pick contact"
            searchable
            searchValue={searchValue}
            value={value}
            onChange={setValue}
            onSearchChange={setSearchValue}
            maxDropdownHeight={200}
            nothingFoundMessage="Nothing found..."
          />
          <Select
            label="Node"
            placeholder="From which node to start the flow?"
            data={getNodes().map((node) => ({
              value: node.id,
              label: node.type || "unknown",
            }))}
          />
          <div>
            <Button onClick={send} rightSection={<IconSend />}>
              Send
            </Button>
          </div>
        </Stack>
      </CustomModal>
    </Panel>
  );
}
