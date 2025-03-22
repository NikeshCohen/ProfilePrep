import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CompanyList from "@/app/app/companies/_components/CompanyList";
import CreateCompany from "@/app/app/companies/_components/CompanyManipulations";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Companies",
};

async function page() {
  const { user } = await requireAuth("/app/companies");

  if (user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Company Management
          </h1>
          <CreateCompany sessionUser={user} />
        </div>
        <CompanyList sessionUser={user} />
      </div>
    </DashboardLayout>
  );
}

export default page;
