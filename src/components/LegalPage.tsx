import Logo from "./Logo";
import { SITE } from "../lib/site";

const mail = <a className="text-[#2563EB] underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>;

function Privacy() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p>Cette page explique comment EDULINKIA traite les informations transmises via ce site, notamment le formulaire de demande de démonstration.</p>

      <h2>Responsable du traitement</h2>
      <p>EDULINKIA. Contact : {mail} ou {SITE.phone}.</p>

      <h2>Données collectées</h2>
      <p>Lorsque vous demandez une démonstration, nous collectons : nom et prénom, adresse e-mail professionnelle, numéro de téléphone (facultatif), établissement ou organisation, fonction, type d'établissement (facultatif) et message (facultatif). Nous enregistrons aussi la date de la demande et votre consentement.</p>
      <p>Ce formulaire n'est pas destiné à recueillir des données d'élèves. Merci de ne pas en saisir dans le champ « Message ».</p>

      <h2>Finalités et base légale</h2>
      <p>Ces informations servent uniquement à répondre à votre demande, vous recontacter et organiser une démonstration. La base légale est votre consentement et, le cas échéant, les mesures précontractuelles prises à votre demande. Elles ne sont ni vendues ni utilisées pour des décisions automatisées.</p>

      <h2>Destinataires et hébergement</h2>
      <p>Les demandes sont accessibles aux seules personnes habilitées de l'équipe EDULINKIA, via un espace protégé par identifiant. Elles sont stockées via le service Supabase, qui agit comme sous-traitant technique pour l'hébergement des données. Les données sont hébergées en France, dans la région de Paris.</p>

      <h2>Durée de conservation</h2>
      <p>Les demandes sont conservées le temps nécessaire à leur traitement, puis au maximum 3 ans après le dernier échange avec vous, sauf demande de suppression anticipée.</p>

      <h2>Vos droits</h2>
      <p>Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation ou l'opposition à leur traitement, et retirer votre consentement à tout moment, en écrivant à {mail}. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).</p>
    </>
  );
}

function Cookies() {
  return (
    <>
      <h1>Politique de cookies</h1>
      <p>Ce site n'utilise aucun cookie publicitaire ni outil de mesure d'audience.</p>

      <h2>Stockage local strictement nécessaire</h2>
      <p>Le site utilise le stockage local de votre navigateur pour deux usages techniques, qui ne nécessitent pas de consentement :</p>
      <ul>
        <li><strong>edulinkia_cookie_consent</strong> : mémorise vos choix concernant les cookies.</li>
        <li><strong>edulinkia_demo_last_submit</strong> : limite les envois répétés du formulaire de démonstration.</li>
      </ul>
      <p>Si vous vous connectez à l'espace équipe, une session de connexion est également conservée dans votre navigateur.</p>

      <h2>Ressources externes</h2>
      <p>Les polices de caractères sont chargées depuis Google Fonts : votre navigateur peut transmettre votre adresse IP à ce service pour les récupérer.</p>

      <h2>Modifier vos choix</h2>
      <p>Utilisez le lien « Gérer les cookies » en bas de page, ou supprimez les données du site dans les réglages de votre navigateur.</p>
    </>
  );
}

export default function LegalPage({ doc }: { doc: "confidentialite" | "cookies" }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#accueil" aria-label="Retour à l'accueil"><Logo className="h-9" /></a>
          <a href="#accueil" className="text-sm text-[#2563EB] underline">Retour au site</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12 text-[#334155] leading-relaxed [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#0F1C3F] [&_h1]:mb-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0F1C3F] [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_li]:mb-1">
        {doc === "confidentialite" ? <Privacy /> : <Cookies />}
      </main>
    </div>
  );
}
