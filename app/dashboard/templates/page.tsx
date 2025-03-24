import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CreateTemplate from "@/app/dashboard/templates/_components/CreateTemplate";
import TemplateList from "@/app/dashboard/templates/_components/TemplateList";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Templates",
};

async function page() {
  const { user } = await requireAuth("/dashboard/templates");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {" "}
          Templates (
          {(user.role === "SUPERADMIN" && "All Companies") ||
            user.company?.name}
          )
        </h1>

        <CreateTemplate sessionUser={user} />
      </div>
      <TemplateList sessionUser={user} />
    </div>
  );
}

export default page;
