import { Suspense } from "react";

import { RecruiterGuidanceHubClient } from "@/app/recruiter/guidance/_components/RecruiterGuidanceHubClient";

import LoadingSpinner from "@/components/shared/LoadingSpinner";

export function RecruiterGuidanceHub() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <RecruiterGuidanceHubClient />
    </Suspense>
  );
}
