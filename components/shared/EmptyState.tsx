"use client";

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-12 text-center text-muted-foreground ${className}`}>
      <Icon className="mx-auto mb-4 h-16 w-16 opacity-50" />
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="mb-4 text-sm">{description}</p>
      {action && (
        <Button asChild={!!action.href} onClick={action.onClick}>
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
