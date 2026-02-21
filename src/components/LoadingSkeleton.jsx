export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8" role="status" aria-label="Analyse en cours">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-4" />
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Analyse en cours...
        </p>
      </div>
    </div>
  );
}
