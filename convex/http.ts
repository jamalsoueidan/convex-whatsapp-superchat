import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { webhooks } from "./webhooks";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/webhooks",
  method: "POST",
  handler: webhooks,
});

http.route({
  path: "/webhooks",
  method: "GET",
  handler: webhooks,
});

export default http;
