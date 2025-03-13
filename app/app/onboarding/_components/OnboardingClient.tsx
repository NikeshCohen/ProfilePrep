"use client";

import { useState } from "react";

import { InfoPanel } from "@/components/global/InfoPanel";

export function OnboardingClient() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

  return <InfoPanel isOpen={isInfoPanelOpen} setIsOpen={setIsInfoPanelOpen} />;
}
