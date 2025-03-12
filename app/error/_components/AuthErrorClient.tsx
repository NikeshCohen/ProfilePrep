"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { CheckIcon } from "@/components/icons/CheckIcon";
import { CopyIcon } from "@/components/icons/CopyIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { containerVariants, itemVariants } from "@/lib/animations";

enum Error {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There is a problem with the server configuration. Check if your options
      are correct. Unique error code:{" "}
      <code className="rounded-sm bg-primary p-1 text-xs text-white">
        Configuration
      </code>
    </p>
  ),
  [Error.AccessDenied]: (
    <p>
      Access has been denied. This usually occurs when you restricted access
      through the signIn callback or redirect callback. Unique error code:{" "}
      <code className="rounded-sm bg-primary p-1 text-xs text-white">
        AccessDenied
      </code>
    </p>
  ),
  [Error.Verification]: (
    <p>
      The verification token has expired or has already been used. Please
      request a new verification email. Unique error code:{" "}
      <code className="rounded-sm bg-primary p-1 text-xs text-white">
        Verification
      </code>
    </p>
  ),
  [Error.Default]: (
    <p>
      An unexpected error occurred. Please try again later. Unique error code:{" "}
      <code className="rounded-sm bg-primary p-1 text-xs text-white">
        Default
      </code>
    </p>
  ),
};

export default function AuthErrorClient({
  initialError,
}: {
  initialError: string;
}) {
  const router = useRouter();
  const error = initialError as Error;
  const [copied, setCopied] = useState(false);
  const [clientDetails, setClientDetails] = useState<{
    url: string;
    userAgent: string;
    searchParams?: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    // Get client-side details after component mounts
    const searchParams = new URLSearchParams(window.location.search);
    setClientDetails({
      url: window.location.href,
      userAgent: window.navigator.userAgent,
      searchParams: Object.fromEntries(searchParams.entries()),
    });
  }, []);

  const copyErrorDetails = async () => {
    if (!clientDetails) return;
    const details = {
      error: error,
      timestamp: new Date().toISOString(),
      ...clientDetails,
    };
    await navigator.clipboard.writeText(JSON.stringify(details, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getErrorTitle = (error: Error) => {
    switch (error) {
      case Error.Configuration:
        return "Configuration Error";
      case Error.AccessDenied:
        return "Access Denied";
      case Error.Verification:
        return "Verification Failed";
      default:
        return "Something went wrong";
    }
  };

  return (
    <motion.div
      className="flex h-screen w-full flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="max-w-3xl">
          <CardHeader>
            <motion.h5
              variants={itemVariants}
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {getErrorTitle(error as Error)}
            </motion.h5>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="text-muted-foreground"
            >
              {errorMap[error as Error] || errorMap[Error.Default]}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Developer Information
              </div>
              <div className="rounded-md bg-foreground p-4 font-mono text-xs text-foreground text-white dark:text-black">
                <pre className="overflow-x-auto">
                  {JSON.stringify(
                    {
                      error,
                      timestamp: new Date().toISOString(),
                      ...clientDetails,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </motion.div>

            {process.env.NODE_ENV === "development" && (
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="text-sm font-medium text-foreground">
                  Debug Tips
                </div>
                <ul className="list-disc pl-4 text-sm text-muted-foreground">
                  <li>Check authentication configuration in .env</li>
                  <li>Verify API endpoints and credentials</li>
                  <li>Review server logs for more details</li>
                </ul>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={copyErrorDetails}
              className="group flex items-center gap-2"
              disabled={!clientDetails}
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  <CopyIcon className="p-0" size={16} />
                </>
              )}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => router.back()}
              className="ml-auto"
            >
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
