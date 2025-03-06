import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import CreateCompany from "./_components/CreateCompany";
import UserList from "./_components/UserList";
import NewUser from "./_components/UserManipulations";

export const metadata: Metadata = {
  title: "Users",
};

async function page() {
  const { user } = await requireAuth("/app/users");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <section className="pt-32 min-h-[93vh] layout">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl tracking-wider">
          User Management For{" "}
          {(user.role === "SUPERADMIN" && "All Companies") ||
            user.company?.name}
        </h1>

        <div className="flex items-center gap-4">
          {user.role === "SUPERADMIN" && <CreateCompany />}
          <NewUser sessionUser={user} />
        </div>
      </div>
      <UserList sessionUser={user} />
    </section>
  );
}

export default page;
