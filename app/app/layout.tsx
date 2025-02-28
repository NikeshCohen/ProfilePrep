import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <section className="layout">{children}</section>
    </ErrorBoundary>
  );
}

export default layout;
