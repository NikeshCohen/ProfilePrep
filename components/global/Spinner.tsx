interface SpinnerProps {
  progress?: number;
}

export function Spinner({ progress }: SpinnerProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      {typeof progress === "number" && (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-48 h-2 overflow-hidden">
            <div
              className="bg-blue-500 rounded-full h-full transition-all duration-300 ease-in-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
