import { useState } from "react";
import AuditForm from "./components/AuditForm";
import LoadingSkeleton from "./components/LoadingSkeleton";
import AuditReport from "./components/AuditReport";
import { analyzeHTML, calculateScore } from "./utils/analyzer";

export default function App() {
  const [state, setState] = useState("form"); // form | loading | report | error
  const [auditParams, setAuditParams] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit({ url, sourceLang, targetLang }) {
    setState("loading");
    setError("");
    setAuditParams({ url, sourceLang, targetLang });

    try {
      const fetchUrl = `/.netlify/functions/fetch-page?url=${encodeURIComponent(url)}`;
      const response = await fetch(fetchUrl);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setState("error");
        return;
      }

      const { checks, isSPA, wordCount } = analyzeHTML(
        data.html,
        sourceLang,
        targetLang
      );
      const score = calculateScore(checks);

      setReport({ score, checks, isSPA, wordCount, finalUrl: data.finalUrl });
      setState("report");
    } catch (err) {
      setError(
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."
      );
      setState("error");
    }
  }

  function handleReset() {
    setState("form");
    setReport(null);
    setError("");
    setAuditParams(null);
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🌐</span>
            <h1 className="text-xl font-bold text-gray-text">Localizator</h1>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">
            Audit de localisation
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {(state === "form" || state === "error") && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-text mb-2">
              Analysez la localisation de votre page
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Collez une URL, sélectionnez les langues, et recevez un rapport
              détaillé avec un score et des recommandations.
            </p>
          </div>
        )}

        {(state === "form" || state === "error") && (
          <>
            <AuditForm onSubmit={handleSubmit} isLoading={false} />
            {state === "error" && (
              <div
                role="alert"
                className="max-w-2xl mx-auto mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-error text-sm"
              >
                {error}
              </div>
            )}
          </>
        )}

        {state === "loading" && (
          <>
            <AuditForm onSubmit={handleSubmit} isLoading={true} />
            <LoadingSkeleton />
          </>
        )}

        {state === "report" && auditParams && report && (
          <AuditReport
            score={report.score}
            checks={report.checks}
            isSPA={report.isSPA}
            url={auditParams.url}
            sourceLang={auditParams.sourceLang}
            targetLang={auditParams.targetLang}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
          Localizator &mdash; Outil d'audit de localisation
        </div>
      </footer>
    </div>
  );
}
