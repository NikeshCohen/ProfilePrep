import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import UserList from "@/app/app/users/_components/UserList";
import NewUser from "@/app/app/users/_components/UserManipulations";

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
    <section className="layout min-h-[93vh] pt-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          User Management For{" "}
          {(user.role === "SUPERADMIN" && "All Companies") ||
            user.company?.name}
        </h1>

        <div>
          <NewUser sessionUser={user} />
        </div>
      </div>
      <UserList sessionUser={user} />
    </section>
  );
}

export default page;
