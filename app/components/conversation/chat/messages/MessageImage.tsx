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

  return (
    <>
      <MessageWrapper msg={msg}>
        <UnstyledButton onClick={open}>
          <Image
            //src={`https://data.mongodb-api.com/app/facebook-ckxlfbp/endpoint/media?id=${msg.}`}
            //src={`${msg.media?.signed_url}`}
            mah={200}
            maw={300}
            loading="lazy"
          />
        </UnstyledButton>
        <MessageTime msg={msg} />
      </MessageWrapper>
      <CustomModal opened={opened} onClose={close} centered>
        <Image
          //src={`https://data.mongodb-api.com/app/facebook-ckxlfbp/endpoint/media?id=${msg.meedia?.file_nam}`}
          loading="lazy"
        />
      </CustomModal>
    </>
  );
}
