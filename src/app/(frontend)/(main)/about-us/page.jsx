import React from "react";
import AboutDetailsPage from "@/components/Pages/AboutUsDetails/AboutDetailsPage";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.aboutUs.title,
  description: PAGES.aboutUs.description,
  keywords: PAGES.aboutUs.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.aboutUs.path,
  type: "website",
});

const page = () => {
  return <AboutDetailsPage />;
};

export default page;
