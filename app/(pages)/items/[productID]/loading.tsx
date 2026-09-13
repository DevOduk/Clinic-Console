export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14 animate-pulse">
      <header className="mb-8 flex items-end flex-col md:flex-row gap-3 justify-between">
        <div className="w-full space-y-3">
          <div className="h-4 w-44 bg-gray-200 rounded" />
          <div className="h-10 w-72 bg-gray-200 rounded" />
          <div className="h-4 w-80 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded shrink-0" />
      </header>

      <div className="h-4 w-32 bg-gray-200 rounded mb-3" />

      <div className="flex gap-3 items-center mt-3">
        <div className="h-4 w-10 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="h-6 w-14 bg-gray-200 rounded-full" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-100 w-full bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-6 w-1/4 bg-gray-200 rounded" />
          <div className="h-24 w-full bg-gray-200 rounded" />
          <div className="h-10 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
