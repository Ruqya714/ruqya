export default function SlotsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-36 bg-gray-200 rounded-lg" />
        <div className="h-9 w-32 bg-primary/20 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5">
            <div className="h-5 w-28 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-36 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
