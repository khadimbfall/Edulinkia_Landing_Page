import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Logo from "./Logo";
import { api, supabase } from "../lib/supabase";

type Req = { id: string; name: string; email: string; phone?: string; school: string; role: string; schoolType: string; message: string; consent?: boolean; status: "new" | "contacted" | "closed"; createdAt: string };
type User = { id: string; email: string; createdAt: string };
const statusLabel = { new: "Nouvelle", contacted: "Contactée", closed: "Clôturée" } as const;
const field = "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#0F1C3F] focus:outline-none focus:ring-2 focus:ring-[#2563EB]";

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    api<{ needsBootstrap: boolean }>("/auth/status").then((r) => setNeedsBootstrap(r.needsBootstrap)).catch(() => {});
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAuthorized(null); return; }
    api("/admin/me", {}, session.access_token).then(() => setAuthorized(true)).catch(() => setAuthorized(false));
  }, [session]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#accueil" aria-label="Retour au site"><Logo className="h-9" /></a>
          <div className="flex items-center gap-3 text-sm">
            <a href="#accueil" className="text-[#2563EB] underline">Retour au site</a>
            {session && <button type="button" className="btn btn-secondary !py-1.5 text-sm" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        {!ready ? <p role="status">Chargement…</p>
          : !session ? <Login needsBootstrap={needsBootstrap} onBootstrapped={() => setNeedsBootstrap(false)} />
          : authorized === null ? <p role="status">Vérification des droits…</p>
          : authorized === false ? <p className="card p-6 text-[#991B1B]" role="alert">Ce compte n'a pas accès à l'espace équipe.</p>
          : <Dashboard token={session.access_token} selfId={session.user.id} />}
      </main>
    </div>
  );
}

function Login({ needsBootstrap, onBootstrapped }: { needsBootstrap: boolean; onBootstrapped: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      if (needsBootstrap) { await api("/auth/bootstrap", { method: "POST", body: JSON.stringify({ email, password }) }); onBootstrapped(); }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error("Identifiants incorrects.");
    } catch (x) { setErr(x instanceof Error ? x.message : "Erreur."); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="card p-7 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-extrabold text-[#0F1C3F]">{needsBootstrap ? "Créer le premier compte administrateur" : "Espace équipe EDULINKIA"}</h1>
      {needsBootstrap && <p className="text-sm text-[#475569]">Aucun administrateur n'existe encore. Ce compte sera le premier ; ensuite, seuls les administrateurs pourront en créer d'autres.</p>}
      <div><label htmlFor="a-email" className="block text-sm font-semibold mb-1.5">Adresse e-mail</label><input id="a-email" type="email" autoComplete="username" required className={field} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label htmlFor="a-pass" className="block text-sm font-semibold mb-1.5">Mot de passe{needsBootstrap && " (10 caractères minimum)"}</label><input id="a-pass" type="password" autoComplete={needsBootstrap ? "new-password" : "current-password"} required minLength={needsBootstrap ? 10 : 1} className={field} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <p role="alert" className="text-sm text-[#B91C1C] min-h-[1.25rem]">{err}</p>
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Veuillez patienter…" : needsBootstrap ? "Créer le compte" : "Se connecter"}</button>
    </form>
  );
}

function Dashboard({ token, selfId }: { token: string; selfId: string }) {
  const [tab, setTab] = useState<"requests" | "users">("requests");
  return (
    <div>
      <div className="flex gap-2 mb-6" role="group" aria-label="Sections">
        {(["requests", "users"] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)} className={`btn !py-2 text-sm ${tab === t ? "btn-primary" : "btn-secondary"}`}>{t === "requests" ? "Demandes de démonstration" : "Utilisateurs"}</button>
        ))}
      </div>
      {tab === "requests" ? <Requests token={token} /> : <Users token={token} selfId={selfId} />}
    </div>
  );
}

const roleOrDash = (v?: string) => (v && v.trim() ? v : "Non renseigné");

function exportCsv(items: Req[]) {
  const head = ["Date", "Nom et prénom", "E-mail", "Téléphone", "Établissement", "Fonction", "Type d'établissement", "Message", "Consentement", "Statut"];
  const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = items.map((r) => [new Date(r.createdAt).toLocaleString("fr-FR"), r.name, r.email, r.phone || "", r.school, r.role, r.schoolType || "", r.message || "", r.consent === false ? "Non" : "Oui", statusLabel[r.status]].map(q).join(";"));
  const blob = new Blob(["\uFEFF" + [head.map(q).join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `demandes-demonstration-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function Requests({ token }: { token: string }) {
  const [items, setItems] = useState<Req[] | null>(null);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Req["status"]>("all");
  const load = useCallback(() => api<{ requests: Req[] }>("/admin/requests", {}, token).then((r) => setItems(r.requests)).catch((e) => setErr(e.message)), [token]);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: string) => { await api(`/admin/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }, token).catch((e) => setErr(e.message)); load(); };
  const remove = async (id: string) => { if (!confirm("Supprimer définitivement cette demande ?")) return; await api(`/admin/requests/${id}`, { method: "DELETE" }, token).catch((e) => setErr(e.message)); load(); };

  if (err) return <p role="alert" className="text-[#B91C1C]">{err}</p>;
  if (!items) return <p role="status">Chargement…</p>;

  const q = query.trim().toLowerCase();
  const shown = items.filter((r) => (filter === "all" || r.status === filter) && (!q || [r.name, r.email, r.phone, r.school, r.role, r.schoolType, r.message].some((v) => (v || "").toLowerCase().includes(q))));
  const count = (st: Req["status"]) => items.filter((r) => r.status === st).length;

  return (
    <div>
      <p className="text-sm text-[#475569] mb-4" role="status">
        {items.length} demande{items.length > 1 ? "s" : ""} au total · {count("new")} nouvelle{count("new") > 1 ? "s" : ""} · {count("contacted")} contactée{count("contacted") > 1 ? "s" : ""} · {count("closed")} clôturée{count("closed") > 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="r-search" className="sr-only">Rechercher une demande</label>
          <input id="r-search" type="search" placeholder="Rechercher (nom, e-mail, établissement…)" className={field} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="r-filter" className="sr-only">Filtrer par statut</label>
          <select id="r-filter" className={field} value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">Tous les statuts</option>
            {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-secondary" disabled={!shown.length} onClick={() => exportCsv(shown)}>Exporter en CSV</button>
      </div>

      {!shown.length ? (
        <p className="card p-6 text-[#475569]">{items.length ? "Aucune demande ne correspond à votre recherche." : "Aucune demande pour le moment."}</p>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#0F1C3F]">{r.name}</h3>
                  <p className="text-sm text-[#64748B]">Reçue le {new Date(r.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-[#334155]" htmlFor={`st-${r.id}`}>Statut</label>
                  <select id={`st-${r.id}`} value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="min-h-[40px] rounded-lg border border-[#CBD5E1] px-2 text-sm">
                    {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button type="button" onClick={() => remove(r.id)} className="min-h-[40px] px-3 text-sm text-[#B91C1C] underline">Supprimer</button>
                </div>
              </div>
              <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                <Item label="Nom et prénom">{r.name}</Item>
                <Item label="E-mail professionnel"><a className="text-[#2563EB] underline break-all" href={`mailto:${r.email}`}>{r.email}</a></Item>
                <Item label="Téléphone">{r.phone ? <a className="text-[#2563EB] underline" href={`tel:${r.phone.replace(/[^+0-9]/g, "")}`}>{r.phone}</a> : "Non renseigné"}</Item>
                <Item label="Établissement ou organisation">{r.school}</Item>
                <Item label="Fonction">{roleOrDash(r.role)}</Item>
                <Item label="Type d'établissement">{roleOrDash(r.schoolType)}</Item>
                <Item label="Consentement">{r.consent === false ? "Non" : "Accepté (contact au sujet de la demande)"}</Item>
              </dl>
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#64748B] mb-1">Message</div>
                <p className="text-[#334155] whitespace-pre-wrap">{r.message || "Aucun message."}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{label}</dt>
      <dd className="text-[#0F1C3F] mt-0.5">{children}</dd>
    </div>
  );
}

function Users({ token, selfId }: { token: string; selfId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const load = useCallback(() => api<{ users: User[] }>("/admin/users", {}, token).then((r) => setUsers(r.users)).catch((e) => setMsg(e.message)), [token]);
  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    try { await api("/admin/users", { method: "POST", body: JSON.stringify({ email, password }) }, token); setEmail(""); setPassword(""); setMsg("Utilisateur créé."); load(); }
    catch (x) { setMsg(x instanceof Error ? x.message : "Erreur."); }
  };
  const del = async (u: User) => { if (!confirm(`Supprimer le compte ${u.email} ?`)) return; try { await api(`/admin/users/${u.id}`, { method: "DELETE" }, token); load(); } catch (x) { setMsg(x instanceof Error ? x.message : "Erreur."); } };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={add} className="card p-6 space-y-4 self-start">
        <h2 className="text-lg font-bold text-[#0F1C3F]">Ajouter un utilisateur</h2>
        <div><label htmlFor="u-email" className="block text-sm font-semibold mb-1.5">Adresse e-mail</label><input id="u-email" type="email" required className={field} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label htmlFor="u-pass" className="block text-sm font-semibold mb-1.5">Mot de passe provisoire (10 caractères minimum)</label><input id="u-pass" type="password" required minLength={10} autoComplete="new-password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <p role="status" className="text-sm text-[#334155] min-h-[1.25rem]">{msg}</p>
        <button className="btn btn-primary w-full">Créer le compte</button>
      </form>
      <div className="card p-6">
        <h2 className="text-lg font-bold text-[#0F1C3F] mb-4">Utilisateurs de l'espace équipe</h2>
        <ul className="divide-y divide-[#E2E8F0]">
          {users.map((u) => (
            <li key={u.id} className="py-3 flex items-center justify-between gap-3">
              <span className="text-[#0F1C3F] break-all">{u.email}{u.id === selfId && <span className="text-xs text-[#64748B]"> (vous)</span>}</span>
              {u.id !== selfId && <button type="button" onClick={() => del(u)} className="min-h-[40px] px-3 text-sm text-[#B91C1C] underline">Supprimer</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
