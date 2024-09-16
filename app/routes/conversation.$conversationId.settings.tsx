import {
  Accordion,
  ActionIcon,
  Divider,
  Drawer,
  Flex,
  noop,
  ScrollArea,
  Title,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { Link, useParams } from "@remix-run/react";
import { useMobile } from "~/hooks/useMobile";

export default function ConversationSettings() {
  const isMobile = useMobile();
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <Drawer.Root
      position="right"
      size={isMobile ? "100%" : "30%"}
      onClose={noop}
      opened={true}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Drawer.Content>
        <Drawer.Body p="0">
          <Flex px="sm" py="xs" h="60px" align="center" justify="space-between">
            <Title order={4}>Settings</Title>

            <ActionIcon
              variant="transparent"
              aria-label="Back"
              color="black"
              component={Link}
              to={`/conversation/${conversationId}`}
            >
              <IconX stroke={1.5} />
            </ActionIcon>
          </Flex>

          <Divider />

          <Accordion
            chevronPosition="right"
            variant="default"
            defaultValue="assignments"
          >
            <Accordion.Item value="assignments">
              <Accordion.Control>User assignment</Accordion.Control>
              <Accordion.Panel>as</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="flows">
              <Accordion.Control>Flows replies (newest top)</Accordion.Control>
              <Accordion.Panel>asd</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
