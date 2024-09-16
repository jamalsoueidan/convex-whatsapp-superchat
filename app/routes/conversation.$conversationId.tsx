import { Flex } from "@mantine/core";
import { Outlet, useLocation, useNavigate, useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { ChatBody } from "~/components/conversation/chat/ChatBody";
import { ChatHeader } from "~/components/conversation/chat/ChatHeader";
import { CustomDrawer } from "~/components/CustomDrawer";
import { useMobile } from "~/hooks/useMobile";
import { ConversationProvider } from "~/providers/ConversationProvider";

export default function ConversationId() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const { conversationId } = useParams();

  const conversation = useQuery(api.conversation.getId, {
    conversation: conversationId as Id<"conversation">,
  });

  const components = useMemo(() => {
    if (conversation) {
      return (
        <ConversationProvider conversation={conversation}>
          <ChatHeader />
          <ChatBody />
          <Outlet />
        </ConversationProvider>
      );
    }
    return null;
  }, [conversation]);

  if (!conversation) {
    return null;
  }

  return isMobile ? (
    <CustomDrawer onClose={() => navigate("/conversation")} opened>
      {components}
    </CustomDrawer>
  ) : (
    <Flex
      bg="#f0f2f5"
      flex="1"
      style={{
        overflow: "hidden",
        marginRight: location.pathname.includes("/settings") ? "30%" : 0,
        transition: "margin-left 1s ease",
      }}
      direction="column"
    >
      {components}
    </Flex>
  );
}
