import { redirect } from "next/navigation";

import { SessionProvider } from "@/providers/SessionProvider";
import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import getSession from "@/lib/getSession";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectUrl=/app");
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <SessionProvider session={session}>
        <section className="layout">{children}</section>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default layout;
