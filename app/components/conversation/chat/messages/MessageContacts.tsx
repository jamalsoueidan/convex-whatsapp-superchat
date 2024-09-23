import {
  Avatar,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { Fragment } from "react/jsx-runtime";
import { CustomModal } from "~/components/CustomModal";
import { MessageTime } from "./MessageTime";
import { MessageWrapper } from "./MessageWrapper";

export function MessageContacts({
  msg,
}: {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <MessageWrapper msg={msg}>
        <Button
          variant="transparent"
          leftSection={
            <Avatar.Group spacing="lg">
              <Avatar />
              <Avatar />
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
              <Group align="center" gap="xs">
                <Avatar />
                <Title fz="lg">{contact.name.first_name}</Title>
              </Group>
              {contact.phones?.map((phone) => (
                <Text key={phone.phone} mt="xs">
                  {phone.phone}
                </Text>
              ))}
            </Paper>
          ))}
        </Stack>
      </CustomModal>
    </>
  );
}
