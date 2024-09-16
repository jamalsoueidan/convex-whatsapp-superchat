import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const webhooks = httpAction(async (ctx, request) => {
  const url = new URL(request.url);

  const challenge = url.searchParams.get("hub.challenge");

  if (challenge) {
    return new Response(challenge, {
      status: 200,
    });
  }

  const body = await request.json();
  //console.log(body.entry[0].changes[0].value.statuses[0]);
  await ctx.scheduler.runAfter(0, internal.data.webhooks, body);
  return new Response("OK", { status: 200 });
});
