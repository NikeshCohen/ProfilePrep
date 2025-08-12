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
 * Checks if a user has admin role (admin or superadmin)
 * @param user The user object to check
 * @returns boolean indicating if the user is an admin
 */
export function isAdmin(user: User): boolean {
  return user.role === "ADMIN" || user.role === "SUPERADMIN";
}

/**
 * Checks if a user is a candidate admin (admin/superadmin with CANDIDATE userType)
 * @param user The user object to check
 * @returns boolean indicating if the user is a candidate admin
 */
export function isCandidateAdmin(user: User): boolean {
  return isAdmin(user) && user.userType === "CANDIDATE";
}

/**
 * Checks if a user is a recruiter admin (admin/superadmin with RECRUITER userType)
 * @param user The user object to check
 * @returns boolean indicating if the user is a recruiter admin
 */
export function isRecruiterAdmin(user: User): boolean {
  return isAdmin(user) && user.userType === "RECRUITER";
}

/**
 * Gets the appropriate company filter based on user role and type
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

/**
 * Gets the appropriate user filter based on user role and type
 * @param user The user object to determine filtering for
 * @returns An object with user filter constraints
 */
export function getUserFilter(user: User) {
  // superadmins see everything
  if (isSuperAdmin(user)) {
    return {};
  }

  // admins see users in their company with the same userType
  if (isAdmin(user)) {
    return {
      companyId: user.company?.id,
      userType: user.userType,
    };
  }

  // regular users see only themselves
  return {
    id: user.id,
  };
}
