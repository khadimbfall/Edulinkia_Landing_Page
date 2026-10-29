import { useRef, useState } from "react";
import Icon from "./Icons";

type Role = "direction" | "enseignants" | "parents" | "eleves";

const tabs: { id: Role; label: string; icon: string; title: string; benefit: string; points: string[] }[] = [
  { id: "direction", label: "Direction", icon: "building", title: "Espace Direction", benefit: "Une vue synthétique de l'établissement pour repérer rapidement les classes et les situations qui demandent de l'attention.", points: ["Indicateurs d'assiduité par classe", "Suivi des absences et des tendances", "Informations utiles au pilotage"] },
  { id: "enseignants", label: "Enseignants", icon: "book", title: "Espace Enseignants", benefit: "L'appel, les absences et les évaluations au même endroit, pour consacrer moins de temps à l'administratif.", points: ["Appel et suivi des absences", "Évaluations et suivi des classes", "Informations utiles au suivi pédagogique"] },
  { id: "parents", label: "Parents", icon: "heart", title: "Espace Parents", benefit: "Les responsables légaux accèdent aux informations scolaires de leur enfant et sont informés plus simplement.", points: ["Absences et évaluations", "Notifications", "Communication avec l'établissement"] },
  { id: "eleves", label: "Élèves", icon: "cap", title: "Espace Élèves", benefit: "Chaque élève retrouve son emploi du temps, ses évaluations et ses documents pour suivre sa progression.", points: ["Emploi du temps", "Évaluations et progression", "Documents"] },
];

export default function ProductPreview() {
  const [active, setActive] = useState<Role>("direction");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = tabs.find((t) => t.id === active)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length];
    setActive(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <section id="apercu" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-5">Découvrir la plateforme</p>
          <h2 className="h2 mb-6">Un espace adapté à chaque profil</h2>
          <p className="lead mx-auto">Explorez l'aperçu interactif : chaque profil dispose d'une vue pensée pour ses besoins. Les données présentées sont fictives.</p>
        </div>

        <div role="tablist" aria-label="Espaces de la plateforme" className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 bg-[#F1F5F9] rounded-2xl">
            {tabs.map((t, i) => (
              <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" id={`tab-${t.id}`} aria-selected={active === t.id} aria-controls={`panel-${t.id}`} tabIndex={active === t.id ? 0 : -1} onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${active === t.id ? "bg-white text-[#2563EB] shadow-sm" : "text-[#475569] hover:text-[#0F1C3F]"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Icon name={t.icon} size={16} />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0} className="grid lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-10 items-stretch">
          <div className="card p-8 flex flex-col">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6"><Icon name={current.icon} /></div>
            <h3 className="text-2xl font-extrabold text-[#0F1C3F] mb-4">{current.title}</h3>
            <p className="text-[#475569] leading-relaxed mb-6">{current.benefit}</p>
            <ul className="space-y-3.5 mb-8">
              {current.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[#334155]"><Icon name="check" size={18} className="text-[#10B981] mt-0.5 shrink-0" />{p}</li>
              ))}
            </ul>
            <a href="#demo" className="btn btn-primary mt-auto self-start">Demander une démonstration</a>
          </div>

          <figure className="min-w-0">
            <div className="rounded-2xl border border-[#CBD5E1] bg-white shadow-lg overflow-hidden">
              {active === "direction" && <DirectionView />}
              {active === "enseignants" && <TeacherView />}
              {active === "parents" && <ParentView />}
              {active === "eleves" && <StudentView />}
            </div>
            <figcaption className="mt-4 text-xs text-[#64748B] text-center">Aperçu interactif – exemple d'interface avec des données fictives.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- Éléments partagés ---------- */
function Bar({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
      <span className="text-sm font-bold text-[#0F1C3F]" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</span>
      {children}
    </div>
  );
}
const Stat = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
  <div className="rounded-xl border border-[#E2E8F0] p-3 bg-white">
    <div className="text-xs text-[#64748B]">{label}</div>
    <div className="text-xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", color: tone }}>{value}</div>
  </div>
);

/* ---------- Direction ---------- */
const classes = [
  { name: "6e A", pct: 97, abs: 1, late: 0, note: "Assiduité stable sur la période." },
  { name: "5e B", pct: 89, abs: 4, late: 2, note: "Hausse des absences en début de semaine." },
  { name: "4e C", pct: 93, abs: 2, late: 1, note: "Légère baisse par rapport à la période précédente." },
  { name: "3e A", pct: 85, abs: 5, late: 3, note: "Plusieurs situations à examiner avec l'équipe." },
];

export function DirectionView({ compact = false }: { compact?: boolean }) {
  const [sel, setSel] = useState(1);
  const c = classes[sel];
  return (
    <div>
      <Bar title="Direction – Vue d'ensemble"><span className="text-xs text-[#64748B]">Semaine en cours</span></Bar>
      <div className="p-5">
        <div className={`grid gap-3 mb-5 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
          <Stat label="Élèves" value="480" tone="#2563EB" />
          <Stat label="Assiduité" value="91 %" tone="#10B981" />
          <Stat label="Absences du jour" value="12" tone="#B45309" />
          {!compact && <Stat label="À examiner" value="3" tone="#BE123C" />}
        </div>
        <div className="text-xs font-semibold text-[#64748B] mb-2">Assiduité par classe – sélectionnez une classe</div>
        <div className="space-y-1.5 mb-4">
          {classes.map((k, i) => (
            <button key={k.name} type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 border text-left transition-colors ${sel === i ? "border-[#2563EB] bg-[#EFF6FF]" : "border-transparent hover:bg-[#F8FAFC]"}`}>
              <span className="w-10 text-sm font-semibold text-[#0F1C3F]">{k.name}</span>
              <span className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden"><span className="block h-full rounded-full bg-[#2563EB]" style={{ width: `${k.pct}%` }} /></span>
              <span className="w-10 text-right text-sm text-[#334155]">{k.pct} %</span>
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm text-[#334155]" aria-live="polite">
          <strong className="text-[#0F1C3F]">{c.name}</strong> – {c.abs} absence{c.abs > 1 ? "s" : ""}, {c.late} retard{c.late > 1 ? "s" : ""} aujourd'hui. {c.note}
        </div>
      </div>
    </div>
  );
}

/* ---------- Enseignants ---------- */
type St = "present" | "absent" | "retard";
const next: Record<St, St> = { present: "absent", absent: "retard", retard: "present" };
const stLabel: Record<St, string> = { present: "Présent", absent: "Absent", retard: "En retard" };
const stStyle: Record<St, string> = { present: "bg-[#D1FAE5] text-[#065F46]", absent: "bg-[#FEE2E2] text-[#991B1B]", retard: "bg-[#FEF3C7] text-[#92400E]" };

function TeacherView() {
  const [list, setList] = useState<{ n: string; s: St }[]>([
    { n: "Élodie M.", s: "present" }, { n: "Karim B.", s: "absent" }, { n: "Sasha D.", s: "present" }, { n: "Inès L.", s: "retard" }, { n: "Noah R.", s: "present" },
  ]);
  const [saved, setSaved] = useState(false);
  const cnt = (s: St) => list.filter((x) => x.s === s).length;
  return (
    <div>
      <Bar title="Enseignants – Appel 4e B, 8 h 00" />
      <div className="p-5">
        <p className="text-xs text-[#64748B] mb-3">Cliquez sur un élève pour changer son statut.</p>
        <ul className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl mb-4">
          {list.map((x, i) => (
            <li key={x.n} className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-[#0F1C3F]">{x.n}</span>
              <button type="button" onClick={() => { setList((l) => l.map((y, j) => (j === i ? { ...y, s: next[y.s] } : y))); setSaved(false); }} className={`px-3 min-h-[32px] rounded-full text-xs font-semibold ${stStyle[x.s]}`} aria-label={`${x.n} : ${stLabel[x.s]}. Changer le statut`}>{stLabel[x.s]}</button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-[#334155]">{cnt("present")} présents · {cnt("absent")} absent · {cnt("retard")} en retard</span>
          <button type="button" className="btn btn-primary !py-2 text-sm" onClick={() => setSaved(true)}>Valider l'appel</button>
        </div>
        <p className="mt-3 text-sm text-[#065F46] min-h-[1.25rem]" role="status">{saved ? "Appel validé dans cet aperçu. Aucune donnée réelle n'est enregistrée." : ""}</p>
      </div>
    </div>
  );
}

/* ---------- Parents ---------- */
const evals = [
  { m: "Mathématiques", d: "Hier", n: "16/20", avg: "12,4", c: "Bon travail, résultats réguliers." },
  { m: "Français", d: "Lundi", n: "13/20", avg: "11,8", c: "Pensez à relire la conclusion." },
  { m: "Histoire-Géographie", d: "Vendredi", n: "15/20", avg: "12,9", c: "Très bonne participation." },
];
function ParentView() {
  const [sel, setSel] = useState(0);
  const e = evals[sel];
  return (
    <div>
      <Bar title="Parents – Suivi de Chloé (exemple)" />
      <div className="p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-[#64748B] mb-2">Évaluations récentes</div>
          <div className="space-y-1.5">
            {evals.map((x, i) => (
              <button key={x.m} type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className={`w-full flex justify-between items-center rounded-lg border px-3 py-2.5 text-left ${sel === i ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}>
                <span><span className="block text-sm font-semibold text-[#0F1C3F]">{x.m}</span><span className="block text-xs text-[#64748B]">{x.d}</span></span>
                <span className="font-extrabold text-[#2563EB]" style={{ fontFamily: "'Outfit', sans-serif" }}>{x.n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm text-[#334155]" aria-live="polite">
            <div className="font-bold text-[#0F1C3F] mb-1">{e.m}</div>
            Note : {e.n} · Moyenne de la classe : {e.avg}
            <div className="mt-1 text-[#475569]">« {e.c} »</div>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-2"><Icon name="bell" size={14} />Notifications</div>
            <ul className="text-sm text-[#334155] space-y-1.5">
              <li>Absence signalée le 12/03 – à justifier</li>
              <li>Nouvelle évaluation publiée en mathématiques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Élèves ---------- */
const days: Record<string, { h: string; m: string; r: string }[]> = {
  Lun: [{ h: "8 h 00", m: "Mathématiques", r: "B12" }, { h: "10 h 00", m: "Français", r: "A04" }, { h: "14 h 00", m: "Histoire-Géo", r: "C07" }],
  Mar: [{ h: "8 h 00", m: "Anglais", r: "A10" }, { h: "11 h 00", m: "SVT", r: "Labo 2" }],
  Mer: [{ h: "9 h 00", m: "Éducation physique", r: "Gymnase" }, { h: "11 h 00", m: "Technologie", r: "D01" }],
  Jeu: [{ h: "8 h 00", m: "Français", r: "A04" }, { h: "10 h 00", m: "Mathématiques", r: "B12" }, { h: "15 h 00", m: "Arts plastiques", r: "E03" }],
  Ven: [{ h: "9 h 00", m: "Physique-Chimie", r: "Labo 1" }, { h: "13 h 00", m: "Anglais", r: "A10" }],
};
function StudentView() {
  const [day, setDay] = useState("Lun");
  return (
    <div>
      <Bar title="Élèves – Mon espace (exemple)" />
      <div className="p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-[#64748B] mb-2">Emploi du temps</div>
          <div className="flex gap-1 mb-3" role="group" aria-label="Choisir un jour">
            {Object.keys(days).map((d) => (
              <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)} className={`flex-1 min-h-[36px] rounded-lg text-xs font-semibold ${day === d ? "bg-[#2563EB] text-white" : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"}`}>{d}</button>
            ))}
          </div>
          <ul className="space-y-1.5" aria-live="polite">
            {days[day].map((c) => (
              <li key={c.h + c.m} className="flex items-center gap-3 rounded-lg bg-[#EFF6FF] px-3 py-2 text-sm">
                <span className="w-14 font-semibold text-[#1E3A8A]">{c.h}</span><span className="flex-1 text-[#0F1C3F]">{c.m}</span><span className="text-xs text-[#64748B]">{c.r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-[#E2E8F0] p-3">
            <div className="text-xs font-semibold text-[#64748B] mb-2">Progression – Mathématiques</div>
            <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden mb-1.5"><div className="h-full bg-[#10B981] rounded-full" style={{ width: "68%" }} /></div>
            <div className="text-xs text-[#475569]">Dernières évaluations : 12, 14, 16 sur 20</div>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-2"><Icon name="file" size={14} />Documents</div>
            <ul className="text-sm text-[#334155] space-y-1.5"><li>Cours – Les fractions (PDF)</li><li>Fiche de révision – Chapitre 4</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}
