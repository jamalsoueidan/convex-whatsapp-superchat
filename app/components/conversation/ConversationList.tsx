import {
  ActionIcon,
  Divider,
  Flex,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { Link, useLocation, useParams } from "@remix-run/react";
import { IconCirclePlus } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ConversationCard } from "~/components/conversation/ConversationCard";

export function ConversationList() {
  const location = useLocation();
  const { conversationId } = useParams();
  const conversations = useQuery(api.conversation.getAll);

  return (
    <>
      <Flex p="md" h="60px" justify="space-between" align="center" gap="xs">
        <Flex direction="row" align="center" gap="sm">
          <Title order={3}>Chat</Title>
          <Text fz="sm" fw="500" inline>
            +1 (555) 623-1830
          </Text>
        </Flex>
        <ActionIcon
          component={Link}
          to={`${location.pathname}?toggle=contacts`}
          variant="transparent"
          color="#666"
          size="lg"
        >
          <IconCirclePlus
            stroke="1.5"
            style={{ width: "100%", height: "100%" }}
          />
        </ActionIcon>
      </Flex>
      <Divider />

      <ScrollArea.Autosize type="scroll" mah="100%" w="100%" mx="auto">
        {conversations?.map((conversation) => (
          <ConversationCard
            conversation={conversation}
            key={conversation._id}
            selected={conversationId === conversation._id}
          />
        ))}
      </ScrollArea.Autosize>
    </>
  );
}
