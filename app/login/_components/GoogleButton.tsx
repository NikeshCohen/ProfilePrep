"use client";

import React, { useActionState } from "react";

import Image from "next/image";

import { googleAuthentication } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";

function GoogleButton({ redirectUrl }: { redirectUrl: string }) {
  const [errMsgGoogle, disPatchGoogle, isLoading] = useActionState(
    () => googleAuthentication(redirectUrl),
    undefined,
  );

  return (
    <form action={disPatchGoogle}>
      <Button
        type="submit"
        className="flex w-full items-center justify-center gap-1 text-white"
        disabled={isLoading}
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

      {errMsgGoogle && <p className="mt-2 text-red-500">{errMsgGoogle}</p>}
    </form>
  );
}

export default GoogleButton;
