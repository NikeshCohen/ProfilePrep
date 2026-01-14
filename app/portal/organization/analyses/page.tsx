import { Metadata } from "next";

import AllCVAnalysesClient from "@/app/portal/organization/analyses/_components/AllCVAnalysesClient";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All CV Analyses | Organization Dashboard",
  description: "View and manage all CV analyses from your organization members",
};

export default async function AllCVAnalysesPage() {
  const { user } = await requireAuth("/portal/organization/analyses");

  return <AllCVAnalysesClient user={user} />;
}
