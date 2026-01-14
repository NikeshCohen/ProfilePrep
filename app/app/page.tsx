import type { Metadata } from "next";

import AnalyzeContent from "@/app/app/_components/AnalyzeContent";
import GenerateContent from "@/app/app/_components/GenerateContent";
import { OnboardingCheck } from "@/app/app/_components/OnboardingCheck";

import { requireAuth } from "@/lib/utils";
import { isCandidate, isRecruiter, isTester } from "@/lib/roleUtils";

export const metadata: Metadata = {
  title: "ProfilePrep - AI-Powered CV Tools",
};

async function page() {
  const { user } = await requireAuth("/app");

  const content = () => {
    // Show different content based on user type
    if (isCandidate(user)) {
      return <AnalyzeContent />;
    }

    if (isRecruiter(user)) {
      return <GenerateContent />;
    }

    // TESTER type can access both - default to generation
    if (isTester(user)) {
      return <GenerateContent />;
    }

    // Default case - if no userType, show onboarding
    console.warn("User has no userType set, redirecting to onboarding");
    return <GenerateContent />;
  };

  return <OnboardingCheck>{content()}</OnboardingCheck>;
}

export default page;
