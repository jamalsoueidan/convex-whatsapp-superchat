/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  noop,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";

import { Link, useNavigate, useParams } from "@remix-run/react";
import { IconX } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { useMobile } from "~/hooks/useMobile";

dayjs.extend(relativeTime);

export default function LogDrawer() {
  const isMobile = useMobile();
  const params = useParams();
  const navigate = useNavigate();

  const data = useQuery(api.customer_bot.list, {
    bot: params.botId as Id<"bot">,
  });

  return (
    <Drawer.Root
      position="right"
      size={isMobile ? "100%" : "350px"}
      opened={true}
      onClose={noop}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Drawer.Content>
        <Drawer.Body p="0">
          <Flex
            h="60px"
            w="100%"
            align="center"
            justify="space-between"
            px="sm"
          >
            <Title order={3}>Logs</Title>
            <ActionIcon
              onClick={() => {
                navigate("../");
              }}
              variant="transparent"
              color="black"
            >
              <IconX />
            </ActionIcon>
          </Flex>
          <Divider />
          {data?.length === 0 ? <Box p="xs">Nothing here yet!</Box> : null}
          {data?.map((log) => (
            <React.Fragment key={log._id.toString()}>
              <Card>
                <Flex direction="row" justify="space-between" align="center">
                  <Box>
                    <Text>{log.conversation?.name}</Text>
                    <Text fz="xs">status {log.status}</Text>
                    <Text size="xs">
                      {log.nodes.filter((e) => e.type !== "plus").length} steps
                    </Text>
                  </Box>
                  <Button
                    component={Link}
                    to={`/bot/${params.botId}/live/${log._id}/logs`}
                  >
                    View live
                  </Button>
                </Flex>
              </Card>
              <Divider />
            </React.Fragment>
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
