/* eslint-disable jsx-a11y/media-has-caption */
import { UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { CustomModal } from "~/components/CustomModal";
import { MessageTime } from "./MessageTime";
import { MessageWrapper } from "./MessageWrapper";

export function MessageVideo({
  msg,
}: {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <MessageWrapper msg={msg}>
        <UnstyledButton onClick={open}>
          <video
            src={`${msg.storage}`}
            controls
            autoPlay
            muted
            playsInline
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </UnstyledButton>
        <MessageTime msg={msg} />
      </MessageWrapper>
      <CustomModal opened={opened} onClose={close} centered>
        <video
          src={opened ? `${msg.storage}` : ""}
          width="100%"
          height="100%"
          controls
          autoPlay
          muted={false}
          playsInline
        />
      </CustomModal>
    </>
  );
}
