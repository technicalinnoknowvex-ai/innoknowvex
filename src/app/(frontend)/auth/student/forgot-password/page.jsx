import AdminForgotPassword from "@/components/Pages/PasswordReset/ForgotPasswordForm";
import react from "react";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.forgotPassword.title,
  description: PAGES.forgotPassword.description,
  keywords: PAGES.forgotPassword.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.forgotPassword.path,
  noindex: true,
});

const page =()=>{
  return (
    <AdminForgotPassword/>
  )
}

export default page;