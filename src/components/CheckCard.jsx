const SEVERITY_CONFIG = {
  CRITIQUE: {
    icon: "🔴",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-error",
    badge: "bg-red-100 text-error",
  },
  IMPORTANT: {
    icon: "🟠",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-warning",
    badge: "bg-orange-100 text-warning",
  },
  AVERTISSEMENT: {
    icon: "🟡",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
  },
};

const PASSED_CONFIG = {
  icon: "✅",
  bg: "bg-green-50",
  border: "border-green-200",
  text: "text-success",
  badge: "bg-green-100 text-success",
};

export default function CheckCard({ check }) {
  const config = check.passed
    ? PASSED_CONFIG
    : SEVERITY_CONFIG[check.severity] || SEVERITY_CONFIG.AVERTISSEMENT;

  return (
    <article
      className={`rounded-xl border ${config.border} ${config.bg} p-4 sm:p-5 transition`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-text">{check.label}</h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}
            >
              {check.passed ? "OK" : check.severity}
            </span>
            {!check.passed && check.occurrences > 0 && (
              <span className="text-xs text-gray-400">
                {check.occurrences} occurrence{check.occurrences > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            {check.details}
          </p>
        </div>
      </div>
    </article>
  );
}
