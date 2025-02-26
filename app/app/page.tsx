import React from "react";

import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";

import GenerateContent from "./_components/GenerateContent";

async function page() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectUrl=/app");
  }

  return (
    <>
      <GenerateContent />
    </>
  );
}

export default page;
