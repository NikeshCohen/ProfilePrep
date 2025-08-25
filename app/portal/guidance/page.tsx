import type { Metadata } from "next";

import { CandidateGuidanceClient } from "@/app/portal/guidance/_components/CandidateGuidanceClient";

export const metadata: Metadata = {
  title: "Career Guidance | ProfilePrep",
  description: "Personalized career guidance and insights for job seekers",
};

export default function CandidateGuidancePage() {
  return <CandidateGuidanceClient />;
}