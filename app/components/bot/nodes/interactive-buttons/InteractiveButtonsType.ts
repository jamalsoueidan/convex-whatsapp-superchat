import { InteractiveTrigger } from "../../NodeWrapper";

export type InteractiveButtons = {
  trigger?: InteractiveTrigger["trigger"] & {
    done?: {
      message: string;
      button_reply: {
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
      type: "button";
      header: {
        type: "text"; //can be image, and other type
        text: string;
      };
      body: {
        text: string;
      };
      footer: {
        text: string;
      };
      action: {
        buttons: Array<{
          type: "reply";
          reply: {
            id: string;
            title: string;
          };
        }>;
      };
    };
  };
};
