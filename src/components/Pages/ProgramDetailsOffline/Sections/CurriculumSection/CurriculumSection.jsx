"use client";

import ProgramCurriculum from "@/components/Common/ProgramCurriculum/ProgramCurriculum";

export default function CurriculumSection({ program, isOffline }) {
  return <ProgramCurriculum program={program} isOffline={isOffline} />;
}
