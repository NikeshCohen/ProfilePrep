import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";
import Footer from "@/components/global/Footer";

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <section className="layout">{children}</section>

      <Footer />
    </ErrorBoundary>
  );
}

export default layout;
