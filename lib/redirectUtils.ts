import { redirect } from "next/navigation";

import { getUserWithCompany } from "@/actions/user.actions";

/**
 * Redirects user to appropriate dashboard based on their user type
 */
export async function redirectToDashboard(userId: string) {
  const { success, user } = await getUserWithCompany(userId);

  if (!success || !user) {
    redirect("/login");
    return;
  }

  // Route based on user type and role
  if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
    redirect("/dashboard"); // Admin dashboard for all admins
    return;
  }

  switch (user.userType) {
    case "CANDIDATE":
      redirect("/portal"); // Candidate dashboard
      return;
    case "RECRUITER":
      redirect("/recruiter"); // Recruiter dashboard
      return;
    case "TESTER":
      redirect("/app"); // Test accounts can access main app
      return;
    default:
      redirect("/app/onboarding"); // Need to select user type
      return;
  }
}

/**
 * Gets the appropriate dashboard route for a user without redirecting
 */
export async function getDashboardRoute(userId: string): Promise<string> {
  const { success, user } = await getUserWithCompany(userId);

  if (!success || !user) {
    return "/login";
  }

  // Route based on user type and role
  if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
    return "/dashboard"; // Admin dashboard for all admins
  } else {
    switch (user.userType) {
      case "CANDIDATE":
        return "/portal"; // Candidate dashboard
      case "RECRUITER":
        return "/recruiter"; // Recruiter dashboard
      case "TESTER":
        return "/app"; // Test accounts can access main app
      default:
        return "/app/onboarding";
    }
  }
}
