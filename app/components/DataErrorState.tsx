interface DataErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function DataErrorState({
  message = "Failed to load data from the server.",
  onRetry,
}: DataErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg p-8 text-center my-6">
      <div className="max-w-md space-y-3">
        <h3 className="text-base font-semibold text-red-800">Unable to load data</h3>
        <p className="text-sm text-red-600">{message}</p>
        <div className="pt-2">
          <button
            onClick={onRetry}
            type="button"
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again / Retry
          </button>
        </div>
      </div>
    </div>
  );
}
