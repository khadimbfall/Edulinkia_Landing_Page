import Icon from "./Icons";

const principles = [
  { icon: "users", title: "Supervision humaine", text: "L'IA propose, les professionnels décident." },
  { icon: "eye", title: "Alertes explicables", text: "Chaque alerte vise à être comprise : quelles données, quelle variation, quelle raison." },
  { icon: "alert", title: "Limites et qualité des données", text: "Un indicateur dépend des données saisies. Leurs limites doivent être gardées à l'esprit." },
  { icon: "layers", title: "Prévention des biais", text: "Une vigilance continue est nécessaire pour éviter que les indicateurs ne désavantagent certains élèves." },
  { icon: "lock", title: "Confidentialité", text: "Les données des élèves sont traitées avec une attention particulière à leur protection." },
  { icon: "shield", title: "Pas de décision automatisée", text: "Aucune décision scolaire défavorable ne doit reposer uniquement sur un score de risque." },
];

export default function AISection() {
  return (
    <section id="ia" className="py-16 sm:py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-5">Intelligence artificielle</p>
          <h2 className="h2 mb-6">Une IA responsable, avec l'humain au centre</h2>
          <p className="lead">L'IA a vocation à aider les équipes à analyser les informations disponibles et à identifier des situations pouvant nécessiter une attention particulière.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {principles.map((p) => (
            <article key={p.title} className="card p-7">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5"><Icon name={p.icon} size={18} /></div>
              <h3 className="font-bold text-[#0F1C3F] mb-3">{p.title}</h3>
              <p className="text-[#475569] leading-relaxed">{p.text}</p>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-7 sm:p-8 flex gap-5">
          <Icon name="alert" className="text-[#B45309] shrink-0 mt-0.5" />
          <div className="text-[#78350F] leading-relaxed space-y-4">
            <p><strong>Un indicateur de risque n'est ni un diagnostic ni une certitude sur l'avenir d'un élève.</strong> Il signale une situation à examiner, jamais une conclusion.</p>
            <p className="text-sm">Ces principes sont les engagements qui guident la conception d'EDULINKIA. Les dispositifs effectivement en place et leur périmètre vous sont présentés précisément lors de la démonstration.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
