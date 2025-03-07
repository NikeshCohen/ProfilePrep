import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import CompanyList from "./_components/CompanyList";
import CreateCompany from "./_components/CompanyManipulations";

export const metadata: Metadata = {
  title: "Companies",
};

async function page() {
  const { user } = await requireAuth("/app/companies");

  if (user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <section className="pt-32 min-h-[93vh] layout">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl tracking-wider">
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
