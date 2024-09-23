/* eslint-disable jsx-a11y/media-has-caption */

import { api } from "convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { MessageTime } from "./MessageTime";
import { MessageWrapper } from "./MessageWrapper";

export function MessageAudio({
  msg,
}: {
  msg: UsePaginatedQueryReturnType<typeof api.message.paginate>["results"][0];
}) {
  return (
    <>
      <MessageWrapper msg={msg}>
        <video
          src={`${msg.storage}`}
          controls
          muted={false}
          playsInline
          width="100%"
          height="100px"
        />

        <MessageTime msg={msg} />
      </MessageWrapper>
    </>
  );
}
