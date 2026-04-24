"use client";

import React from "react";
import styles from "./styles/mainLayout.module.scss";
import Navbar from "@/components/Pages/Landing/Sections/Navbar/Navbar";
import { NavColorProvider } from "@/context/NavColorContext";
import { PopupFormProvider } from "@/context/PopupFormContext";
import PopUpForm from "@/components/PopUpForm/PopUpForm";
import ScheduleModal from "@/components/PopUpForm/ScheduleModal";
import FloatingButton from "@/components/Common/FloatingButton";
import { PosterModal } from "@/components/Common/PosterModal";
import { usePosterModal } from "@/hooks/posterModal";

const MainLayout = ({ children }) => {
  const { showPoster, closePoster } = usePosterModal(10000); // 10 seconds delay

  return (
    <NavColorProvider>
      <PopupFormProvider>
        <div className={styles.mainLayout}>
          <Navbar />
          <PopUpForm />
          <ScheduleModal />
          <PosterModal isOpen={showPoster} onClose={closePoster} />
          <FloatingButton />
          {children}
        </div>
      </PopupFormProvider>
    </NavColorProvider>
  );
};

export default MainLayout;
