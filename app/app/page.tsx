import type { Metadata } from "next";

import AnalyzeContent from "@/app/app/_components/AnalyzeContent";
import GenerateContent from "@/app/app/_components/GenerateContent";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ProfilePrep - AI-Powered CV Tools",
};

async function page() {
  const { user } = await requireAuth("/app");

  // Debug logging
  console.log("User in /app page:", {
    email: user.email,
    userType: user.userType,
    role: user.role,
    isTestAccount: user.isTestAccount,
  });

  // Show different content based on user type
  if (user.userType === "CANDIDATE") {
    return <AnalyzeContent />;
  }

  if (user.userType === "RECRUITER") {
    return <GenerateContent />;
  }

  // TESTER type can access both - default to generation
  if (user.userType === "TESTER") {
    return <GenerateContent />;
  }

  // Default case - if no userType, show onboarding
  console.warn("User has no userType set, redirecting to onboarding");
  return <GenerateContent />;
}

export default page;
