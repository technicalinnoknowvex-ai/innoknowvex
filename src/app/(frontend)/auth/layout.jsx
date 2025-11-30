import AuthLayout from "@/components/Layouts/Auth/AuthLayout";
import React from "react";

const layout = ({ children }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default layout;
