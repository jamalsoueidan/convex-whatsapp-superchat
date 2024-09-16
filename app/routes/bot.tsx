import {
  Anchor,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback } from "react";

import { CustomModal } from "~/components/CustomModal";

export default function Bot() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const create = useMutation(api.bot.create);
  const [title, setTitle] = React.useState("");

  const data = useQuery(api.bot.list);

  const submit = useCallback(() => {
    create({
      title,
      timestamp: Math.floor(Date.now() / 1000),
    }).then((value) => {
      navigate(`/bot/${value}/edit`);
    });
  }, [create, navigate, title]);

  return (
    <Flex bg="white" flex="1" direction="column" style={{ overflow: "hidden" }}>
      <Flex p="md" h="60px" justify="space-between" align="center" gap="xs">
        <Title order={3}>Bots</Title>
        <Button onClick={open}>Create new bot</Button>
      </Flex>
      <Divider />

      <ScrollArea.Autosize type="scroll" mah="100%" w="100%" mx="auto">
        <Table.ScrollContainer minWidth={450}>
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Steps</Table.Th>
                <Table.Th ta="right">Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((bot) => {
                return (
                  <Table.Tr key={bot._id.toString()}>
                    <Table.Td>
                      <Anchor component={Link} to={`/bot/${bot._id}/edit`}>
                        {bot.title}
                      </Anchor>
                    </Table.Td>

                    <Table.Td>
                      <Text size="xs">total {bot.nodes.length} steps</Text>
                    </Table.Td>

                    <Table.Td>
                      <Group justify="right">
                        <Badge
                          color={bot?.status === "live" ? "green" : "yellow"}
                        >
                          {bot?.status}
                        </Badge>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea.Autosize>
      <CustomModal opened={opened} onClose={close} title="Create new bot">
        <Stack>
          <TextInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            label="Title"
          />
          <Button onClick={() => submit()} disabled={title.length < 3}>
            Create bot
          </Button>
        </Stack>
      </CustomModal>
    </Flex>
  );
}
