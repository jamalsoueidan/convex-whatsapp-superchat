import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { api } from "convex/_generated/api";
import { useMutation, UsePaginatedQueryReturnType } from "convex/react";
import { contacts } from "convex/tables/message";
import { Infer } from "convex/values";
import { Fragment } from "react/jsx-runtime";
import { CustomModal } from "~/components/CustomModal";
import { MessageTime } from "./MessageTime";
import { MessageWrapper } from "./MessageWrapper";

type Contact = Infer<typeof contacts>[0];

export function MessageContacts({
  msg,
}: {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
}) {
  const create = useMutation(api.conversation.create);
  const [opened, { open, close }] = useDisclosure(false);

  const add = async (contact: Contact) => {
    const customer_phone_number = contact.phones
      ? contact.phones[0].phone
      : contact.name.formatted_name;
    await create({
      conversation: msg.conversation,
      name: contact.name.first_name,
      customer_phone_number,
      timestamp: Math.floor(Date.now() / 1000),
    });
  };

  return (
    <>
      <MessageWrapper msg={msg}>
        <Button
          variant="transparent"
          leftSection={
            <Avatar.Group spacing="lg">
              {msg.contacts && msg.contacts.length > 1 ? (
                <>
                  <Avatar />
                  <Avatar />
                </>
              ) : null}
              <Avatar>+{msg.contacts?.length}</Avatar>
            </Avatar.Group>
          }
        >
          {msg.contacts?.map((contact) => (
            <Fragment key={contact.name.first_name}>
              {contact.name.first_name}
            </Fragment>
          ))}
        </Button>
        <MessageTime msg={msg} />
        <Card.Section>
          <Divider />
        </Card.Section>
        <Button variant="transparent" onClick={open}>
          View all
        </Button>
      </MessageWrapper>
      <CustomModal opened={opened} onClose={close} centered>
        <Stack>
          {msg.contacts?.map((contact) => (
            <Paper key={contact.name.first_name} withBorder p="xs">
              <Flex justify="space-between">
                <Group align="center" gap="xs">
                  <Avatar />
                  <Title fz="lg">{contact.name.first_name}</Title>
                </Group>
                {!contact.phones ? (
                  <Button size="xs" onClick={() => add(contact)}>
                    Add
                  </Button>
                ) : null}
              </Flex>
              {contact.phones?.map((phone) => (
                <Flex key={phone.phone} align="center" gap="xs">
                  <Text>
                    {phone.phone} ({phone.type})
                  </Text>
                  <Button size="xs" onClick={() => add(contact)}>
                    Add
                  </Button>
                </Flex>
              ))}
            </Paper>
          ))}
        </Stack>
      </CustomModal>
    </>
  );
}
