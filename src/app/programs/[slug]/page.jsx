import ProgramDetailsPage from "@/components/Pages/ProgramDetails/ProgramDetailsPage";
import React from "react";
import { programs } from "@/data/programs";

const page = async ({ params }) => {
  const { slug } = await params;
  const program = await programs[slug];

  return <ProgramDetailsPage program={program} />;
};

export default page;
