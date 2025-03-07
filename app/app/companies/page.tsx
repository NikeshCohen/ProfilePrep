import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import CreateCompany from "./_components/CreateCompany";

export const metadata: Metadata = {
  title: "Users",
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
          <CreateCompany />
        </div>
      </div>
    </section>
  );
}

export default page;
