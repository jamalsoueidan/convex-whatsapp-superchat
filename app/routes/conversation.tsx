import { Flex } from "@mantine/core";
import { Outlet, useSearchParams } from "@remix-run/react";
import { Contacts } from "~/components/conversation/Contacts";
import { ConversationList } from "~/components/conversation/ConversationList";
import { useMobile } from "~/hooks/useMobile";

export default function Conversation() {
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();

  const toggle = searchParams.get("toggle");

  return (
    <>
      <Flex
        bg="white"
        h="100%"
        w={isMobile ? "100%" : "30%"}
        direction="column"
        style={{ overflow: "hidden" }}
      >
        {toggle === "contacts" ? <Contacts /> : <ConversationList />}
      </Flex>
      <Outlet />
    </>
  );
}
