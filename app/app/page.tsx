import React from "react";

import { Metadata } from "next";

import { requireAuth } from "@/lib/utils";

import GenerateContent from "./_components/GenerateContent";

export const metadata: Metadata = {
  title: "App",
};

async function page() {
  await requireAuth("/app");

  return (
    <>
      <GenerateContent />
    </>
  );
}

export default page;
