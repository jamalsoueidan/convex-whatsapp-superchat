import { redirect } from "@remix-run/react";

export const loader = async () => {
  return redirect("/conversation");
};

/*
export default function Conversation() {
  return (
    <>
      <Flex bg="white" h="100%" w="100%" p="xl" direction="column">
        <Title order={4}>
          A powerful application built on WhatsApp Cloud API, designed to give
          business owners enhanced control over customer interactions, replacing
          the need for the standard WhatsApp Business app with advanced
          automation, messaging tools, and workflow management.
        </Title>

        <Divider my="xl" />
        <Title order={4} mb="sm">
          Some of the features:
        </Title>
        <Stack gap="xs">
          <Text>
            <Text fw="500">Real-time Chat:</Text> Users can engage in real-time
            conversations.
          </Text>
          <Text>
            <Text fw="500">Unread Message Count: </Text>The application tracks
            unread messages per conversation, showing users how many new
            messages they have. User Conversations: Each user has their own
            conversation history, and the application tracks when the user last
            viewed each conversation.
          </Text>
          <Text>
            <Text fw="500">WhatsApp Business API Integration: </Text>The
            application integrates with the WhatsApp Business API to handle
            incoming and outgoing messages.
          </Text>
          <Text>
            <Text fw="500">Interactive Message Flows: </Text>Automate responses
            using interactive message flows, such as sending lists or buttons to
            users, and handle user responses to trigger further actions.{" "}
          </Text>
          <Text>
            <Text fw="500">Responsive Design:</Text> The UI adapts to mobile and
            desktop layouts, providing a smooth experience across devices.
          </Text>
          <Text>
            <Text fw="500">Automated Interactive Workflows:</Text> Users can
            create and manage complex interactive workflows using a visual
            interface, allowing for automated sequences based on user responses.
            This includes managing flows like interactive lists and buttons,
            which can trigger subsequent actions.
          </Text>
          <Text>
            <Text fw="500">Internal Messaging with Mentions:</Text> Users can
            send internal messages to team members within the chat using
            mentions (@), enabling streamlined communication and collaboration
            directly in the chat interface.
          </Text>
          <Text>
            <Text fw="500">Contacts:</Text> Users can access and search through
            contacts, making it easy to re-engage with past customers and send
            new messages.
          </Text>
          <Text>
            <Text fw="500">Infinity Scroll for Conversations:</Text> Load older
            messages as the user scrolls up, with a smooth infinity scroll that
            ensures efficient message loading without overwhelming the
            interface.
          </Text>
        </Stack>
      </Flex>
    </>
  );
}
*/
