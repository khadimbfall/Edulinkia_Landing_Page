import { lazy, Suspense, useEffect, useState } from "react";
const Admin = lazy(() => import("./components/Admin"));
import LegalPage from "./components/LegalPage";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductPreview from "./components/ProductPreview";
import Problems from "./components/Problems";
import Scenario from "./components/Scenario";
import Differentiators from "./components/Differentiators";
import Features from "./components/Features";
import AISection from "./components/AISection";
import Security from "./components/Security";
import FAQSection from "./components/FAQSection";
import DemoForm from "./components/DemoForm";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import LegalDialog from "./components/LegalDialog";

export default function App() {
  const [route, setRoute] = useState(() => location.hash);
  const admin = route.startsWith("#/equipe");
  useEffect(() => {
    const h = () => { setRoute(location.hash); if (location.hash.startsWith("#/")) window.scrollTo(0, 0); };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  if (route === "#/confidentialite") return <LegalPage doc="confidentialite" />;
  if (route === "#/cookies") return <LegalPage doc="cookies" />;
  if (admin) return <Suspense fallback={<p role="status" className="p-8">Chargement…</p>}><Admin /></Suspense>;
  return (
    <div className="min-h-screen">
      <Header />
      <main id="contenu">
        <Hero />
        <ProductPreview />
        <Problems />
        <Scenario />
        <Differentiators />
        <Features />
        <AISection />
        <Security />
        <FAQSection />
        <DemoForm />
      </main>
      <Footer />
      <LegalDialog />
      <CookieBanner />
    </div>
  );
}
