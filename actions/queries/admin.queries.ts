"use client";

import { fetchAllUsers, getAllUserDocs } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

import { fetchAllCompanies } from "../admin.actions";

export const useUsersQuery = (sessionUser: User) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchAllUsers(sessionUser),
  });
};

export const useCompaniesQuery = (sessionUser: User, options = {}) => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchAllCompanies(sessionUser),
    ...options,
  });
};

export const useAdminDocsQuery = (user: User) => {
  return useQuery({
    queryKey: ["userDocs", user.id],
    queryFn: () => getAllUserDocs(user),
  });
};
