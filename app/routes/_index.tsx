import { Divider, Flex, Title } from "@mantine/core";

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
      </Flex>
    </>
  );
}
