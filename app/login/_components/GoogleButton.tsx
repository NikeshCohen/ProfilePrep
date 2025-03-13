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
        className="flex justify-center items-center gap-1 w-full text-white"
        disabled={isLoading}
      >
        <Image
          src={"/google.svg"}
          width={20}
          height={20}
          alt="Google logo"
          className="group-hover:scale-110 transition-transform"
        />
        <span className="font-medium">Continue with Google</span>
      </Button>

      {errMsgGoogle && <p className="mt-2 text-destructive">{errMsgGoogle}</p>}
    </form>
  );
}

export default GoogleButton;
