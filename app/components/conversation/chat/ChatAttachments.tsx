import { ActionIcon, Menu, rem } from "@mantine/core";
import { Link, useParams } from "@remix-run/react";
import { IconFaceId, IconPlus } from "@tabler/icons-react";

export function ChatAttachments() {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <>
      <Menu shadow="md" width={200} position="top" offset={16} withArrow>
        <Menu.Target>
          <ActionIcon variant="transparent" size="xl">
            <IconPlus stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconFaceId style={{ width: rem(14), height: rem(14) }} />
            }
            component={Link}
            to={`/conversation/${conversationId}/flows`}
          >
            Flows
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
