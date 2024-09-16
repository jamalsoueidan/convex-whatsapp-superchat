import React, { createContext, useContext, useState } from "react";

type ScrollContextType = {
  scrollPosition: { x: number; y: number };
  setScrollPosition: (position: { x: number; y: number }) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  return (
    <ScrollContext.Provider value={{ scrollPosition, setScrollPosition }}>
      {children}
    </ScrollContext.Provider>
  );
};
