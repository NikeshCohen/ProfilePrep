import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CreateTemplate from "@/app/app/templates/_components/CreateTemplate";
import TemplateList from "@/app/app/templates/_components/TemplateList";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Templates",
};

async function page() {
  const { user } = await requireAuth("/app/templates");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <DashboardLayout user={user}>
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
    </DashboardLayout>
  );
}

export default page;
