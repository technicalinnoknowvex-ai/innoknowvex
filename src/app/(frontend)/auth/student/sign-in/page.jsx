import StudentSignInPage from "@/components/Pages/Auth/Student/StudentSignInPage";
import React , {Suspense} from "react";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.studentSignIn.title,
  description: PAGES.studentSignIn.description,
  keywords: PAGES.studentSignIn.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.studentSignIn.path,
  noindex: true,
});

const page = () => {
  return <Suspense fallback={<div>Loading...</div>}>
        <StudentSignInPage />
      </Suspense>
};

export default page;
