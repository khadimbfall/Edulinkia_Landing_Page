import Icon from "./Icons";

const pillars = [
  { icon: "eye", title: "Une vision partagée", text: "Des espaces adaptés à chaque profil pour faciliter la circulation des informations scolaires autorisées." },
  { icon: "clock", title: "Un suivi plus réactif", text: "Des outils pour consulter les absences, les évaluations et les indicateurs utiles au suivi des élèves." },
  { icon: "spark", title: "Une IA au service des équipes", text: "Des analyses et suggestions pour aider les professionnels à repérer des tendances et préparer un accompagnement pertinent, selon les fonctionnalités disponibles." },
  { icon: "heart", title: "Une approche centrée sur l'humain", text: "Les indicateurs et alertes sont une aide à l'analyse. Ils ne remplacent ni le jugement des professionnels ni les échanges avec les élèves et leurs familles." },
];

export default function Differentiators() {
  return (
    <section id="difference" className="py-16 sm:py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-5">Notre approche</p>
          <h2 className="h2 mb-6">Ce qui rend EDULINKIA différent</h2>
          <p className="lead">EDULINKIA se positionne en complément des outils scolaires existants de l'établissement, et non comme un remplacement automatique de chacun d'eux.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <article key={p.title} className="card p-7">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5"><Icon name={p.icon} /></div>
              <h3 className="text-lg font-bold text-[#0F1C3F] mb-3">{p.title}</h3>
              <p className="text-[#475569] leading-relaxed">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
