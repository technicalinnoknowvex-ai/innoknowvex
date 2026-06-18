import StudentDashboardPage from "@/components/Pages/StudentDashboard/StudentDashboardPage";
import { getStudent } from "@/services/student/studentServices";
import { createClient } from "@/utils/supabase/server";
import { generateMetadataObject } from "@/utils/seo";
import { DEFAULT_OG_IMAGE } from "@/constants/seo";

export async function generateMetadata({ params }) {
  const { studentId } = await params;

  return generateMetadataObject({
    title: "Student Dashboard - Edutect",
    description: "Access your courses, progress, and learning materials on Edutect.",
    keywords: ["student dashboard", "learning portal", "course management", "progress tracker"],
    image: DEFAULT_OG_IMAGE,
    path: `/student/${studentId}/dashboard`,
    noindex: true,
  });
}

const page = async ({ params }) => {
  const { studentId } = await params;

  const studentDetails = await getStudent(studentId);

  return <StudentDashboardPage studentDetails={studentDetails} />;
};

export default page;
