import type { Metadata } from "next";
import { redirect } from "next/navigation";

import UserList from "@/app/dashboard/users/_components/UserList";
import NewUser from "@/app/dashboard/users/_components/UserManipulations";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Users",
};

async function page() {
  const { user } = await requireAuth("/dashboard/users");

  // Only SuperAdmins can access this page - company admins should use their specific routes
  if (user.role !== "SUPERADMIN") {
    // Redirect company admins to their specific user management pages
    if (user.role === "ADMIN") {
      if (user.userType === "RECRUITER") {
        redirect("/recruiter/users");
      } else if (user.userType === "CANDIDATE") {
        redirect("/portal/organization/members");
      }
    }
    redirect("/app");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Global User Management
        </h1>
        <NewUser sessionUser={user} />
      </div>
      <UserList sessionUser={user} />
    </div>
  );
}

export default page;
