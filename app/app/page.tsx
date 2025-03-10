import React from "react";

import { Metadata } from "next";

import GenerateContent from "@/app/app/_components/GenerateContent";

import { requireAuth } from "@/lib/utils";

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
