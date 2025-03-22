import type { Metadata } from "next";
import { redirect } from "next/navigation";

import GeneratedDocsList from "@/app/app/cvs/all/_components/DocList";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs/all");

  if (user.role !== "SUPERADMIN") {
    redirect("/app/cvs");
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          All Generated Documents
        </h1>
        <GeneratedDocsList sessionUser={user} />
      </div>
    </DashboardLayout>
  );
}

export default page;
