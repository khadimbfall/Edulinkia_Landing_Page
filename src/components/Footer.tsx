import Logo from "./Logo";
import Icon from "./Icons";
import { CookieSettingsButton, LegalLink } from "./LegalDialog";
import { SITE } from "../lib/site";

const nav = [
  { label: "Plateforme", href: "#apercu" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "IA responsable", href: "#ia" },
  { label: "Sécurité", href: "#securite" },
  { label: "FAQ", href: "#faq" },
];
const linkCls = "text-sm text-white/70 hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="on-dark bg-[#060D1F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          <div>
            <div className="inline-block bg-white rounded-xl px-3 py-1.5 mb-5"><Logo className="h-10" /></div>
            <p className="text-white/70 text-sm leading-relaxed">Plateforme de suivi scolaire qui connecte la direction, les enseignants, les familles et les élèves.</p>
          </div>
          <nav aria-label="Pied de page – sections">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-5">Navigation</h2>
            <ul className="space-y-3">{nav.map((l) => <li key={l.href}><a href={l.href} className={linkCls}>{l.label}</a></li>)}</ul>
          </nav>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-5">Informations légales</h2>
            <ul className="space-y-3">
              <li><LegalLink doc="legal" className={linkCls} /></li>
              <li><LegalLink doc="privacy" className={linkCls} /></li>
              <li><LegalLink doc="cookies" className={linkCls} /></li>
              <li><LegalLink doc="terms" className={linkCls} /></li>
              <li><CookieSettingsButton className={linkCls} /></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-5">Contact</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-2.5"><Icon name="mail" size={16} className="text-white/60" /><a href={`mailto:${SITE.email}`} aria-label={`Envoyer un e-mail à ${SITE.email}`} className={linkCls}>{SITE.email}</a></li>
              <li className="flex items-center gap-2.5"><Icon name="phone" size={16} className="text-white/60" /><a href={SITE.phoneHref} aria-label={`Appeler EDULINKIA au ${SITE.phone}`} className={linkCls}>{SITE.phone}</a></li>
            </ul>
            <a href="#demo" className="btn btn-primary mt-6 text-sm !py-2">Demander une démonstration</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-wrap justify-between gap-4">
            <p className="text-white/60 text-xs">© {new Date().getFullYear()} EDULINKIA. Tous droits réservés.</p>
            <a href="#/equipe" className="text-white/60 hover:text-white text-xs">Espace équipe</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
