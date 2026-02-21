import { useState } from "react";

const LANGUAGES = [
  { code: "EN", label: "Anglais (EN)" },
  { code: "FR", label: "Français (FR)" },
];

export default function AuditForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState("");
  const [sourceLang, setSourceLang] = useState("EN");
  const [targetLang, setTargetLang] = useState("FR");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Veuillez entrer une URL.");
      return;
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("URL invalide. Vérifiez le format (ex: https://example.com).");
      return;
    }

    if (sourceLang === targetLang) {
      setError("La langue source et la langue cible doivent être différentes.");
      return;
    }

    onSubmit({ url: normalizedUrl, sourceLang, targetLang });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-6">
          <label
            htmlFor="url-input"
            className="block text-sm font-semibold text-gray-text mb-2"
          >
            URL de la page à auditer
          </label>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/fr"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-text
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary
                       focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="source-lang"
              className="block text-sm font-semibold text-gray-text mb-2"
            >
              Langue source
            </label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-text
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="target-lang"
              className="block text-sm font-semibold text-gray-text mb-2"
            >
              Langue cible
            </label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-text
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-error text-sm"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg bg-primary text-white font-semibold
                     hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary
                     focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed
                     min-h-[44px] cursor-pointer"
        >
          {isLoading ? "Analyse en cours..." : "Lancer l'audit"}
        </button>
      </div>
    </form>
  );
}
