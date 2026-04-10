export default function HealersLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-36 bg-gray-200 rounded-lg" />
        <div className="h-9 w-32 bg-primary/20 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div>
                <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
