import { useAuthActions } from "@convex-dev/auth/react";
import {
  BackgroundImage,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBrandFacebook } from "@tabler/icons-react";
import { useMobile } from "~/hooks/useMobile";

export function SignIn() {
  const { signIn } = useAuthActions();
  const isMobile = useMobile();

  return (
    <>
      <Paper radius="md" p="xl" w={isMobile ? "100%" : "40%"}>
        <Text size="lg" fw={500} ta="center">
          Welcome to Whatsapp SuperChat!
        </Text>

        <Group grow mb="md" mt="md">
          <Button
            radius="xl"
            size="xl"
            leftSection={<IconBrandFacebook />}
            variant="filled"
            color="blue"
            onClick={() => signIn("facebook")}
          >
            Login (Facebook)
          </Button>
        </Group>

        <Divider label="About us" labelPosition="center" mt="xl" mb="md" />

        <Title order={6} ta="center">
          A powerful application built on WhatsApp Cloud API, designed to give
          business owners enhanced control over customer interactions, replacing
          the need for the standard WhatsApp Business app with advanced
          automation, messaging tools, and workflow management.
        </Title>

        <br />

        <Stack gap="xs">
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Responsive Design:
            </Text>
            The UI adapts to mobile and desktop layouts, providing a smooth
            experience across devices.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Real-time Chat:
            </Text>
            Users can engage in real-time conversations.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Unread Message Count:
            </Text>
            The application tracks unread messages per conversation, showing
            users how many new messages they have. Each user has their own
            conversation history.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              WhatsApp Business API Integration:
            </Text>
            The application integrates with the WhatsApp Business API to handle
            incoming and outgoing messages.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Automated Interactive Workflows:
            </Text>
            Users can create and manage complex interactive workflows using a
            visual interface, allowing for automated sequences based on user
            responses.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Internal Messaging with Mentions:
            </Text>
            Users can send internal messages to team members within the chat
            using mentions (@).
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Contacts:
            </Text>
            Users can access and search through contacts.
          </Text>
          <Text fz="xs" ta="center">
            <Text fw="500" fz="xs">
              Infinity Scroll for Conversations:
            </Text>
            Load older messages as the user scrolls up.
          </Text>
        </Stack>
      </Paper>

      <BackgroundImage src="https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" />
    </>
  );
}
