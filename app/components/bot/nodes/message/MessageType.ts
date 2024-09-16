import { InteractiveTrigger } from "../../NodeWrapper";

export type Message = {
  trigger?: InteractiveTrigger["trigger"] & {
    done?: {
      text?: {
        body: string;
      };
      media?: {
        file_name: string;
      };
      type: string;
    };
    waiting?: {
      message: string;
    };
  };
  whatsapp: {
    type: "text";
    text: {
      preview_url: boolean;
      body: string;
    };
  };
  config: {
    require_response: boolean;
  };
};
