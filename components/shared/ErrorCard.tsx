"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ErrorCardProps {
  title?: string;
  message?: string;
  className?: string;
}

export default function ErrorCard({
  title = "Error Loading Data",
  message = "Failed to load data. Please try again.",
  className = "",
}: ErrorCardProps) {
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
