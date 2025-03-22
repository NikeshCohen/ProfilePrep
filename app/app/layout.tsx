import type React from "react";

import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

async function layout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={FallBack}>{children}</ErrorBoundary>;
}

export default layout;
