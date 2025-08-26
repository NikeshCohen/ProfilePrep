import type { Metadata } from "next";

import { GuidanceHub } from "@/app/portal/guidance/_components/GuidanceHub";

export const metadata: Metadata = {
  title: "Career Guidance Hub | ProfilePrep",
  description:
    "Personalized career guidance tailored to your field, specialization, and career stage",
};

export default function CandidateGuidancePage() {
  return <GuidanceHub />;
}
