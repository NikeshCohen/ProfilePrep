"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export function AuthRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const { userType } = session.user;
      const currentPath = window.location.pathname;

      // Don't redirect if we're already in the correct section
      if (userType === "CANDIDATE" && currentPath.startsWith("/portal")) {
        return;
      }
      if (userType === "RECRUITER" && currentPath.startsWith("/recruiter")) {
        return;
      }
      if (userType === "TESTER") {
        // Testers can access both, so don't auto-redirect
        return;
      }

      // Only redirect from root paths
      if (
        currentPath === "/" ||
        currentPath === "/app" ||
        currentPath === "/dashboard" ||
        currentPath === "/portal"
      ) {
        if (userType === "CANDIDATE") {
          router.replace("/portal");
        } else if (userType === "RECRUITER") {
          router.replace("/recruiter");
        }
      }
    }
  }, [session, router]);

  return null;
}
