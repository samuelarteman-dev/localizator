export const RESIDUAL_STRINGS = {
  EN: [
    "Click here",
    "Learn more",
    "Sign up",
    "Free trial",
    "Get started",
    "Buy now",
    "Log in",
    "Contact us",
    "Read more",
    "Subscribe",
    "Download",
    "View all",
    "See more",
    "Try for free",
    "Book a demo",
    "Request a demo",
    "Get in touch",
    "Our team",
    "About us",
    "Privacy policy",
    "Terms of service",
    "All rights reserved",
    "Loading...",
    "Submit",
    "Next",
    "Previous",
    "Back",
    "Cancel",
    "Confirm",
    "Save",
    "Delete",
    "Edit",
    "Share",
  ],
  FR: [
    "Cliquez ici",
    "En savoir plus",
    "S'inscrire",
    "Connexion",
    "Télécharger",
    "Voir tout",
    "Envoyer",
    "Suivant",
    "Précédent",
    "Annuler",
    "Confirmer",
    "Sauvegarder",
  ],
};

export const DATE_PATTERNS = {
  US: [
    /\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}\b/g,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?\b/gi,
  ],
  EU: [
    /\b(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}\b/g,
    /\b\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}\b/gi,
  ],
};

export const CURRENCY_PATTERNS = {
  NON_EUR: [/\$\s?\d/g, /\bUSD\b/g, /£\s?\d/g],
  NON_USD: [/€\s?\d/g, /\d\s?€/g],
};

export const SEVERITY = {
  CRITICAL: "CRITIQUE",
  IMPORTANT: "IMPORTANT",
  WARNING: "AVERTISSEMENT",
};

export const SEVERITY_PENALTY = {
  CRITIQUE: 30,
  IMPORTANT: 15,
  AVERTISSEMENT: 5,
};
