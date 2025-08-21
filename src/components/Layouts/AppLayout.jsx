import React from "react";
import layoutStyles from "./styles/layout.module.scss";
import SmoothScroller from "./SmoothScroller";

const AppLayout = ({ children }) => {
  return (
    <div className={layoutStyles.layout}>
      <SmoothScroller>{children}</SmoothScroller>
    </div>
  );
};

export default AppLayout;
