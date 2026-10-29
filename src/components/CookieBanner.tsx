import { useEffect, useState } from "react";
import { OPEN_COOKIES_EVENT } from "../lib/site";

type Prefs = { necessary: true; analytics: boolean; marketing: boolean };

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem("edulinkia_cookie_consent");
    } catch {
      return true;
    }
  });
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const h = () => { setShowDetails(true); setVisible(true); };
    window.addEventListener(OPEN_COOKIES_EVENT, h);
    return () => window.removeEventListener(OPEN_COOKIES_EVENT, h);
  }, []);

  const save = (accepted: Prefs) => {
    try {
      localStorage.setItem("edulinkia_cookie_consent", JSON.stringify(accepted));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div
        className="max-w-4xl mx-auto rounded-2xl shadow-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6"
        role="dialog"
        aria-label="Gestion des cookies"
        aria-modal="false"
      >
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3
                  className="font-bold text-[#0F1C3F] text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Gestion des cookies
                </h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Nous utilisons des cookies nécessaires au fonctionnement du site. Avec votre
                accord, nous pouvons également utiliser des cookies statistiques et marketing.
                Vous pouvez modifier vos préférences à tout moment.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <button
                onClick={() => setShowDetails(true)}
                className="px-3 py-2 text-xs font-semibold text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFF] transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Personnaliser
              </button>
              <button
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className="px-3 py-2 text-xs font-semibold text-[#374151] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFF] transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Refuser tout
              </button>
              <button
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className="px-3 py-2 text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3
              className="font-bold text-[#0F1C3F] mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Paramètres des cookies
            </h3>
            <div className="space-y-3 mb-5">
              {[
                {
                  key: "necessary" as const,
                  label: "Cookies nécessaires",
                  desc: "Indispensables au fonctionnement du site. Ne peuvent pas être désactivés.",
                  locked: true,
                },
                {
                  key: "analytics" as const,
                  label: "Cookies statistiques",
                  desc: "Nous aident à comprendre comment les visiteurs utilisent le site (mesures d'audience anonymisées).",
                  locked: false,
                },
                {
                  key: "marketing" as const,
                  label: "Cookies marketing",
                  desc: "Permettent de vous proposer des publicités adaptées à vos centres d'intérêt.",
                  locked: false,
                },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-4 p-3 rounded-xl bg-[#F8FAFF] border border-[#E2E8F0]">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0F1C3F]">{item.label}</div>
                    <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {item.locked ? (
                      <div className="w-11 h-6 rounded-full bg-[#2563EB] flex items-center justify-end px-1">
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </div>
                    ) : (
                      <button
                        role="switch"
                        aria-checked={prefs[item.key]}
                        onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
                        className="w-11 h-6 rounded-full transition-colors relative"
                        style={{ background: prefs[item.key] ? "#2563EB" : "#CBD5E1" }}
                      >
                        <span
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                          style={{ left: prefs[item.key] ? "calc(100% - 20px)" : "4px" }}
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFF] transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Retour
              </button>
              <button
                onClick={() => save(prefs)}
                className="px-4 py-2 text-sm font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-xl transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Enregistrer mes préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
