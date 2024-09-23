import { api } from "convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import React, { createContext, useContext } from "react";
import { useRemainingTime } from "~/hooks/useRemainingTime";

type ConversationContextType = {
  conversation: FunctionReturnType<typeof api.conversation.getId>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConversationContext = createContext<ConversationContextType>({} as any);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }

  const remainingDuration = useRemainingTime(context.conversation);

  return { ...context.conversation, remainingDuration };
};

export const ConversationProvider: React.FC<{
  children: React.ReactNode;
  conversation: FunctionReturnType<typeof api.conversation.getId>;
}> = ({ children, conversation }) => {
  return (
    <ConversationContext.Provider value={{ conversation }}>
      {children}
    </ConversationContext.Provider>
  );
};
