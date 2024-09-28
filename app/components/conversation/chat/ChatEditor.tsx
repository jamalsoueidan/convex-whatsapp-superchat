/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Switch,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import "@mantine/tiptap/styles.css";

import { Link, useParams } from "@remix-run/react";
import { IconFaceId } from "@tabler/icons-react";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useMobile } from "~/hooks/useMobile";
import { useSendMessage } from "~/hooks/useSendMessage";
import { useSuggestion } from "~/hooks/useSuggestion";
import { KeyboardExtension } from "~/lib/KeyboardExtensions";
import { useConversation } from "~/providers/ConversationProvider";
import { ChatTimer } from "./ChatTimer";
import { getInitials } from "./messages/MessageWrapper";

dayjs.extend(duration);

export const ChatEditor = () => {
  const user = useQuery(api.auth.currentUser);
  const isMobile = useMobile();
  const conversation = useConversation();
  const { conversationId } = useParams();
  const send = useSendMessage();
  const [, setEditorContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `Type a message...`,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: useSuggestion(),
      }),
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
      }),
      KeyboardExtension,
    ],
    onUpdate({ editor }) {
      setEditorContent(editor.getText());
    },
  });

  const handler = useCallback(() => {
    if (!editor) return;

    const content = editor.getHTML();
    const value = editor.getText();
    if (value.length === 0) return;

    send({
      conversation: conversationId as Id<"conversation">,
      type: isInternal ? "internal_message" : "text",
      text: {
        body: isInternal ? content : value,
      },
      timestamp: Math.floor(Date.now() / 1000),
    });

    editor.commands.clearContent();
  }, [conversationId, editor, isInternal, send]);

  useEffect(() => {
    if (!editor || isMobile === undefined) return;

    const keyboardHandlerExtension = editor.extensionManager.extensions.find(
      (extension) => extension.name === KeyboardExtension.name
    );
    if (keyboardHandlerExtension) {
      keyboardHandlerExtension.storage.isMobile = isMobile;
      keyboardHandlerExtension.storage.send = handler;
    }
  }, [isMobile, editor, handler]);

  return (
    <Fragment>
      <Flex justify="center">
        <ChatTimer remainingDuration={conversation.remainingDuration} />
      </Flex>
      <Card
        withBorder
        radius="md"
        m="xs"
        p="xs"
        bg={"white"}
        styles={{ root: { border: "1px solid var(--mantine-color-gray-4)" } }}
      >
        <Flex w="100%" justify="center" mb="xs">
          <Avatar color="cyan" radius="sm" size="md">
            {getInitials(user?.name || "")}
          </Avatar>
          <RichTextEditor
            editor={editor}
            w="100%"
            styles={{
              root: { border: "none" },
              content: {
                backgroundColor: "white",
              },
            }}
          >
            <RichTextEditor.Content />
          </RichTextEditor>
        </Flex>
        <Card.Section bg="gray.1">
          <Flex
            align="center"
            gap="xs"
            px="sm"
            pb="md"
            pt="xs"
            justify="space-between"
            direction="row"
            w="100%"
          >
            <Group>
              <ActionIcon
                variant={isMobile ? "filled" : "transparent"}
                color="gray.9"
                radius="md"
                size="md"
                component={Link}
                to={`/conversation/${conversationId}/flows`}
                aria-label="Send"
              >
                <IconFaceId stroke="2.5" />
              </ActionIcon>
            </Group>
            <Group>
              <Switch
                size="lg"
                onLabel="Sending to other staff"
                offLabel="Sending to customer"
                checked={isInternal}
                onChange={(event) => {
                  setIsInternal(event.currentTarget.checked);
                }}
              />

              <Button
                variant="outline"
                color="green"
                size="compact-sm"
                onClick={handler}
                aria-label="Send"
              >
                Send
              </Button>
            </Group>
          </Flex>
        </Card.Section>
      </Card>
    </Fragment>
  );
};
