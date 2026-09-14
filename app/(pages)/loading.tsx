// to be shown in the internal main page when loading 

export default function PageLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <div className="w-[15%] rounded h-4 mb-3 bg-gray-300 animate-pulse" />
      <div className="w-[35%] rounded h-12 mb-5 bg-gray-300 animate-pulse" />
      <div className="w-[25%] rounded h-3 mt-3 mb-3 bg-gray-300 animate-pulse" />

      <div className="w-full mt-12 rounded h-12 mb-5 bg-gray-300 animate-pulse" />
    </div>
  );
}
