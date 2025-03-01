import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import UserList from "./_components/UserList";
import NewUser from "./_components/UserManipulations";

export const metadata: Metadata = {
  title: "App / Users",
};

async function page() {
  const { user } = await requireAuth("/app/users");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <section className="layout min-h-[93vh] pt-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wider">
          User Management For{" "}
          {(user.role === "SUPERADMIN" && "All Companies") ||
            user.company?.name}
        </h1>
        <NewUser sessionUser={user} />
      </div>
      <UserList sessionUser={user} />
    </section>
  );
}

export default page;
