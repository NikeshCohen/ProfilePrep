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
    <section className="pt-32 min-h-[93vh] layout">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl tracking-wider">
          Previously Generated Documents
        </h1>
      </div>

      <GeneratedDocsList userId={user.id!} />
    </section>
  );
}

export default page;
