import type { Metadata } from "next";

import { RecruiterGuidanceHub } from "@/app/recruiter/guidance/_components/RecruiterGuidanceHub";

export const metadata: Metadata = {
  title: "Recruitment Excellence Hub | ProfilePrep",
  description:
    "Master modern recruiting with personalized guidance tailored to your industry",
};

export default function RecruiterGuidancePage() {
  return <RecruiterGuidanceHub />;
}
