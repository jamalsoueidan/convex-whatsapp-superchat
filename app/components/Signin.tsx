import { useAuthActions } from "@convex-dev/auth/react";
import { Button, Flex, Group, Text, Title } from "@mantine/core";
import { IconBrandFacebook } from "@tabler/icons-react";
import { useMobile } from "~/hooks/useMobile";

export function SignIn() {
  const { signIn } = useAuthActions();
  const isMobile = useMobile();

  return (
    <Group h="100vh" gap="0">
      <Flex
        direction="column"
        miw="35%"
        p="xl"
        w={isMobile ? "100%" : "unset"}
        h={isMobile ? "50%" : "100%"}
        justify="center"
      >
        <Title ta="center" fz="h2" fw="500">
          Get started
        </Title>

        <Group grow mb="md" mt="md">
          <Button
            radius="xl"
            size="md"
            leftSection={<IconBrandFacebook />}
            variant="filled"
            color="blue"
            onClick={() => signIn("facebook")}
          >
            Login
          </Button>
        </Group>
      </Flex>
      <Flex
        bg="yellow.1"
        flex={1}
        h={isMobile ? "50%" : "100%"}
        p="xl"
        direction="column"
        justify="space-between"
      >
        <Title c="orange" fw="600">
          Whatsapp Superchat ●
        </Title>

        <Text c="orange" fw="500">
          A powerful application built on WhatsApp Cloud API, designed to give
          business owners enhanced control over customer interactions, replacing
          the need for the standard WhatsApp Business app with advanced
          automation, messaging tools, and workflow management.
        </Text>
      </Flex>
    </Group>
  );
}
