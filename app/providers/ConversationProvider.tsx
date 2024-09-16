import { Doc } from "convex/_generated/dataModel";
import React, { createContext, useContext } from "react";

type ConversationContextType = {
  conversation: Doc<"conversation">;
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
  return context.conversation;
};

export const ConversationProvider: React.FC<{
  children: React.ReactNode;
  conversation: Doc<"conversation">;
}> = ({ children, conversation }) => {
  return (
    <ConversationContext.Provider value={{ conversation }}>
      {children}
    </ConversationContext.Provider>
  );
};
