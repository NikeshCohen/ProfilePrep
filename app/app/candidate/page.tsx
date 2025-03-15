import { Metadata } from "next";
import { redirect } from "next/navigation";

import CandidateDashboard from "@/app/app/candidate/_components/CandidateDashboard";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Candidate Dashboard",
};

export default async function CandidatePage() {
  const { user } = await requireAuth("/app/candidate");

  // Redirect if not a candidate
  if (user.role !== "CANDIDATE" && user.role !== "USER") {
    redirect("/app");
  }

  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wider">
          Candidate Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile and job applications
        </p>
      </div>

      <CandidateDashboard userId={user.id!} />
    </section>
  );
}
