import { Flex, Title } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useMobile } from "~/hooks/useMobile";

export default function TeamPage() {
  const isMobile = useMobile();
  if (isMobile) {
    return <></>;
  }

  return (
    <Flex
      bg="#f0f2f5"
      flex="1"
      direction="column"
      style={{ overflow: "hidden" }}
      align="center"
      justify="center"
      gap="md"
    >
      <IconUser size={128} stroke={1} />
      <Title order={3} fw={600}>
        Select a team member
      </Title>
    </Flex>
  );
}
