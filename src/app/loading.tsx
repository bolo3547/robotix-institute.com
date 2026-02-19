export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Logo mark */}
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20 animate-pulse">
          🤖
        </div>

        {/* Loading bar — indeterminate */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/3 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-shimmer" />
        </div>

        <p className="mt-4 text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
