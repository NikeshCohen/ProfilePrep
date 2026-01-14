import { Metadata } from "next";

import RecruiterDocumentsClient from "@/app/recruiter/documents/_components/RecruiterDocumentsClient";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documents | Recruiter Dashboard",
  description: "View and manage your generated CV documents",
};

export default async function RecruiterDocuments() {
  const { user } = await requireAuth("/recruiter/documents");

  return <RecruiterDocumentsClient user={user} />;
}
