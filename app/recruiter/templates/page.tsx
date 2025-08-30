import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";
import { isRecruiterAdmin, hasCompanyAccess } from "@/lib/roleUtils";

export const metadata: Metadata = {
  title: "Templates | Recruiter Dashboard",
  description: "Manage your company's CV templates and formatting options",
};

async function RecruiterTemplatesPage() {
  const { user } = await requireAuth("/recruiter/templates");

  // Only allow recruiter admins (not candidates or superadmins)
  if (!isRecruiterAdmin(user)) {
    redirect("/recruiter");
  }

  // Ensure they have a company
  if (!hasCompanyAccess(user)) {
    redirect("/recruiter");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Template Management
          </h1>
          <p className="text-muted-foreground">
            Manage CV templates for {user.company?.name}
          </p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Create Template
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Template content will be implemented later */}
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Modern Professional</h3>
          <p className="text-sm text-muted-foreground">
            Clean, ATS-friendly design for corporate roles
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded border px-3 py-1 text-sm">Edit</button>
            <button className="rounded border px-3 py-1 text-sm">
              Preview
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Creative Portfolio</h3>
          <p className="text-sm text-muted-foreground">
            Designed for creative and design positions
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded border px-3 py-1 text-sm">Edit</button>
            <button className="rounded border px-3 py-1 text-sm">
              Preview
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Executive Level</h3>
          <p className="text-sm text-muted-foreground">
            Premium format for senior and executive roles
          </p>
          <div className="mt-4 flex gap-2">
            <button className="rounded border px-3 py-1 text-sm">Edit</button>
            <button className="rounded border px-3 py-1 text-sm">
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterTemplatesPage;
