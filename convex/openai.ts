import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const askChat = internalAction({
  args: {
    content: v.string(),
    nodes: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const { nodes, content } = args;

    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an assistant for a service. Based on the user's input, respond naturally and trigger available nodes to perform actions like sending information or initiating flows. When a node matches, provide a short, friendly message like "I’ll send that to you now," and return the node ID, but don't send any specific information from the node itself. The system will handle the action based on the node ID. Match the user’s language and keep responses concise. If the user asks what you can do, briefly describe the nodes, e.g., "I can help you book a table or send our location."" The available nodes are ${JSON.stringify(
              nodes
            )}.`,
          },
          { role: "user", content },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "response",
            schema: {
              type: "object",
              properties: {
                node_id: { type: "string" },
                message: { type: "string" },
              },
              required: ["node_id", "message"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      }),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(json.error);
    }

    return json as ChatGPTResponse;
  },
});

interface ChatGPTResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
}
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_tokens_details: Completiontokensdetails;
}

interface Completiontokensdetails {
  reasoning_tokens: number;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}
