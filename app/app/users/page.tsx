import type { Metadata } from "next";
import { redirect } from "next/navigation";

import UserList from "@/app/app/users/_components/UserList";
import NewUser from "@/app/app/users/_components/UserManipulations";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Users",
};

async function page() {
  const { user } = await requireAuth("/app/users");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            User Management (
            {(user.role === "SUPERADMIN" && "All Companies") ||
              user.company?.name}
            )
          </h1>
          <NewUser sessionUser={user} />
        </div>
        <UserList sessionUser={user} />
      </div>
    </DashboardLayout>
  );
}

export default page;
