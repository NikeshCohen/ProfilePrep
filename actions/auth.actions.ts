"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function googleAuthentication(redirectUrl: string) {
  console.log(redirectUrl);

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
