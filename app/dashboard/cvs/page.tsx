import type { Metadata } from "next";

import GeneratedDocsList from "@/app/dashboard/cvs/_components/DocList";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CVs",
};

async function page() {
  const { user } = await requireAuth("/dashboard/cvs");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        My Generated Documents
      </h1>
      <GeneratedDocsList userId={user.id!} />
    </div>
  );
}

export default page;
