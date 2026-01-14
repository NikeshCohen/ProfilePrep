import { Metadata } from "next";

import CandidateDocumentsClient from "@/app/portal/documents/_components/CandidateDocumentsClient";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documents | Candidate Dashboard",
  description: "View and manage your generated CV documents",
};

export default async function CandidateDocuments() {
  const { user } = await requireAuth("/portal/documents");

  return <CandidateDocumentsClient user={user} />;
}
