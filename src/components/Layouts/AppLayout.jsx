import React from "react";
import layoutStyles from "./styles/layout.module.scss";
import SmoothScroller from "./SmoothScroller";
import Navbar from "../Pages/Landing/Sections/Navbar/Navbar";
import { NavColorProvider } from "@/context/NavColorContext";
import PopUpForm from "../PopUpForm/PopUpForm";

const AppLayout = ({ children }) => {
  return (
    <div className={layoutStyles.layout}>
      <NavColorProvider>
        <Navbar />
        <PopUpForm />
        <SmoothScroller>{children}</SmoothScroller>
      </NavColorProvider>
    </div>
  );
};

export default AppLayout;
