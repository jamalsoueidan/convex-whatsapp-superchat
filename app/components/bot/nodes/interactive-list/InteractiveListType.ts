import { InteractiveTrigger } from "../../NodeWrapper";

export type InteractiveList = {
  trigger?: InteractiveTrigger["trigger"] & {
    done?: {
      message: string;
      list_reply: {
        title: string;
        id: string;
      };
      type: string;
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
        button: string;
        sections: Array<{
          title: string;
          rows: Array<{
            id: string;
            title: string;
            description: string;
          }>;
        }>;
      };
    };
  };
};
