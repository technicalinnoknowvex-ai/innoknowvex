import MainLayout from "@/components/Layouts/Main/MainLayout";
import SmoothScroller from "@/components/Layouts/SmoothScroller";
import { ScrollProvider } from "@/context/ScrollContext";
import React from "react";

const layout = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default layout;
