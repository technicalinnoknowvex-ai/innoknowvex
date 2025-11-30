import StudentDashboardPage from "@/components/Pages/StudentDashboard/StudentDashboardPage";
import { getStudent } from "@/services/student/studentServices";
import { createClient } from "@/utils/supabase/server";

const page = async ({ params }) => {
  const { studentId } = await params;

  const studentDetails = await getStudent(studentId);

  return <StudentDashboardPage studentDetails={studentDetails} />;
};

export default page;
