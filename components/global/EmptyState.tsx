import type { ReactNode } from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmptyStateProps {
  message: string | ReactNode;
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "destructive";
}

export function EmptyState({
  message,
  icon = <AlertCircle className="h-4 w-4" />,
  className = "border-muted bg-muted/50",
  variant = "default",
}: EmptyStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant={variant} className={className}>
        {icon}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
