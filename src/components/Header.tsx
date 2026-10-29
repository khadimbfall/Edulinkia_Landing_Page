import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icons";
import { SITE } from "../lib/site";

const navLinks = [
  { label: "Plateforme", href: "#apercu" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "IA responsable", href: "#ia" },
  { label: "Sécurité", href: "#securite" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b transition-shadow ${scrolled ? "border-[#E2E8F0] shadow-sm" : "border-transparent"}`}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded-lg">Aller au contenu</a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#accueil" aria-label="EDULINKIA – retour à l'accueil" className="shrink-0">
          <Logo className="h-9 md:h-10" />
        </a>

        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Navigation principale">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#demo" className="btn btn-primary hidden sm:inline-flex text-sm !py-2">Demander une démonstration</a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="xl:hidden w-11 h-11 inline-flex items-center justify-center rounded-xl text-[#0F1C3F] hover:bg-[#EFF6FF]" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="menu-mobile">
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="xl:hidden bg-white border-t border-[#E2E8F0] shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Menu mobile">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3 font-semibold text-[#334155] rounded-xl hover:bg-[#EFF6FF] hover:text-[#2563EB]">{l.label}</a>
            ))}
            <a href="#demo" onClick={() => setOpen(false)} className="btn btn-primary mt-2">Demander une démonstration</a>
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex flex-col gap-1 text-sm">
              <a href={`mailto:${SITE.email}`} className="px-4 py-2 text-[#334155]">{SITE.email}</a>
              <a href="tel:+33758740844" className="px-4 py-2 text-[#334155]">+33 7 58 74 08 44</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
