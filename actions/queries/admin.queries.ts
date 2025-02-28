"use client";

import { fetchAllUsers } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";

export const useUsersQuery = (sessionUser: User) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchAllUsers(sessionUser),
  });
};
