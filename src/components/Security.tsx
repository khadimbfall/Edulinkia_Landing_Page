import Icon from "./Icons";
import { LegalLink } from "./LegalDialog";

const topics = [
  { icon: "users", title: "Accès selon les rôles", text: "Chaque profil n'accède qu'aux informations relevant de ses responsabilités." },
  { icon: "lock", title: "Protection des données personnelles", text: "Les données des élèves et des familles sont traitées dans le respect de la réglementation applicable." },
  { icon: "cap", title: "Données concernant les mineurs", text: "Une vigilance particulière est portée aux informations relatives aux élèves mineurs." },
  { icon: "file", title: "Finalités et conservation", text: "Les finalités des traitements et les durées de conservation sont détaillées dans la politique de confidentialité." },
  { icon: "users", title: "Droits des personnes", text: "Accès, rectification, effacement et autres droits peuvent être exercés auprès de l'équipe EDULINKIA." },
  { icon: "shield", title: "Sécurité des échanges et des accès", text: "Les mesures techniques et organisationnelles en place sont précisées sur demande." },
  { icon: "building", title: "Hébergement et sous-traitants", text: "Les demandes envoyées via ce site sont hébergées à Paris, en France, via Supabase, sous-traitant technique. Les informations pour le déploiement en établissement sont communiquées lors des échanges." },
  { icon: "spark", title: "Données et IA", text: "L'utilisation des données dans les fonctionnalités d'IA est encadrée par les finalités définies pour le service." },
];

export default function Security() {
  return (
    <section id="securite" className="on-dark py-16 sm:py-20 lg:py-28 text-white" style={{ background: "#0F1C3F" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow !text-[#93C5FD] mb-5">Confidentialité</p>
          <h2 className="h2 !text-white mb-6">Sécurité et protection des données</h2>
          <p className="text-lg leading-relaxed text-white/75">Les données scolaires sont sensibles. Voici les sujets que nous détaillons avec chaque établissement avant tout déploiement.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {topics.map((t) => (
            <article key={t.title} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <Icon name={t.icon} className="text-[#93C5FD] mb-4" />
              <h3 className="font-bold mb-2.5">{t.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{t.text}</p>
            </article>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <span className="text-white/60">Documents :</span>
          <LegalLink doc="privacy" className="underline underline-offset-4 text-white hover:text-[#93C5FD]" />
          <LegalLink doc="legal" className="underline underline-offset-4 text-white hover:text-[#93C5FD]" />
          <LegalLink doc="terms" className="underline underline-offset-4 text-white hover:text-[#93C5FD]" />
        </div>
      </div>
    </section>
  );
}
