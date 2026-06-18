import StudentSignUpPage from "@/components/Pages/Auth/Student/StudentSignUpPage";
import React from "react";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.studentSignUp.title,
  description: PAGES.studentSignUp.description,
  keywords: PAGES.studentSignUp.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.studentSignUp.path,
  noindex: true,
});

const page = () => {
  return <StudentSignUpPage />;
};

export default page;
