import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import getSession from "@/lib/getSession";

export const metadata: Metadata = {
  title: "Login",
};

interface PageProps {
  searchParams: Promise<{ callback?: string }>;
}
export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getSession();

  const params = await searchParams; // Need to await dynamic APIs in Next.js 15

  const redirectUrl = params.callback;

  if (session) redirect("/app");

  return (
    <section className="flex h-[93vh] w-full items-center justify-center">
      <Card className="mx-auto max-w-sm bg-background/40 md:min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            <h1 className="text-xl font-bold tracking-wider">
              Profile<span className="text-primary">Prep</span>
            </h1>
          </CardTitle>
          <CardDescription className="text-center">
            Connect an account to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid">
            <form
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: redirectUrl ? redirectUrl : "/app",
                });
              }}
              className="w-full"
            >
              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-1 text-white"
              >
                <Image
                  src={"/google.svg"}
                  width={20}
                  height={20}
                  alt="google logo"
                />
                Google
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
