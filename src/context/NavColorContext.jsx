"use client";
import { createContext, useContext, useState } from "react";

const NavColorContext = createContext(undefined);

export const NavColorProvider = ({ children }) => {
  const [navColor, setNavColor] = useState("#262c35");

  return (
    <NavColorContext.Provider value={{ navColor, setNavColor }}>
      {children}
    </NavColorContext.Provider>
  );
};

export const useNavColor = () => {
  const context = useContext(NavColorContext);
  if (!context) {
    throw new Error("useNavColor must be used inside a NavColorProvider");
  }
  return context;
};
