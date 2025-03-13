"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { InfoPanel } from "@/app/app/_components/InfoPanel";

export function OnboardingClient() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // callback url from the query parameters
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  // redirect to the callback url when the info panel is closed
  useEffect(() => {
    if (!isInfoPanelOpen) {
      router.push(callbackUrl);
    }
  }, [isInfoPanelOpen, router, callbackUrl]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/40">
      <InfoPanel isOpen={isInfoPanelOpen} setIsOpen={setIsInfoPanelOpen} />
    </div>
  );
}
