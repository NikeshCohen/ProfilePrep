import React from "react";

import { LucideIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type LoaderButtonProps = ButtonProps & {
  isLoading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export const LoaderButton = React.forwardRef<
  HTMLButtonElement,
  LoaderButtonProps
>(
  (
    { isLoading, icon: Icon, children, className, variant, size, ...props },
    ref,
  ) => {
    if (isLoading) {
      return (
        <Button
          ref={ref}
          disabled={isLoading}
          className={cn("cursor-not-allowed", className)}
          variant={variant}
          size={size}
          {...props}
        >
          {children}
          <LoaderIcon className="ml-2 w-4 h-4 animate-spin" />
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        disabled={isLoading}
        className={className}
        variant={variant}
        size={size}
        {...props}
      >
        {Icon && <Icon className="mr-2 w-4 h-4" />}
        {children}
      </Button>
    );
  },
);

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
