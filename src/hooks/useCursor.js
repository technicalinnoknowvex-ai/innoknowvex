"use client";

import { useContext } from "react";
import CursorContext from "../context/CursorContext";

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
