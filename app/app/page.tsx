import React from "react";

import { Metadata } from "next";
import Link from "next/link";

import { requireAuth } from "@/lib/utils";

import GenerateContent from "./_components/GenerateContent";

export const metadata: Metadata = {
  title: "App",
};

async function page() {
  await requireAuth("/app");

  return (
    <>
      <Link href="/app/cvs">Cvs</Link>
      <GenerateContent />
    </>
  );
}

export default page;
