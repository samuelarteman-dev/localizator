export default function ScoreBadge({ score }) {
  let color, bgColor, ringColor, label;

  if (score >= 80) {
    color = "text-success";
    bgColor = "bg-green-50";
    ringColor = "stroke-success";
    label = "Bon";
  } else if (score >= 50) {
    color = "text-warning";
    bgColor = "bg-yellow-50";
    ringColor = "stroke-warning";
    label = "À améliorer";
  } else {
    color = "text-error";
    bgColor = "bg-red-50";
    ringColor = "stroke-error";
    label = "Critique";
  }

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-36 h-36 ${bgColor} rounded-full flex items-center justify-center`}>
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            className={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <span className={`text-4xl font-extrabold ${color} relative z-10`}>
          {score}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          {score >= 80 ? "🟢" : score >= 50 ? "🟡" : "🔴"}
        </span>
        <span className={`font-semibold text-lg ${color}`}>{label}</span>
      </div>
    </div>
  );
}
