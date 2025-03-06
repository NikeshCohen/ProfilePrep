import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <Header />
      <section className="layout">{children}</section>
      <Footer />
    </ErrorBoundary>
  );
}

export default layout;
