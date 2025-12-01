import AdminSignInPage from "@/components/Pages/Auth/Admin/AdminSignInPage";
import React, { Suspense } from "react";

const page = () => {
  return <Suspense fallback={<div>Loading...</div>}>
      <AdminSignInPage />
    </Suspense>
};

export default page;
