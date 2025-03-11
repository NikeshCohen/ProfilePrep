import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import CompanyList from "@/app/app/companies/_components/CompanyList";
import CreateCompany from "@/app/app/companies/_components/CompanyManipulations";

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
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          Company Management
        </h1>

        <div>
          <CreateCompany sessionUser={user} />
        </div>
      </div>

      <CompanyList sessionUser={user} />
    </section>
  );
}

export default page;
