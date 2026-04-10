export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-40 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-4 w-28 bg-gray-100 rounded-lg hidden sm:block" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="w-10 h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
