"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const UserLinks = ({ role }: { role: string }) => {
  const pathname = usePathname();

  // candidate-specific links
  if (role === "CANDIDATE") {
    return (
      <>
        <li>
          <Link
            href="/app/candidate"
            className={`nav-link ${
              pathname === "/app/candidate" ? "active" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/app/jobs"
            className={`nav-link ${
              pathname.startsWith("/app/jobs") ? "active" : ""
            }`}
          >
            Jobs
          </Link>
        </li>
      </>
    );
  }

  // recruiter and admin links
  return (
    <>
      <li>
        <Link
          href="/app"
          className={`nav-link ${pathname === "/app" ? "active" : ""}`}
        >
          Generate
        </Link>
      </li>
      <li>
        <Link
          href="/app/cvs"
          className={`nav-link ${pathname === "/app/cvs" ? "active" : ""}`}
        >
          CVs
        </Link>
      </li>
      <li>
        <Link
          href="/app/templates"
          className={`nav-link ${
            pathname === "/app/templates" ? "active" : ""
          }`}
        >
          Templates
        </Link>
      </li>
      {/* job management link for recruiters */}
      <li>
        <Link
          href="/app/jobs"
          className={`nav-link ${
            pathname.startsWith("/app/jobs") ? "active" : ""
          }`}
        >
          Jobs
        </Link>
      </li>
      {(role === "ADMIN" || role === "SUPERADMIN") && (
        <>
          <li>
            <Link
              href="/app/users"
              className={`nav-link ${
                pathname === "/app/users" ? "active" : ""
              }`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/app/companies"
              className={`nav-link ${
                pathname === "/app/companies" ? "active" : ""
              }`}
            >
              Companies
            </Link>
          </li>
          <li>
            <Link
              href="/app/cvs/all"
              className={`nav-link ${
                pathname === "/app/cvs/all" ? "active" : ""
              }`}
            >
              All CVs
            </Link>
          </li>
        </>
      )}
    </>
  );
};
