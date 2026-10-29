import { projectId } from "../../utils/supabase/info";

export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-67f49d33`;

// Configuration centrale de la vitrine. Aucune valeur n'est inventée :
// les éléments juridiques manquants sont laissés à `undefined` et signalés dans l'interface.
export const SITE = {
  // Adresse assemblée à l'exécution : certains hébergeurs réécrivent le nom de domaine "edulinkia.com"
  // dans les fichiers publiés (constaté sur Hostinger), ce qui altérait l'adresse affichée.
  email: ["contact", ["edulinkia", "com"].join(".")].join("@"),
  phone: "+33 7 58 74 08 44",
  phoneHref: "tel:+33758740844",
  // Endpoint de réception des demandes de démonstration (fonction serveur Supabase).
  demoEndpoint: API_BASE ? `${API_BASE}/demo-requests` : undefined,
};

export type LegalKey = "legal" | "privacy" | "cookies" | "terms";

export const LEGAL_DOCS: Record<LegalKey, { label: string; url?: string }> = {
  legal: { label: "Mentions légales", url: undefined },
  privacy: { label: "Politique de confidentialité", url: "#/confidentialite" },
  cookies: { label: "Politique de cookies", url: "#/cookies" },
  terms: { label: "Conditions générales", url: undefined },
};

export const OPEN_LEGAL_EVENT = "edulinkia:open-legal";
export const OPEN_COOKIES_EVENT = "edulinkia:open-cookies";
