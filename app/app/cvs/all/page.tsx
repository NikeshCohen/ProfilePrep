import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import GeneratedDocsList from "@/app/app/cvs/all/_components/DocList";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs/all");

  if (user.role !== "SUPERADMIN") {
    redirect("/app/cvs");
  }

  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          Previously Generated Documents
        </h1>
      </div>

      <GeneratedDocsList sessionUser={user} />
    </section>
  );
}

export default page;
