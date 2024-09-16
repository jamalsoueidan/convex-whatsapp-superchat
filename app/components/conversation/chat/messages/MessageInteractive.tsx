import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { MessageTime } from "./MessageTime";
import { MessageWrapper, MessageWrapperProps } from "./MessageWrapper";

export const MessageInteractive = ({ msg }: MessageWrapperProps) => {
  const isReplied = !!msg.statuses?.find((r) => r.status === "replied");

  return (
    <MessageWrapper msg={msg}>
      <Text size="sm" c="gray.9" fw="bold">
        {msg.interactive?.header?.text}
      </Text>
      <Text size="sm" c="gray.9">
        {msg.interactive?.body?.text}
      </Text>
      <Text size="sm" c="dimmed">
        {msg.interactive?.footer?.text}
      </Text>
      <MessageTime msg={msg} />
      <Card.Section>
        <Divider />
      </Card.Section>
      {msg.interactive?.type === "list" ? (
        <Stack gap={rem(4)}>
          {msg.interactive.action?.sections?.map((section, index) => (
            <Flex pt={rem(4)} justify="stretch" direction="column" key={index}>
              <Text size="xs" fw="500">
                {section.title || ""}
              </Text>
              <Stack gap={rem(2)}>
                {section.rows?.map((button, bIndex) => (
                  <Button color="green.6" key={bIndex} size="compact-xs">
                    {button.title || ""}
                  </Button>
                ))}
              </Stack>
            </Flex>
          ))}
        </Stack>
      ) : null}
      {msg.interactive?.type === "button" ? (
        <Flex pt={rem(4)} justify="stretch" gap="xs">
          {msg.interactive.action?.buttons?.map((button, index) => (
            <Button color="green.6" key={index} miw={rem(60)} size="compact-xs">
              {button.reply?.title || ""}
            </Button>
          ))}
        </Flex>
      ) : null}
      {msg.interactive?.type === "flow" ? (
        <Box p="4px">
          <Text
            size="xs"
            c={isReplied ? "dimmed" : "green"}
            fw="bold"
            ta="center"
          >
            {msg.interactive?.action?.parameters?.flow_cta}
          </Text>
        </Box>
      ) : null}
    </MessageWrapper>
  );
};
