import React from "react";

import { Metadata } from "next";

import GeneratedDocsList from "@/app/app/cvs/_components/DocList";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs");

  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          Previously Generated Documents
        </h1>
      </div>

      <GeneratedDocsList userId={user.id!} />
    </section>
  );
}

export default page;
