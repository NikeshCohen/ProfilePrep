"use client";

import { useActionState } from "react";

import Image from "next/image";

import { linkedinAuthentication } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";

function LinkedInButton({ redirectUrl }: { redirectUrl: string }) {
  const [errMsgLinkedIn, disPatchLinkedIn, isLoading] = useActionState(
    () => linkedinAuthentication(redirectUrl),
    undefined,
  );

  return (
    <form action={disPatchLinkedIn}>
      <Button
        type="submit"
        className="flex w-full items-center justify-center gap-1 text-white"
        disabled={isLoading}
      >
        <Image
          src={"/linkedIn.svg"}
          width={20}
          height={20}
          alt="LinkedIn logo"
          className="transition-transform group-hover:scale-110"
        />
        <span className="font-medium">Continue with LinkedIn</span>
      </Button>

      {errMsgLinkedIn && (
        <p className="mt-2 text-destructive">{errMsgLinkedIn}</p>
      )}
    </form>
  );
}

export default LinkedInButton;
