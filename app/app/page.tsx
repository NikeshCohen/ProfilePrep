import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import PageContent from "./_components/PageContent";

export default function Page() {
  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <PageContent />
    </ErrorBoundary>
  );
}
