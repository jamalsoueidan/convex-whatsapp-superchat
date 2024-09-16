import { InteractiveTrigger } from "../../NodeWrapper";

export type Chat = {
  trigger?: InteractiveTrigger["trigger"];
  config: {
    require_response: boolean;
    system: string;
    assistant: string;
    model: string;
  };
};
