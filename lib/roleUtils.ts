import type { User } from "next-auth";

/**
 * Checks if an object has superadmin role
 * @param obj The object to check (User or any object with role)
 * @returns boolean indicating if the object is a superadmin
 */
export function isSuperAdmin(obj: { role?: string }): boolean {
  return obj.role === "SUPERADMIN";
}

/**
 * Checks if an object has admin role (admin or superadmin)
 * @param obj The object to check (User or any object with role)
 * @returns boolean indicating if the object is an admin
 */
export function isAdmin(obj: { role?: string }): boolean {
  return obj.role === "ADMIN" || obj.role === "SUPERADMIN";
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

/**
 * Checks if a user has a valid company association
 * @param user The user object to check
 * @returns boolean indicating if the user has a company
 */
export function hasCompanyAccess(user: User): boolean {
  return Boolean(user.company?.id);
}

/**
 * Checks if a user can access a resource belonging to a specific company
 * Superadmins can access any company's resources, others only their own
 * @param user The user performing the action
 * @param resourceCompanyId The company ID of the resource being accessed
 * @returns boolean indicating if access is allowed
 */
export function canAccessCompanyResource(user: User, resourceCompanyId: string | null | undefined): boolean {
  if (!resourceCompanyId) {
    return false;
  }
  
  if (isSuperAdmin(user)) {
    return true;
  }
  
  return user.company?.id === resourceCompanyId;
}

/**
 * Checks if an object has candidate userType
 * @param obj The object to check (User or any object with userType)
 * @returns boolean indicating if the object is a candidate
 */
export function isCandidate(obj: { userType?: string }): boolean {
  return obj.userType === "CANDIDATE";
}

/**
 * Checks if an object has recruiter userType
 * @param obj The object to check (User or any object with userType)
 * @returns boolean indicating if the object is a recruiter
 */
export function isRecruiter(obj: { userType?: string }): boolean {
  return obj.userType === "RECRUITER";
}

/**
 * Checks if an object has tester userType
 * @param obj The object to check (User or any object with userType)
 * @returns boolean indicating if the object is a tester
 */
export function isTester(obj: { userType?: string }): boolean {
  return obj.userType === "TESTER";
}

/**
 * Checks if a user should show onboarding (not a tester and hasn't completed onboarding)
 * @param user The user object to check  
 * @returns boolean indicating if onboarding should be shown
 */
export function shouldShowOnboarding(user: { userType?: string; onboardingCompleted?: boolean; isTestAccount?: boolean }): boolean {
  return !isTester(user) && !user.onboardingCompleted && !user.isTestAccount;
}

/**
 * Checks if an object has user role
 * @param obj The object to check (User or any object with role)
 * @returns boolean indicating if the object has user role
 */
export function isUser(obj: { role?: string }): boolean {
  return obj.role === "USER";
}
