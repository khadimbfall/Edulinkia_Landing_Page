import Icon from "./Icons";
import { DirectionView } from "./ProductPreview";

export default function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden pt-16" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="animate-fade-in-up">
          <p className="eyebrow mb-7">Plateforme de suivi scolaire</p>
          <h1 className="font-extrabold text-[#0F1C3F] leading-[1.15] mb-8" style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}>
            Mieux suivre chaque élève. Mieux accompagner sa réussite.
          </h1>
          <p className="lead max-w-xl mb-12">
            EDULINKIA réunit la direction, les enseignants, les familles et les élèves autour d'un suivi scolaire centralisé, d'une communication simplifiée et d'indicateurs intelligents pour mieux accompagner chaque parcours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#demo" className="btn btn-primary">Demander une démonstration <Icon name="arrow" size={18} /></a>
            <a href="#apercu" className="btn btn-secondary">Découvrir la plateforme</a>
          </div>
          <p className="mt-11 text-[#1E3A8A] font-semibold italic max-w-md" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Quand l'école, la famille et l'IA avancent ensemble, la réussite suit.
          </p>
        </div>

        <figure className="animate-fade-in-up min-w-0" style={{ animationDelay: ".1s" }}>
          <div className="rounded-2xl border border-[#CBD5E1] bg-white shadow-[0_24px_60px_-20px_rgba(15,28,63,.35)] overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F1F5F9] border-b border-[#E2E8F0]" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" /><span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" /><span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]" />
            </div>
            <DirectionView compact />
          </div>
          <figcaption className="mt-4 text-xs text-[#64748B] text-center">Exemple d'interface – données fictives à titre illustratif.</figcaption>
        </figure>
      </div>
    </section>
  );
}
