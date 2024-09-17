import { Image, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { CustomModal } from "~/components/CustomModal";
import { MessageTime } from "./MessageTime";
import { MessageWrapper } from "./MessageWrapper";

export function MessageImage({
  msg,
}: {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
}) {
  const [opened, { open, close }] = useDisclosure(false);

  console.log(msg);
  return (
    <>
      <MessageWrapper msg={msg}>
        <UnstyledButton onClick={open}>
          <Image src={`${msg.storage}`} mah={200} maw={300} loading="lazy" />
        </UnstyledButton>
        <MessageTime msg={msg} />
      </MessageWrapper>
      <CustomModal opened={opened} onClose={close} centered>
        <Image src={`${msg.storage}`} loading="lazy" />
      </CustomModal>
    </>
  );
}
