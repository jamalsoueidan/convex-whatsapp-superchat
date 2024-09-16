import { InteractiveTrigger } from "../../NodeWrapper";

export type InteractiveFlow = {
  trigger?: InteractiveTrigger["trigger"] & {
    done?: {
      message: string;
      flow_name: string;
      type: string;
    } & {
      [key: string]: Record<
        string,
        { question: string; type: string; value: string }
      >;
    };
    waiting?: {
      message: string;
    };
  };
  whatsapp: {
    type: string;
    interactive: {
      type: string;
      header: {
        type: string;
        text: string;
      };
      body: {
        text: string;
      };
      footer: {
        text: string;
      };
      action: {
        name: string;
        parameters: {
          flow_message_version: string;
          flow_token: string;
          flow_id?: string;
          mode: string;
          flow_cta: string;
          flow_action: string;
          flow_action_payload: {
            screen: string;
          };
        };
      };
    };
  };
};
