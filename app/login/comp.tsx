"use client";

import { useState } from "react";

import Image from "next/image";

import { signIn } from "@/auth";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginFormProps {
  redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", {
      redirectTo: redirectUrl ? redirectUrl : "/app",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Image
                src="/icon.png"
                width={40}
                height={40}
                alt="ProfilePrep icon"
                className="mb-4 ml-auto mr-auto"
              />
              <h1 className="text-2xl font-bold tracking-wider">
                Profile<span className="text-primary">Prep</span>
              </h1>
            </motion.div>
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Image
                    src="/google.svg"
                    width={20}
                    height={20}
                    alt="Google logo"
                    className="mr-2"
                  />
                </motion.div>
              ) : (
                <Image
                  src="/google.svg"
                  width={20}
                  height={20}
                  alt="Google logo"
                  className="mr-2"
                />
              )}
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
