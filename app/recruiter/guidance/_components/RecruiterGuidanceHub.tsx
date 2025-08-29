import { Suspense } from "react";

import { RecruiterGuidanceHubClient } from "@/app/recruiter/guidance/_components/RecruiterGuidanceHubClient";

import { Spinner } from "@/components/global/Spinner";

export function RecruiterGuidanceHub() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <RecruiterGuidanceHubClient />
    </Suspense>
  );
}
