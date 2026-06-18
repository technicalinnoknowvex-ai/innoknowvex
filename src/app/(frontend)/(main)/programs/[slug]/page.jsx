import ProgramDetailsPage from "@/components/Pages/ProgramDetails/ProgramDetailsPage";
import React from "react";
import { getProgramById } from "@/app/(backend)/api/programs/programs";
import { notFound } from "next/navigation";
import { generateMetadataObject } from "@/utils/seo";
import { DEFAULT_OG_IMAGE, SITE_CONFIG } from "@/constants/seo";

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const program = await getProgramById(slug);

    if (!program || !program.name) {
      return generateMetadataObject({
        title: "Training Program - Innoknowvex",
        description: "Explore professional training programs in web development, MERN Stack, and cyber security.",
        keywords: ["training program", "course", "innoknowvex"],
        image: DEFAULT_OG_IMAGE,
        path: `/programs/${slug}`,
        type: "website",
      });
    }

    return generateMetadataObject({
      title: `${program.name} | Innoknowvex`,
      description:
        program.description ||
        `Learn ${program.name} with Innoknowvex. Professional training with placement support.`,
      keywords: [
        program.name || "program",
        "training program",
        "course",
        "professional training",
        "internship",
        "placement",
      ].join(", "),
      image: program.image || DEFAULT_OG_IMAGE,
      path: `/programs/${slug}`,
      type: "website",
    });
  } catch (error) {
    console.error(`Error generating metadata for program ${slug}:`, error);
    return generateMetadataObject({
      title: "Training Program - Innoknowvex",
      description: "Explore professional training programs in web development, MERN Stack, and cyber security.",
      keywords: ["training program", "course", "innoknowvex"],
      image: DEFAULT_OG_IMAGE,
      path: `/programs/${slug}`,
      type: "website",
    });
  }
}

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
