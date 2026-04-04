"use client";
import { createContext, useContext, useState } from "react";

const PopupFormContext = createContext();

export const PopupFormProvider = ({ children }) => {
  const [activeForm, setActiveForm] = useState("enquiry"); // null, 'enquiry', or 'schedule'

  const openEnquiryForm = () => setActiveForm("enquiry");
  const openScheduleForm = () => setActiveForm("schedule");
  const closeForm = () => setActiveForm(null);
  const toggleForm = () => setActiveForm((prev) => (prev ? null : "enquiry"));

  return (
    <PopupFormContext.Provider
      value={{
        activeForm,
        isEnquiryFormOpen: activeForm === "enquiry",
        isScheduleFormOpen: activeForm === "schedule",
        openEnquiryForm,
        openScheduleForm,
        closeForm,
        toggleForm,
        // Keep legacy props for backwards compatibility
        isFormOpen: activeForm === "enquiry",
        openForm: openEnquiryForm,
      }}
    >
      {children}
    </PopupFormContext.Provider>
  );
};

export const usePopupForm = () => useContext(PopupFormContext);
