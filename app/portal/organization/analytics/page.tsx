import { Metadata } from "next";

import OrganizationAnalyticsClient from "@/app/portal/organization/analytics/_components/OrganizationAnalyticsClient";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Organization Analytics | Candidate Dashboard",
  description: "View analytics for your candidate organization",
};

export default async function OrganizationAnalyticsPage() {
  const { user } = await requireAuth("/portal/organization/analytics");

  return <OrganizationAnalyticsClient user={user} />;
}
