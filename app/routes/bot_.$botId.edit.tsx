import { Flex } from "@mantine/core";
import { Outlet, useOutlet, useParams } from "@remix-run/react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import Flow from "~/components/bot/Flow";
import { useMobile } from "~/hooks/useMobile";

export default function BotIdIndex() {
  const params = useParams();
  const inOutlet = !!useOutlet();
  const isMobile = useMobile();
  const bot = useQuery(api.bot.get, {
    bot: params.botId as Id<"bot">,
  });

  const update = useMutation(api.bot.update);

  return bot ? (
    <Flex w={!isMobile && inOutlet ? "calc(100% - 350px)" : "100%"} h="100%">
      <ReactFlowProvider>
        <Flow
          defaultNodes={bot.nodes}
          defaultEdges={bot.edges}
          update={update}
        />

        <Outlet />
      </ReactFlowProvider>
    </Flex>
  ) : null;
}
