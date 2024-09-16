import { useAuthActions } from "@convex-dev/auth/react";
import {
  BackgroundImage,
  Button,
  Divider,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { IconBrandFacebook } from "@tabler/icons-react";
import { useMobile } from "~/hooks/useMobile";

export function SignIn() {
  const { signIn } = useAuthActions();
  const isMobile = useMobile();

  return (
    <>
      <Paper radius="md" p="xl" w={isMobile ? "100%" : "40%"}>
        <Text size="lg" fw={500}>
          Welcome to Whatsapp SuperChat!
        </Text>

        <Group grow mb="md" mt="md">
          <Button
            radius="xl"
            leftSection={<IconBrandFacebook />}
            variant="default"
            onClick={() => signIn("facebook")}
          >
            Facebook
          </Button>
        </Group>

        <Divider label="Only option to login" labelPosition="center" my="lg" />
      </Paper>
      <BackgroundImage src="https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" />
    </>
  );
}
