import type { User } from "next-auth";

/**
 * Checks if a user has superadmin role
 * @param user The user object to check
 * @returns boolean indicating if the user is a superadmin
 */
export function isSuperAdmin(user: User): boolean {
  return user.role === "SUPERADMIN";
}

/**
 * Gets the appropriate company filter based on user role
 * @param user The user object to determine filtering for
 * @returns An object with company filter or empty object for superadmins
 */
export function getCompanyFilter(user: User) {
  // no company filter - see all data (superadmins)
  if (isSuperAdmin(user)) {
    return {};
  }

  // filter by their company (admins)
  return {
    companyId: user.company?.id,
  };
}
