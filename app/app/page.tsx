import { redirect } from "next/navigation";

import { ErrorBoundary } from "react-error-boundary";

import FallBack from "@/components/global/Fallback";

import getSession from "@/lib/getSession";

import PageContent from "./_components/PageContent";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectUrl=/app");
  }

  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <PageContent />
    </ErrorBoundary>
  );
}
