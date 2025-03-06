"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

import { clearSessionCache } from "@/lib/getSession";

export async function googleAuthentication(redirectUrl: string) {
  try {
    await signIn("google", {
      redirectTo: redirectUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Google Login Error";
    }
    throw error;
  }
}

export async function handleLogout() {
  clearSessionCache();
  await signOut({ redirect: false });
}
