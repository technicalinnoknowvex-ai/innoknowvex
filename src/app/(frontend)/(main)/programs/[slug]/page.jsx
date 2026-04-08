import ProgramDetailsPage from "@/components/Pages/ProgramDetails/ProgramDetailsPage";
import React from "react";
import { getProgramById } from "@/app/(backend)/api/programs/programs";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { slug } = params;

  // Fetch program from database using the slug as the ID
  const program = await getProgramById(slug);

  // If program not found, show 404
  if (!program) {
    notFound();
  }

  return <ProgramDetailsPage program={program} courseName={slug} />;
};

export default page;
