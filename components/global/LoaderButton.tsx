import React from "react";

import { LucideIcon } from "lucide-react";

import { Button, ButtonProps } from "../ui/button";

type LoaderButtonProps = ButtonProps & {
  isLoading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export const LoaderButton = React.forwardRef<
  HTMLButtonElement,
  LoaderButtonProps
>(({ isLoading, icon: Icon, children, className }, ref) => {
  if (isLoading) {
    return (
      <Button ref={ref} disabled={isLoading} className={className}>
        {children}
        <LoaderIcon className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button ref={ref} disabled={isLoading} className={className}>
      {Icon ? (
        <>
          {children}
          {/* <Icon size={18} className="mr-3" /> */}
        </>
      ) : (
        children
      )}
    </Button>
  );
});

LoaderButton.displayName = "LoaderButton";

export function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
