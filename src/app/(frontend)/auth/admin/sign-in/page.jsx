import AdminSignInPage from "@/components/Pages/Auth/Admin/AdminSignInPage";
import React, { Suspense } from "react";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.adminSignIn.title,
  description: PAGES.adminSignIn.description,
  keywords: PAGES.adminSignIn.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.adminSignIn.path,
  noindex: true,
});

const page = () => {
  return <Suspense fallback={<div>Loading...</div>}>
      <AdminSignInPage />
    </Suspense>
};

export default page;
