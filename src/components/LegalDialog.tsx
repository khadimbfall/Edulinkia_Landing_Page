import { useEffect, useRef, useState } from "react";
import { LEGAL_DOCS, OPEN_COOKIES_EVENT, OPEN_LEGAL_EVENT, SITE, type LegalKey } from "../lib/site";

/** Lien vers un document juridique : lien réel si l'URL est configurée, sinon ouvre un message explicite. */
export function LegalLink({ doc, className = "", children }: { doc: LegalKey; className?: string; children?: React.ReactNode }) {
  const d = LEGAL_DOCS[doc];
  const label = children ?? d.label;
  if (d.url) {
    return <a href={d.url} className={className}>{label}</a>;
  }
  return (
    <button type="button" className={`${className} text-left`} onClick={() => window.dispatchEvent(new CustomEvent(OPEN_LEGAL_EVENT, { detail: doc }))}>
      {label}
    </button>
  );
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`${className} text-left`} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIES_EVENT))}>
      Gérer les cookies
    </button>
  );
}

export default function LegalDialog() {
  const [doc, setDoc] = useState<LegalKey | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const h = (e: Event) => setDoc((e as CustomEvent<LegalKey>).detail);
    window.addEventListener(OPEN_LEGAL_EVENT, h);
    return () => window.removeEventListener(OPEN_LEGAL_EVENT, h);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (doc && !d.open) d.showModal();
    if (!doc && d.open) d.close();
  }, [doc]);

  return (
    <dialog ref={ref} onClose={() => setDoc(null)} onClick={(e) => e.target === ref.current && setDoc(null)} aria-labelledby="legal-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 backdrop:bg-[#0F1C3F]/60">
      {doc && (
        <div className="p-7">
          <h2 id="legal-title" className="text-xl font-extrabold text-[#0F1C3F] mb-3">{LEGAL_DOCS[doc].label}</h2>
          <p className="text-[#475569] leading-relaxed mb-5">
            Ce document n'est pas encore publié sur ce site. Il doit être rédigé et validé avant la mise en ligne publique.
            Pour toute question dans l'intervalle, écrivez-nous à{" "}
            <a className="text-[#2563EB] underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <button type="button" autoFocus onClick={() => setDoc(null)} className="btn btn-primary w-full">Fermer</button>
        </div>
      )}
    </dialog>
  );
}
