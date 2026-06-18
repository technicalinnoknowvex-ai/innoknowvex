import ResetPasswordForm from "@/components/Pages/PasswordReset/ResetPasswordForm";
import { generateMetadataObject } from "@/utils/seo";
import { PAGES, DEFAULT_OG_IMAGE } from "@/constants/seo";

export const metadata = generateMetadataObject({
  title: PAGES.resetPassword.title,
  description: PAGES.resetPassword.description,
  keywords: PAGES.resetPassword.keywords,
  image: DEFAULT_OG_IMAGE,
  path: PAGES.resetPassword.path,
  noindex: true,
});

const page = () => {
  return <ResetPasswordForm userType="universal" />;
}

export default page;