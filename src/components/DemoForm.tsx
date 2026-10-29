import { useRef, useState } from "react";
import Icon from "./Icons";
import { LegalLink } from "./LegalDialog";
import { SITE } from "../lib/site";
import { publicAnonKey } from "../../utils/supabase/info";

type Status = "idle" | "loading" | "success" | "error" | "unconfigured";
type Fields = { name: string; email: string; phone: string; school: string; role: string; schoolType: string; message: string; consent: boolean; website: string };
type Errors = Partial<Record<keyof Fields, string>>;

const initial: Fields = { name: "", email: "", phone: "", school: "", role: "", schoolType: "", message: "", consent: false, website: "" };
const COOLDOWN_MS = 60_000;
const KEY = "edulinkia_demo_last_submit";

export default function DemoForm() {
  const [f, setF] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [info, setInfo] = useState("");
  const startedAt = useRef(Date.now());
  const inflight = useRef(false);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = "Indiquez votre nom et prénom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Saisissez une adresse e-mail valide, par exemple prenom.nom@etablissement.fr.";
    if (f.phone.trim() && !/^\+?[0-9 .()-]{9,20}$/.test(f.phone.trim())) e.phone = "Saisissez un numéro valide, par exemple 06 12 34 56 78 ou +33 6 12 34 56 78.";
    if (f.school.trim().length < 2) e.school = "Indiquez le nom de votre établissement ou organisation.";
    if (!f.role) e.role = "Sélectionnez votre fonction.";
    if (f.message.length > 2000) e.message = "Le message ne doit pas dépasser 2 000 caractères.";
    if (!f.consent) e.consent = "Vous devez accepter l'utilisation de vos informations pour être recontacté(e).";
    setErrors(e);
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (inflight.current || status === "loading") return; // anti double soumission
    const e = validate();
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    // Anti-spam : champ piège rempli ou envoi anormalement rapide -> on ignore silencieusement.
    if (f.website || Date.now() - startedAt.current < 2500) return;
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < COOLDOWN_MS) {
        setStatus("error");
        setInfo("Une demande vient d'être envoyée depuis ce navigateur. Merci de patienter une minute avant d'en envoyer une nouvelle.");
        return;
      }
    } catch { /* stockage indisponible */ }

    if (!SITE.demoEndpoint) {
      setStatus("unconfigured");
      return;
    }

    inflight.current = true;
    setStatus("loading");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    try {
      const { website: _hp, ...payload } = f; // le champ piège n'est jamais envoyé
      void _hp;
      const res = await fetch(SITE.demoEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (res.status === 429) throw new Error("Trop de demandes en peu de temps. Veuillez réessayer dans quelques minutes.");
      if (res.status === 422 || res.status === 400) throw new Error("Certaines informations n'ont pas été acceptées. Vérifiez les champs et réessayez.");
      if (!res.ok) throw new Error("Le service d'envoi a rencontré une erreur. Veuillez réessayer ou nous écrire directement.");
      try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setInfo(
        err instanceof DOMException && err.name === "AbortError"
          ? "Le serveur met trop de temps à répondre. Vérifiez votre connexion puis réessayez."
          : err instanceof TypeError
            ? "Impossible de joindre le service d'envoi. Vérifiez votre connexion puis réessayez."
            : err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      clearTimeout(timer);
      inflight.current = false;
    }
  };

  const input = (k: keyof Fields) =>
    `w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-[#0F1C3F] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${errors[k] ? "border-[#DC2626]" : "border-[#CBD5E1] hover:border-[#94A3B8]"}`;
  const A = (k: keyof Fields) => ({ id: k, "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined } as const);
  const Err = ({ k }: { k: keyof Fields }) => errors[k] ? <p id={`${k}-err`} className="text-[#B91C1C] text-sm mt-1">{errors[k]}</p> : null;
  const Label = ({ k, children, req }: { k: string; children: React.ReactNode; req?: boolean }) => (
    <label htmlFor={k} className="block text-sm font-semibold text-[#1E293B] mb-1.5">{children}{req && <span className="text-[#B91C1C]" aria-hidden="true"> *</span>}</label>
  );

  return (
    <section id="demo" className="on-dark py-16 sm:py-20 lg:py-28 text-white" style={{ background: "linear-gradient(135deg, #0F1C3F 0%, #1E3A8A 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start">
        <div>
          <p className="eyebrow !text-[#93C5FD] mb-5">Demander une démonstration</p>
          <h2 className="h2 !text-white mb-6">Découvrons ensemble les besoins de votre établissement</h2>
          <p className="text-lg leading-relaxed text-white/80 mb-10">
            Chaque établissement possède ses propres besoins, son organisation et ses outils. Échangeons sur votre contexte pour vous présenter EDULINKIA et identifier les fonctionnalités adaptées à votre projet.
          </p>
          <div id="contact" className="space-y-4 scroll-mt-24">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">Nous contacter directement</h3>
            <a href={`mailto:${SITE.email}`} aria-label={`Envoyer un e-mail à ${SITE.email}`} className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 p-4 transition-colors">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Icon name="mail" /></span>
              <span><span className="block text-xs text-white/60">E-mail</span><span className="font-bold break-all">{SITE.email}</span></span>
            </a>
            <a href={SITE.phoneHref} aria-label={`Appeler EDULINKIA au ${SITE.phone}`} className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 p-4 transition-colors">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center"><Icon name="phone" /></span>
              <span><span className="block text-xs text-white/60">Téléphone</span><span className="font-bold">{SITE.phone}</span></span>
            </a>
          </div>
        </div>

        <div className="bg-white text-[#0F1C3F] rounded-3xl p-6 sm:p-9 shadow-2xl">
          {status === "success" ? (
            <div role="status" className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto mb-5"><Icon name="check" size={30} /></div>
              <h3 className="text-2xl font-extrabold mb-3">Votre demande a bien été enregistrée</h3>
              <p className="text-[#475569] leading-relaxed mb-2">Notre équipe vous recontactera à l'adresse indiquée pour échanger sur votre contexte et convenir des modalités d'une démonstration.</p>
              <p className="text-sm text-[#64748B]">Une question en attendant ? <a className="text-[#2563EB] underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate aria-describedby="form-help">
              <h3 className="text-xl font-extrabold mb-2">Formulaire de demande de démonstration</h3>
              <p id="form-help" className="text-sm text-[#64748B] mb-7">Les champs marqués d'un astérisque (*) sont obligatoires.</p>

              <div className="space-y-5">
                <div><Label k="name" req>Nom et prénom</Label><input {...A("name")} type="text" autoComplete="name" className={input("name")} value={f.name} onChange={(e) => set("name", e.target.value)} /><Err k="name" /></div>
                <div><Label k="email" req>Adresse e-mail professionnelle</Label><input {...A("email")} type="email" autoComplete="email" className={input("email")} value={f.email} onChange={(e) => set("email", e.target.value)} /><Err k="email" /></div>
                <div><Label k="phone">Numéro de téléphone (facultatif)</Label><input {...A("phone")} type="tel" autoComplete="tel" inputMode="tel" className={input("phone")} value={f.phone} onChange={(e) => set("phone", e.target.value)} /><Err k="phone" /></div>
                <div><Label k="school" req>Établissement ou organisation</Label><input {...A("school")} type="text" autoComplete="organization" className={input("school")} value={f.school} onChange={(e) => set("school", e.target.value)} /><Err k="school" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label k="role" req>Fonction</Label>
                    <select {...A("role")} className={input("role")} value={f.role} onChange={(e) => set("role", e.target.value)}>
                      <option value="">Sélectionner…</option>
                      <option>Chef d'établissement / Directeur</option><option>Adjoint de direction</option><option>Enseignant</option><option>Personnel administratif</option><option>Autre</option>
                    </select>
                    <Err k="role" />
                  </div>
                  <div>
                    <Label k="schoolType">Type d'établissement</Label>
                    <select {...A("schoolType")} className={input("schoolType")} value={f.schoolType} onChange={(e) => set("schoolType", e.target.value)}>
                      <option value="">Sélectionner…</option>
                      <option>École primaire</option><option>Collège</option><option>Lycée</option><option>Lycée professionnel</option><option>Centre de formation</option><option>Autre</option>
                    </select>
                  </div>
                </div>
                <div><Label k="message">Message (facultatif)</Label><textarea {...A("message")} rows={3} maxLength={2000} className={`${input("message")} resize-y`} value={f.message} onChange={(e) => set("message", e.target.value)} /><Err k="message" /></div>

                {/* Champ piège anti-robots, invisible pour les humains */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                  <label>Ne pas remplir<input type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} /></label>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input {...A("consent")} type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 w-5 h-5 shrink-0 accent-[#2563EB]" />
                    <span className="text-sm text-[#334155] leading-relaxed">
                      J'accepte que EDULINKIA utilise ces informations uniquement pour répondre à ma demande et me recontacter. Pour en savoir plus, consultez la{" "}
                      <LegalLink doc="privacy" className="text-[#2563EB] underline">politique de confidentialité</LegalLink>.<span className="text-[#B91C1C]" aria-hidden="true"> *</span>
                    </span>
                  </label>
                  <Err k="consent" />
                </div>
              </div>

              <div role="alert" aria-live="assertive">
                {status === "error" && <p className="mt-5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B] p-3 text-sm">{info}</p>}
                {status === "unconfigured" && (
                  <p className="mt-5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] text-[#78350F] p-3 text-sm">
                    L'envoi en ligne n'est pas encore disponible : votre demande n'a pas été transmise. Écrivez-nous directement à{" "}
                    <a className="underline font-semibold" href={`mailto:${SITE.email}`}>{SITE.email}</a> ou appelez le <a className="underline font-semibold" href={SITE.phoneHref}>{SITE.phone}</a>.
                  </p>
                )}
              </div>

              <button type="submit" disabled={status === "loading"} aria-busy={status === "loading"} className="btn btn-primary w-full mt-8 text-lg">
                {status === "loading" ? (<><svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M12 3a9 9 0 019 9" strokeLinecap="round" /></svg>Envoi en cours…</>) : "Demander ma démonstration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
