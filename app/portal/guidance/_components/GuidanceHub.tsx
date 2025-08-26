import { Suspense } from "react";

import { GuidanceHubClient } from "@/app/portal/guidance/_components/GuidanceHubClient";

import LoadingSpinner from "@/components/shared/LoadingSpinner";

export function GuidanceHub() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner text="Loading your personalised guidance..." />
        </div>
      }
    >
      <GuidanceHubClient />
    </Suspense>
  );
}
