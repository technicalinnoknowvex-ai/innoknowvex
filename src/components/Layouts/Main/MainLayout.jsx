import React from "react";
import styles from "./styles/mainLayout.module.scss";
import Navbar from "@/components/Pages/Landing/Sections/Navbar/Navbar";
import { NavColorProvider } from "@/context/NavColorContext";
import { PopupFormProvider } from "@/context/PopupFormContext";
import PopUpForm from "@/components/PopUpForm/PopUpForm";
import ScheduleModal from "@/components/PopUpForm/ScheduleModal";
import FloatingButton from "@/components/Common/FloatingButton";
const MainLayout = ({ children }) => {
  return (
    <NavColorProvider>
      <PopupFormProvider>
        <div className={styles.mainLayout}>
          <Navbar />
          <PopUpForm />
          <ScheduleModal />
          <FloatingButton />
          {children}
        </div>
      </PopupFormProvider>
    </NavColorProvider>
  );
};

export default MainLayout;
