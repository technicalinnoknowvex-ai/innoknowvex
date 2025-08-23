import React from "react";
import layoutStyles from "./styles/layout.module.scss";
import SmoothScroller from "./SmoothScroller";
import Navbar from "../Pages/Landing/Sections/Navbar/Navbar";
import { NavColorProvider } from "@/context/NavColorContext";

const AppLayout = ({ children }) => {
  return (
    <div className={layoutStyles.layout}>
      <Navbar />
      <SmoothScroller>{children}</SmoothScroller>
    </div>
  );
};

export default AppLayout;
