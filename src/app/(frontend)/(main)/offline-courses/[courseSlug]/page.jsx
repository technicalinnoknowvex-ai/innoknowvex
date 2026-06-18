import ProgramDetailsOfflinePage from "@/components/Pages/ProgramDetailsOffline/ProgramDetailsPage";
import React from "react";
import { getProgramById } from "@/app/(backend)/api/programs/programs";
import { notFound } from "next/navigation";
import { generateMetadataObject } from "@/utils/seo";
import { DEFAULT_OG_IMAGE, SITE_CONFIG } from "@/constants/seo";

export async function generateMetadata({ params }) {
  const { courseSlug } = params;

  try {
    const program = await getProgramById(courseSlug);

    if (!program || !program.name) {
      return generateMetadataObject({
        title: "Offline Course - Innoknowvex",
        description: "Explore our offline training programs with hands-on learning and expert mentors.",
        keywords: ["offline course", "training", "innoknowvex"],
        image: DEFAULT_OG_IMAGE,
        path: `/offline-courses/${courseSlug}`,
        type: "website",
      });
    }

    return generateMetadataObject({
      title: `${program.name} - Offline Course | Innoknowvex`,
      description:
        program.description ||
        `Master ${program.name} with Innoknowvex's offline training program. Hands-on learning with expert mentors.`,
      keywords: [
        program.name || "course",
        "offline course",
        "in-person training",
        "hands-on learning",
        "mentor-led",
        "professional training",
      ].join(", "),
      image: program.image || DEFAULT_OG_IMAGE,
      path: `/offline-courses/${courseSlug}`,
      type: "website",
    });
  } catch (error) {
    console.error(`Error generating metadata for course ${courseSlug}:`, error);
    return generateMetadataObject({
      title: "Offline Course - Innoknowvex",
      description: "Explore our offline training programs with hands-on learning and expert mentors.",
      keywords: ["offline course", "training", "innoknowvex"],
      image: DEFAULT_OG_IMAGE,
      path: `/offline-courses/${courseSlug}`,
      type: "website",
    });
  }
}

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
