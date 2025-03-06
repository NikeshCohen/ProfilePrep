import React from "react";

import { Metadata } from "next";

import { requireAuth } from "@/lib/utils";

import GeneratedDocsList from "./_components/DocList";

export const metadata: Metadata = {
  title: "CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs");

  return (
    <section className="layout min-h-[93vh] pt-16">
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
