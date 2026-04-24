import ProgramDetailsOfflinePage from "@/components/Pages/ProgramDetailsOffline/ProgramDetailsPage";
import React from "react";
import { getProgramById } from "@/app/(backend)/api/programs/programs";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { courseSlug } = params;

  // Fetch program from database using the slug as the ID
  const program = await getProgramById(courseSlug);

  // If program not found, show 404
  if (!program) {
    notFound();
  }

  return <ProgramDetailsOfflinePage program={program} courseName={courseSlug} />;
};

export default page;
