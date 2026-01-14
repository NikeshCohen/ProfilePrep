import { Suspense } from "react";

import { GuidanceHubClient } from "@/app/portal/guidance/_components/GuidanceHubClient";

import { Spinner } from "@/components/global/Spinner";

export function GuidanceHub() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="space-y-4 text-center">
            <Spinner />
            <p className="text-muted-foreground">
              Loading your personalised guidance...
            </p>
          </div>
        </div>
      }
    >
      <GuidanceHubClient />
    </Suspense>
  );
}
