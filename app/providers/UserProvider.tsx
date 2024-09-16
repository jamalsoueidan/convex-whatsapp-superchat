import { Doc } from "convex/_generated/dataModel";
import React, { createContext, useContext } from "react";

type UserContextType = {
  user: Doc<"users">;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserContext = createContext<UserContextType>({} as any);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context.user;
};

export const UserProvider: React.FC<{
  children: React.ReactNode;
  user: Doc<"users">;
}> = ({ children, user }) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
