"use client";

import { Card, CardContent } from "@/components/ui/card";

interface AccessDeniedCardProps {
  title?: string;
  message?: string;
  className?: string;
}

export default function AccessDeniedCard({
  title = "Access Denied",
  message = "You do not have permission to access this resource.",
  className = "",
}: AccessDeniedCardProps) {
  return (
    <div
      className={`flex min-h-[400px] items-center justify-center ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
