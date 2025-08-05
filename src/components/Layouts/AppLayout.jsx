import React from "react";
import layoutStyles from "./styles/layout.module.scss";

const AppLayout = ({ children }) => {
  return <div className={layoutStyles.layout}>{children}</div>;
};

export default AppLayout;
