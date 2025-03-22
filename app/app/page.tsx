import type { Metadata } from "next";

import GenerateContent from "@/app/app/_components/GenerateContent";

import { requireAuth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "App",
};

async function page() {
  // NOTE: auth.js v5 removed database functionality and support from next-auth in the middleware
  const { user } = await requireAuth("/dashboard");

  // NOTE: rely on checks like the one below to ensure routes are protected effectively
  return <>{user.role === "USER" && <GenerateContent />}</>;
}

export default page;
