import Icon from "./Icons";

const items = [
  { icon: "layers", problem: "Des informations scolaires dispersées entre plusieurs outils.", answer: "EDULINKIA rassemble le suivi scolaire dans un environnement unique, avec des vues adaptées à chaque profil." },
  { icon: "clock", problem: "Un suivi des absences qui nécessite de nombreuses manipulations.", answer: "L'appel et les absences sont enregistrés une fois, puis consultables par les personnes habilitées." },
  { icon: "chat", problem: "Une communication avec les familles qui peut manquer de fluidité.", answer: "Des notifications et des espaces dédiés facilitent la circulation des informations scolaires autorisées." },
  { icon: "chart", problem: "Des informations disponibles, mais difficiles à transformer en actions de suivi.", answer: "Des indicateurs et des aides à l'analyse mettent en évidence les situations à examiner par les équipes." },
];

export default function Problems() {
  return (
    <section id="quotidien" className="py-16 sm:py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-5">Au quotidien</p>
          <h2 className="h2 mb-6">Les difficultés du quotidien scolaire</h2>
          <p className="lead">Chaque établissement a son organisation. Voici des situations fréquemment évoquées par les équipes éducatives, et la réponse qu'EDULINKIA cherche à y apporter.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it) => (
            <article key={it.problem} className="card p-8">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center"><Icon name={it.icon} /></div>
                <h3 className="text-lg font-bold text-[#0F1C3F] leading-snug pt-1">{it.problem}</h3>
              </div>
              <div className="flex items-start gap-4 pt-5 border-t border-[#E2E8F0]">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#D1FAE5] text-[#047857] flex items-center justify-center"><Icon name="check" /></div>
                <p className="text-[#334155] leading-relaxed pt-1"><span className="font-bold text-[#047857]">Avec EDULINKIA : </span>{it.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
