import StudentSignInPage from "@/components/Pages/Auth/Student/StudentSignInPage";
import React , {Suspense} from "react";

const page = () => {
  return <Suspense fallback={<div>Loading...</div>}>
        <StudentSignInPage />
      </Suspense>
};

export default page;
