import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import GoogleButton from "@/app/login/_components/GoogleButton";
import LinkedInButton from "@/app/login/_components/LinkedInButton";
import { siteConfig } from "@/constants/webcontent";

import Logo from "@/components/global/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import getSession from "@/lib/getSession";

export const metadata: Metadata = {
  title: "Login",
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
        <Card className="relative overflow-hidden border-t-4 border-t-primary bg-card/40 backdrop-blur-sm transition-all duration-300">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />

          <CardHeader className="relative space-y-4 pt-8">
            <CardTitle className="text-center">
              <Logo size="2xl" circleSize={14} />
            </CardTitle>
            <CardDescription className="text-center text-base">
              Connect your account to login
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6 pb-8 pt-2">
            <div className="space-y-4">
              <GoogleButton redirectUrl={redirectUrl ?? "/app"} />
              <LinkedInButton redirectUrl={redirectUrl ?? "/app"} />
            </div>
            {/* <div className="flex items-center gap-3 px-2">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">
                Welcome, Profile<span className="text-primary">Prep</span>
              </span>
              <Separator className="flex-1" />
            </div> */}

            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link
                  href="/tos#terms-of-service"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/tos#privacy-policy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="pointer-events-auto flex justify-center border-t bg-muted/20 pb-6 pt-4">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                href={`mailto:${siteConfig.supportEmail}`}
                className="cursor-pointer text-primary hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
