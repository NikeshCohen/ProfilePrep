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

  // Only SuperAdmins can access this page - company admins should use their specific routes
  if (user.role !== "SUPERADMIN") {
    // Redirect company admins to their specific template management pages
    if (user.role === "ADMIN") {
      if (user.userType === "RECRUITER") {
        redirect("/recruiter/templates");
      }
    }
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Global Template Management
        </h1>

        <CreateTemplate sessionUser={user} />
      </div>
      <TemplateList sessionUser={user} />
    </div>
  );
}

export default page;
