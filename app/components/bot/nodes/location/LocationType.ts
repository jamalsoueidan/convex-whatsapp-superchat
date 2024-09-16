import { InteractiveTrigger } from "../../NodeWrapper";

export type Location = {
  trigger?: InteractiveTrigger["trigger"];
  whatsapp: {
    type: "location";
    location: {
      latitude: string;
      longitude: string;
      name: string;
      address: string;
    };
  };
};
