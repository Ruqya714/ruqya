export default function BookingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-36 bg-gray-200 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-100 rounded-lg" />
          <div className="h-9 w-24 bg-gray-100 rounded-lg" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded ms-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
