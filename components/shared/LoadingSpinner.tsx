"use client";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex min-h-[400px] items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
