import { useState } from "react";
import Icon from "./Icons";

const faqs = [
  { q: "À quels types d'établissements s'adresse EDULINKIA ?", a: "EDULINKIA s'adresse aux établissements scolaires et à leurs équipes éducatives. Le périmètre adapté à votre type d'établissement est précisé lors d'un échange." },
  { q: "Quels sont les profils qui peuvent utiliser la plateforme ?", a: "Quatre profils disposent d'un espace dédié : la direction, les enseignants, les parents ou responsables légaux, et les élèves. Chacun accède aux informations relevant de ses responsabilités." },
  { q: "EDULINKIA remplace-t-il notre logiciel scolaire actuel ?", a: "EDULINKIA se positionne comme un complément aux outils existants. La manière de l'articuler avec votre organisation est étudiée avec vous." },
  { q: "Comment fonctionne le suivi des absences ?", a: "L'enseignant enregistre l'appel depuis son espace. Les informations sont ensuite consultables par les personnes habilitées, et des notifications peuvent être configurées selon les fonctionnalités activées." },
  { q: "Quel est le rôle de l'intelligence artificielle ?", a: "L'IA aide les équipes à repérer des tendances et des situations pouvant nécessiter une attention particulière. Elle ne prend aucune décision : l'analyse et la décision restent humaines." },
  { q: "Comment sont protégées les données des élèves ?", a: "Les accès sont organisés selon les rôles et les données sont traitées avec une vigilance particulière, s'agissant de mineurs. Les mesures de sécurité, l'hébergement et les sous-traitants sont détaillés lors de nos échanges." },
  { q: "Est-il possible d'organiser une démonstration ?", a: "Oui. Remplissez le formulaire de demande de démonstration ou écrivez-nous par e-mail (adresse en bas de page) : nous reviendrons vers vous pour en convenir les modalités." },
  { q: "Comment se déroule une éventuelle phase pilote ?", a: "Les modalités d'une phase pilote dépendent du contexte de chaque établissement. Elles seront précisées lors de l'échange." },
  { q: "Comment obtenir des informations sur les modalités commerciales ?", a: "Ces informations sont communiquées lors de l'échange avec notre équipe, en fonction de vos besoins. Vous pouvez nous contacter via le formulaire ou par e-mail." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="eyebrow mb-5">FAQ</p>
          <h2 className="h2">Questions fréquentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card overflow-hidden">
                <h3>
                  <button type="button" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-bold text-[#0F1C3F] min-h-[56px]">
                    {f.q}
                    <Icon name="plus" size={18} className={`shrink-0 text-[#2563EB] transition-transform ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen} className="px-6 pb-6 text-[#475569] leading-relaxed">{f.a}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-14">
          <p className="text-[#64748B] mb-5">Une autre question ?</p>
          <a href="#contact" className="btn btn-secondary">Nous contacter</a>
        </div>
      </div>
    </section>
  );
}
