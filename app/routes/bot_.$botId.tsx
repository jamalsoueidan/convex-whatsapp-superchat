import { ActionIcon, Badge, Button, Divider, Flex, Title } from "@mantine/core";
import { Link, Outlet, useNavigate, useParams } from "@remix-run/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { BotEdit } from "~/components/bot/Edit";

export default function BotId() {
  const navigate = useNavigate();
  const params = useParams();

  const bot = useQuery(api.bot.get, {
    bot: params.botId as Id<"bot">,
  });

  const update = useMutation(api.bot.update);

  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex p="md" h="60px" justify="space-between" align="center" gap="xs">
        <Flex align="center">
          <ActionIcon
            variant="transparent"
            onClick={() => navigate("/bot")}
            color="black"
          >
            <IconArrowLeft />
          </ActionIcon>
          <Title order={3} mr="xs">
            {bot?.title}
          </Title>
          <Badge color={bot?.status === "live" ? "green" : "yellow"}>
            {bot?.status}
          </Badge>
        </Flex>
        <Button component={Link} to={`?modal=edit`}>
          Edit
        </Button>
      </Flex>
      <Divider />

      <Outlet />

      {bot ? <BotEdit bot={bot} update={update} /> : null}
    </Flex>
  );
}
