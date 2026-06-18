import AdminSignUpPage from "@/components/Pages/Auth/Admin/AdminSignUpPage";
import React from "react";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.adminSignUp.title,
  description: PAGES.adminSignUp.description,
  keywords: PAGES.adminSignUp.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.adminSignUp.path,
  noindex: true,
});

const page = () => {
  return <AdminSignUpPage />;
};

export default page;
