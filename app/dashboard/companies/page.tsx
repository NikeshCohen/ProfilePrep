import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CompanyList from "@/app/dashboard/companies/_components/CompanyList";
import CreateCompany from "@/app/dashboard/companies/_components/CompanyManipulations";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Companies",
};

async function page() {
  const { user } = await requireAuth("/dashboard/companies");

  if (user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Company Management
        </h1>
        <CreateCompany sessionUser={user} />
      </div>
      <CompanyList sessionUser={user} />
    </div>
  );
}

export default page;
