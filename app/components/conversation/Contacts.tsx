import {
  ActionIcon,
  Card,
  CloseButton,
  Divider,
  Flex,
  Group,
  Input,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import { ContactCard } from "./ContactCard";

export function Contacts() {
  const [, setSearchParams] = useSearchParams();
  const [value, setValue] = useState("");
  const contacts = useQuery(api.conversation.search, { query: value });

  const groupedContacts = useMemo(() => {
    if (!contacts) {
      return {};
    }
    return contacts.reduce(
      (groups: Record<string, typeof contacts>, contact) => {
        const firstChar = contact.name ? contact.name[0].toUpperCase() : "#";

        if (!groups[firstChar]) {
          groups[firstChar] = [];
        }

        groups[firstChar].push(contact);
        return groups;
      },
      {}
    );
  }, [contacts]);

  const keys = Object.keys(groupedContacts);

  return (
    <>
      <Flex p="md" h="60px" justify="space-between" align="center" gap="xs">
        <Group>
          <ActionIcon
            onClick={() =>
              setSearchParams((prev) => {
                prev.delete("toggle");
                return prev;
              })
            }
            variant="transparent"
            color="#666"
          >
            <IconArrowLeft stroke="1.5" />
          </ActionIcon>

          <Title order={4}>New Chat</Title>
        </Group>
      </Flex>
      <Input
        placeholder="Type name contact"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        rightSectionPointerEvents="all"
        mx="md"
        mb="md"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setValue("")}
            style={{ display: value ? undefined : "none" }}
          />
        }
      />
      <Divider />

      <ScrollArea.Autosize type="scroll" mah="100%" w="100%" mx="auto">
        {keys.sort().map((char) => (
          <React.Fragment key={char}>
            <Card py="xs" px="lg" mr="xs" radius="0">
              <Title order={4} c="green">
                {char}
              </Title>
            </Card>
            {groupedContacts[char].map((contact) => (
              <ContactCard conversation={contact} key={contact._id} />
            ))}
          </React.Fragment>
        ))}
        {keys.length === 0 && value ? (
          <Flex justify="center" p="xl">
            <Text c="dimmed">No results found for &apos;{value}&apos;</Text>
          </Flex>
        ) : null}
      </ScrollArea.Autosize>
    </>
  );
}
