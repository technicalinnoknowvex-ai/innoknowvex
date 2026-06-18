import LandingPage from "@/components/Pages/Landing/LandingPage";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.home.title,
  description: PAGES.home.description,
  keywords: PAGES.home.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.home.path,
  type: "website",
});

const page = () => {
  return <LandingPage />;
};

export default page;
