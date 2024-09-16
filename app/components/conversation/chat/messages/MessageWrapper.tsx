import { Avatar, Card, Flex, rem } from "@mantine/core";
import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { useMessageInfo } from "~/hooks/useMessageInfo";

export type MessageWrapperProps = {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
  bg?: string;
};

export const MessageWrapper = ({
  msg,
  children,
  bg,
}: MessageWrapperProps & { children: React.ReactNode }) => {
  const { isRecipientDifferent } = useMessageInfo(msg);
  const backgroundColor = isRecipientDifferent ? "white" : "#d9fdd3";
  const justify = isRecipientDifferent ? "flex-start" : "flex-end";

  return (
    <Flex justify={justify} align="start" mr="xs" my={rem(8)} gap="6px">
      <Card
        bg={bg || backgroundColor}
        py="4px"
        px="6px"
        miw={rem(55)}
        shadow="xs"
        radius="md"
        maw={{ base: "80%", md: "40%" }}
      >
        {children}
      </Card>
      {!isRecipientDifferent ? (
        msg.user?.name ? (
          <Avatar color="cyan" radius="xl" size={rem(30)}>
            {getInitials(msg.user?.name)}
          </Avatar>
        ) : (
          <Avatar color="grape" radius="xl" size={rem(30)}>
            BOT
          </Avatar>
        )
      ) : null}
    </Flex>
  );
};

export function getInitials(name: string) {
  const words = name.trim().split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}
