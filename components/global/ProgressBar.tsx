import React from "react";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showText?: boolean;
  description?: React.ReactNode;
}

export function ProgressBar({
  current,
  total,
  className,
  showText = false,
  description,
}: ProgressBarProps) {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="space-y-2">
      {showText && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {current} / {total}
          </span>
        </div>
      )}
      <div className={cn("h-2 rounded-full bg-muted", className)}>
        <div
          className="progress-bar-fill h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
