import React from "react";

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/utils";

import UserList from "./_components/UserList";

export const metadata: Metadata = {
  title: "App / Users",
};

async function page() {
  const { user } = await requireAuth("/app/users");

  if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    redirect("/app");
  }

  return (
    <section className="pt-16 min-h-[93vh] layout">
      <h1 className="mb-8 font-bold text-2xl tracking-wider">
        User Management For {user.company?.name || "All Companies"}
      </h1>

      <UserList sessionUser={user} />
    </section>
  );
}

export default page;
