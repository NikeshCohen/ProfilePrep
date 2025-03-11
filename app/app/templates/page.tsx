import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import TemplateList from "@/app/app/templates/_components/TemplateList";

export const metadata: Metadata = {
  title: "Users",
};

async function page() {
  const { user } = await requireAuth("/app/templates");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          Templates For{" "}
          {(user.role === "SUPERADMIN" && "All Companies") ||
            user.company?.name}
        </h1>

        <div></div>
      </div>

      <TemplateList sessionUser={user} />
    </section>
  );
}

export default page;
