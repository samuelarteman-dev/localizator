import {
  RESIDUAL_STRINGS,
  DATE_PATTERNS,
  CURRENCY_PATTERNS,
  SEVERITY,
} from "../data/localizationPatterns.js";

function getTextContent(html) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, "");
  const text = withoutStyles.replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

function countWords(text) {
  return text.split(/\s+/).filter((w) => w.length > 1).length;
}

function checkLangAttribute(html, targetLang) {
  const match = html.match(/<html[^>]*\slang\s*=\s*["']([^"']*)["']/i);
  const langValue = match ? match[1] : null;
  const targetPrefix = targetLang.toLowerCase().substring(0, 2);

  if (!langValue) {
    return {
      id: "lang-attribute",
      label: "Attribut lang",
      severity: SEVERITY.CRITICAL,
      passed: false,
      occurrences: 1,
      details: "L'attribut lang est absent de la balise <html>.",
    };
  }

  const langPrefix = langValue.toLowerCase().substring(0, 2);
  if (langPrefix !== targetPrefix) {
    return {
      id: "lang-attribute",
      label: "Attribut lang",
      severity: SEVERITY.CRITICAL,
      passed: false,
      occurrences: 1,
      details: `L'attribut lang="${langValue}" ne correspond pas à la langue cible (${targetLang}).`,
    };
  }

  return {
    id: "lang-attribute",
    label: "Attribut lang",
    severity: SEVERITY.CRITICAL,
    passed: true,
    occurrences: 0,
    details: `Attribut lang="${langValue}" correctement défini.`,
  };
}

function checkHreflang(html, sourceLang, targetLang) {
  const hreflangRegex =
    /<link[^>]*rel\s*=\s*["']alternate["'][^>]*hreflang\s*=\s*["']([^"']*)["'][^>]*>/gi;
  const matches = [...html.matchAll(hreflangRegex)];
  const hreflangValues = matches.map((m) => m[1].toLowerCase());

  if (matches.length === 0) {
    return {
      id: "hreflang",
      label: "Balises hreflang",
      severity: SEVERITY.IMPORTANT,
      passed: false,
      occurrences: 1,
      details: "Aucune balise hreflang détectée.",
    };
  }

  const sourcePrefix = sourceLang.toLowerCase().substring(0, 2);
  const targetPrefix = targetLang.toLowerCase().substring(0, 2);
  const hasSource = hreflangValues.some((v) => v.startsWith(sourcePrefix));
  const hasTarget = hreflangValues.some((v) => v.startsWith(targetPrefix));

  if (!hasSource || !hasTarget) {
    const missing = [];
    if (!hasSource) missing.push(sourceLang);
    if (!hasTarget) missing.push(targetLang);
    return {
      id: "hreflang",
      label: "Balises hreflang",
      severity: SEVERITY.IMPORTANT,
      passed: false,
      occurrences: missing.length,
      details: `Balises hreflang incomplètes. Manquant : ${missing.join(", ")}. Trouvé : ${hreflangValues.join(", ")}.`,
    };
  }

  return {
    id: "hreflang",
    label: "Balises hreflang",
    severity: SEVERITY.IMPORTANT,
    passed: true,
    occurrences: 0,
    details: `Balises hreflang correctes : ${hreflangValues.join(", ")}.`,
  };
}

function checkResidualStrings(html, sourceLang) {
  const text = getTextContent(html);
  const patterns = RESIDUAL_STRINGS[sourceLang] || [];
  const found = [];

  for (const pattern of patterns) {
    const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) {
      found.push({ string: pattern, count: matches.length });
    }
  }

  const totalOccurrences = found.reduce((sum, f) => sum + f.count, 0);
  let severity;
  if (totalOccurrences > 3) {
    severity = SEVERITY.IMPORTANT;
  } else if (totalOccurrences >= 1) {
    severity = SEVERITY.WARNING;
  } else {
    severity = SEVERITY.WARNING;
  }

  const detailList = found
    .map((f) => `"${f.string}" (×${f.count})`)
    .join(", ");

  return {
    id: "residual-strings",
    label: "Textes résiduels en langue source",
    severity,
    passed: totalOccurrences === 0,
    occurrences: totalOccurrences,
    details:
      totalOccurrences === 0
        ? "Aucun texte résiduel en langue source détecté."
        : `${totalOccurrences} occurrence(s) trouvée(s) : ${detailList}.`,
  };
}

function checkDateFormats(html, targetLang) {
  const text = getTextContent(html);
  const targetPrefix = targetLang.toLowerCase().substring(0, 2);
  const patterns = targetPrefix === "fr" ? DATE_PATTERNS.US : DATE_PATTERNS.EU;
  const found = [];

  for (const regex of patterns) {
    const fresh = new RegExp(regex.source, regex.flags);
    const matches = text.match(fresh);
    if (matches) {
      found.push(...matches);
    }
  }

  return {
    id: "date-formats",
    label: "Formats de date",
    severity: SEVERITY.IMPORTANT,
    passed: found.length === 0,
    occurrences: found.length,
    details:
      found.length === 0
        ? "Aucun format de date incohérent détecté."
        : `${found.length} format(s) de date incohérent(s) détecté(s) : ${found.slice(0, 5).map((f) => `"${f}"`).join(", ")}${found.length > 5 ? "…" : ""}.`,
  };
}

function checkCurrencyFormats(html, targetLang) {
  const text = getTextContent(html);
  const targetPrefix = targetLang.toLowerCase().substring(0, 2);
  const patterns =
    targetPrefix === "fr" ? CURRENCY_PATTERNS.NON_EUR : CURRENCY_PATTERNS.NON_USD;
  const found = [];

  for (const regex of patterns) {
    const fresh = new RegExp(regex.source, regex.flags);
    const matches = text.match(fresh);
    if (matches) {
      found.push(...matches);
    }
  }

  return {
    id: "currency-formats",
    label: "Formats monétaires",
    severity: SEVERITY.IMPORTANT,
    passed: found.length === 0,
    occurrences: found.length,
    details:
      found.length === 0
        ? "Aucun format monétaire incohérent détecté."
        : `${found.length} devise(s) incohérente(s) détectée(s) : ${found.slice(0, 5).map((f) => `"${f.trim()}"`).join(", ")}${found.length > 5 ? "…" : ""}.`,
  };
}

function checkAttributes(html, sourceLang) {
  const patterns = RESIDUAL_STRINGS[sourceLang] || [];
  const attrRegex =
    /(?:alt|placeholder|title)\s*=\s*["']([^"']+)["']/gi;
  const matches = [...html.matchAll(attrRegex)];
  const found = [];

  for (const match of matches) {
    const value = match[1];
    for (const pattern of patterns) {
      if (value.toLowerCase().includes(pattern.toLowerCase())) {
        found.push({ attribute: match[0].split("=")[0].trim(), value, match: pattern });
        break;
      }
    }
  }

  return {
    id: "attributes",
    label: "Attributs alt, placeholder, title",
    severity: SEVERITY.WARNING,
    passed: found.length === 0,
    occurrences: found.length,
    details:
      found.length === 0
        ? "Aucun attribut en langue source détecté."
        : `${found.length} attribut(s) en langue source : ${found.slice(0, 5).map((f) => `${f.attribute}="${f.value}"`).join(", ")}${found.length > 5 ? "…" : ""}.`,
  };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function analyzeHTML(html, sourceLang, targetLang) {
  const checks = [
    checkLangAttribute(html, targetLang),
    checkHreflang(html, sourceLang, targetLang),
    checkResidualStrings(html, sourceLang),
    checkDateFormats(html, targetLang),
    checkCurrencyFormats(html, targetLang),
    checkAttributes(html, sourceLang),
  ];

  const text = getTextContent(html);
  const wordCount = countWords(text);
  const isSPA = wordCount < 500;

  return { checks, isSPA, wordCount };
}

export function calculateScore(checks) {
  const penalties = { CRITIQUE: 30, IMPORTANT: 15, AVERTISSEMENT: 5 };
  let score = 100;

  for (const check of checks) {
    if (!check.passed) {
      score -= penalties[check.severity] || 0;
    }
  }

  return Math.max(0, score);
}
