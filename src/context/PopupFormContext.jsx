"use client";
import { createContext, useContext, useState } from "react";

const PopupFormContext = createContext();

export const PopupFormProvider = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(true);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const toggleForm = () => setIsFormOpen((prev) => !prev);

  return (
    <PopupFormContext.Provider
      value={{ isFormOpen, openForm, closeForm, toggleForm }}
    >
      {children}
    </PopupFormContext.Provider>
  );
};

export const usePopupForm = () => useContext(PopupFormContext);
