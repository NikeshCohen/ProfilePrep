import type { Metadata } from "next";

import GeneratedDocsList from "@/app/app/cvs/_components/DocList";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs");

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Previously Generated Documents
        </h1>
        <GeneratedDocsList userId={user.id!} />
      </div>
    </DashboardLayout>
  );
}

export default page;
