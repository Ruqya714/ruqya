export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-32 bg-gray-200 rounded-lg mb-6" />
      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-10 w-full bg-gray-100 rounded-lg" />
          </div>
        ))}
        <div className="h-10 w-28 bg-primary/20 rounded-lg" />
      </div>
    </div>
  );
}
