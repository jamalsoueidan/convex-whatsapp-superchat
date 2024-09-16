import { Divider, Flex, ScrollArea, Text, Title } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { Doc } from "convex/_generated/dataModel";
import { TeamUserCard } from "./TeamUserCard";

export function TeamList({ users }: { users: Array<Doc<"users">> }) {
  const params = useParams();

  return (
    <>
      <Flex p="md" h="60px" align="center" gap="xs">
        <Title order={3}>Team members</Title>
      </Flex>
      <Divider />

      <ScrollArea.Autosize type="scroll" mah="100%" w="100%" mx="auto">
        {users?.map((user) => (
          <TeamUserCard
            user={user}
            key={user._id}
            selected={user._id === params.userId}
          />
        ))}
        {users.length === 0 && (
          <Flex justify="center" p="xl">
            <Text c="dimmed">No users</Text>
          </Flex>
        )}
      </ScrollArea.Autosize>
    </>
  );
}
