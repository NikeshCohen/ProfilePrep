import type { Metadata } from "next";
import { redirect } from "next/navigation";

import GeneratedDocsList from "@/app/dashboard/cvs/all/_components/DocList";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All CVs",
};

async function page() {
  const { user } = await requireAuth("/app/cvs/all");

  if (user.role !== "SUPERADMIN") {
    redirect("/dashboard/cvs");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        All Generated Documents
      </h1>
      <GeneratedDocsList sessionUser={user} />
    </div>
  );
}

export default page;
