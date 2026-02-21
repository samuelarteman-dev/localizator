import { useRef } from "react";
import ScoreBadge from "./ScoreBadge";
import CheckCard from "./CheckCard";

export default function AuditReport({
  score,
  checks,
  isSPA,
  url,
  sourceLang,
  targetLang,
  onReset,
}) {
  const reportRef = useRef(null);

  async function handleExportPDF() {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = reportRef.current;
    if (!element) return;

    const domain = new URL(url).hostname.replace(/^www\./, "");
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `audit-${domain}-${date}.pdf`;

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div
        ref={reportRef}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8"
      >
        <header className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-text mb-1">
            Rapport d'audit
          </h2>
          <p className="text-sm text-gray-400 break-all">{url}</p>
          <p className="text-sm text-gray-400 mt-1">
            {sourceLang} → {targetLang} &middot;{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <ScoreBadge score={score} />
        </div>

        {isSPA && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800"
          >
            Cette page semble générée dynamiquement (SPA). L'analyse porte sur
            le HTML initial uniquement et peut être incomplète.
          </div>
        )}

        <section aria-label="Résultats des checks">
          <h3 className="text-lg font-semibold text-gray-text mb-4">
            Détail des vérifications
          </h3>
          <div className="space-y-3">
            {checks.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-8">
        <button
          onClick={handleExportPDF}
          className="flex-1 py-3 px-6 rounded-lg bg-primary text-white font-semibold
                     hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary
                     focus:ring-offset-2 transition min-h-[44px] cursor-pointer"
        >
          Exporter en PDF
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 rounded-lg bg-white text-gray-text font-semibold
                     border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-primary focus:ring-offset-2 transition min-h-[44px] cursor-pointer"
        >
          Nouvel audit
        </button>
      </div>
    </div>
  );
}
