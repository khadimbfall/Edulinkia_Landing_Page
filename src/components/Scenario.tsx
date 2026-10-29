import Icon from "./Icons";

const steps = [
  { icon: "users", title: "L'enseignant effectue l'appel", text: "Les présences, absences et retards sont enregistrés depuis l'espace enseignant.", status: "Fonction de base", tone: "bg-[#DBEAFE] text-[#1E3A8A]" },
  { icon: "bell", title: "Les informations sont mises à jour", text: "Les données disponibles sont actualisées et les notifications configurées peuvent être envoyées aux familles.", status: "Selon configuration", tone: "bg-[#FEF3C7] text-[#92400E]" },
  { icon: "chart", title: "La direction consulte la vue consolidée", text: "Les absences et indicateurs sont regroupés pour suivre l'établissement, classe par classe.", status: "Fonction de base", tone: "bg-[#DBEAFE] text-[#1E3A8A]" },
  { icon: "heart", title: "L'équipe décide des suites à donner", text: "Les personnes habilitées examinent les situations qui demandent de l'attention et choisissent l'accompagnement approprié.", status: "Décision humaine", tone: "bg-[#D1FAE5] text-[#065F46]" },
];

export default function Scenario() {
  return (
    <section id="fonctionnement" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-5">Comprendre le fonctionnement</p>
          <h2 className="h2 mb-6">Comment fonctionne EDULINKIA ?</h2>
          <p className="lead">Un scénario concret : de l'appel en classe à l'accompagnement d'un élève, en quatre étapes.</p>
        </div>
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => (
            <li key={s.title} className="card p-7 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#2563EB] text-white flex items-center justify-center"><Icon name={s.icon} /></div>
                <span className="text-3xl font-extrabold text-[#CBD5E1]" style={{ fontFamily: "'Outfit', sans-serif" }} aria-hidden="true">{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F1C3F] mb-3"><span className="sr-only">Étape {i + 1} : </span>{s.title}</h3>
              <p className="text-[#475569] leading-relaxed mb-5">{s.text}</p>
              <span className={`mt-auto self-start text-xs font-semibold px-2.5 py-1 rounded-full ${s.tone}`}>{s.status}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-[#64748B] max-w-3xl">Les mentions indiquent le niveau de disponibilité : fonction de base de la plateforme, fonction dépendant de la configuration de l'établissement, ou étape relevant du jugement des professionnels. Les modalités précises sont détaillées lors de la démonstration.</p>
      </div>
    </section>
  );
}
