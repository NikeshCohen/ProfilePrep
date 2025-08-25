import type { Metadata } from "next";

import { RecruiterGuidanceClient } from "@/app/recruiter/guidance/_components/RecruiterGuidanceClient";

export const metadata: Metadata = {
  title: "Recruiter Guidance | ProfilePrep",
  description: "Professional guidance and insights for recruiters",
};

export default function RecruiterGuidancePage() {
  return <RecruiterGuidanceClient />;
}