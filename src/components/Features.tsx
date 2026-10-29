import Icon from "./Icons";

const groups = [
  { icon: "book", title: "Suivi scolaire", items: [["Absences et retards", "Pour garder une vision claire de l'assiduité."], ["Évaluations et résultats", "Pour suivre la progression de chaque élève."], ["Informations scolaires", "Pour consulter les données utiles en un seul endroit."], ["Emploi du temps et documents", "Selon les fonctionnalités disponibles."]] },
  { icon: "chat", title: "Communication", items: [["Notifications", "Pour informer sur les événements scolaires."], ["Informations aux responsables légaux", "Pour que les familles restent informées."], ["Échanges entre acteurs autorisés", "Selon les fonctionnalités opérationnelles."]] },
  { icon: "chart", title: "Pilotage", items: [["Tableaux de bord", "Pour une vue d'ensemble de l'établissement."], ["Indicateurs de suivi", "Pour repérer les points d'attention."], ["Vues par profil", "Pour que chacun accède à ce qui relève de ses responsabilités."]] },
  { icon: "spark", title: "Intelligence artificielle", items: [["Détection d'anomalies potentielles", "Pour attirer l'attention sur des variations inhabituelles."], ["Repérage de tendances", "Pour mieux comprendre l'évolution d'une situation."], ["Suggestions et synthèses", "Pour préparer un accompagnement, lorsque disponibles."]] },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-5">Fonctionnalités</p>
          <h2 className="h2 mb-6">Les fonctionnalités principales</h2>
          <p className="lead">Quatre domaines, chacun relié à un bénéfice concret pour les équipes et les familles. Le périmètre exact est précisé lors de la démonstration.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g) => (
            <article key={g.title} className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center"><Icon name={g.icon} /></div>
                <h3 className="text-xl font-bold text-[#0F1C3F]">{g.title}</h3>
              </div>
              <ul className="space-y-4">
                {g.items.map(([t, d]) => (
                  <li key={t} className="flex gap-3"><Icon name="check" size={18} className="text-[#10B981] mt-1 shrink-0" /><span><strong className="text-[#0F1C3F]">{t}</strong><span className="text-[#475569]"> – {d}</span></span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-14 text-center"><a href="#demo" className="btn btn-primary">Demander une démonstration</a></div>
      </div>
    </section>
  );
}
