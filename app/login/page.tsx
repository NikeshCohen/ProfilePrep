import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import getSession from "@/lib/getSession";

export const metadata: Metadata = {
  title: "Login | ProfilePrep",
  description: "Sign in to your ProfilePrep account",
};

interface PageProps {
  searchParams: Promise<{ redirectUrl?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getSession();
  const params = await searchParams; // Need to await dynamic APIs in Next.js 15
  const redirectUrl = params.redirectUrl;

  if (session) redirect("/app");

  return (
    <section className="flex min-h-[93vh] w-full items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <Card className="relative overflow-hidden border-t-4 border-t-primary bg-background/40 backdrop-blur-sm transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />

          <CardHeader className="relative space-y-4 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CardTitle className="text-center">
                <h1 className="text-2xl font-bold tracking-wider">
                  Profile<span className="text-primary">Prep</span>
                </h1>
              </CardTitle>
            </div>
            <CardDescription className="text-center text-base">
              Connect your account to login
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6 pb-8 pt-2">
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
                  alt="Google logo"
                  className="transition-transform group-hover:scale-110"
                />
                <span className="font-medium">Continue with Google</span>
              </Button>
            </form>

            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t bg-muted/20 pb-6 pt-4">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="#" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
