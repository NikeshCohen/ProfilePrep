"use client";

import { fetchAllUsers } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

import { fetchAllCompanies } from "../admin.actions";

export const useUsersQuery = (sessionUser: User) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchAllUsers(sessionUser),
  });
};

export const useCompaniesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchAllCompanies,
    ...options,
  });
};
