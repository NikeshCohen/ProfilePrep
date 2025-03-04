interface SpinnerProps {
  progress?: number;
}

export function Spinner({ progress }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
      {typeof progress === "number" && (
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
