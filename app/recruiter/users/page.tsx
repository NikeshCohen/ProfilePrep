import type { Metadata } from "next";
import { redirect } from "next/navigation";

import UserList from "@/app/dashboard/users/_components/UserList";
import NewUser from "@/app/dashboard/users/_components/UserManipulations";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Team Management | Recruiter Dashboard",
  description: "Manage your company's recruiter team members",
};

async function RecruiterUsersPage() {
  const { user } = await requireAuth("/recruiter/users");

  // Only allow recruiter admins (not candidates or superadmins)
  if (user.role !== "ADMIN" || user.userType !== "RECRUITER") {
    redirect("/recruiter");
  }

  // Ensure they have a company
  if (!user.company?.id) {
    redirect("/recruiter");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage recruiters in {user.company.name}
          </p>
        </div>
        <NewUser sessionUser={user} />
      </div>
      <UserList sessionUser={user} />
    </div>
  );
}

export default RecruiterUsersPage;
