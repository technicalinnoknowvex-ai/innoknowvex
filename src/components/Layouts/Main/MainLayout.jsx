import React from "react";
import styles from "./styles/mainLayout.module.scss";
import Navbar from "@/components/Pages/Landing/Sections/Navbar/Navbar";
import { NavColorProvider } from "@/context/NavColorContext";
import { PopupFormProvider } from "@/context/PopupFormContext";
import PopUpForm from "@/components/PopUpForm/PopUpForm";
const MainLayout = ({ children }) => {
  return (
    <NavColorProvider>
      <PopupFormProvider>
        <div className={styles.mainLayout}>
          {/* <Navbar /> */}
          <PopUpForm />
          {children}
        </div>
      </PopupFormProvider>
    </NavColorProvider>
  );
};

export default MainLayout;
