import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-67f49d33/health", (c) => {
  return c.json({ status: "ok" });
});

const P = "/make-server-67f49d33";
const admin = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROLES = ["Chef d'établissement / Directeur", "Adjoint de direction", "Enseignant", "Personnel administratif", "Autre"];
const TYPES = ["", "École primaire", "Collège", "Lycée", "Lycée professionnel", "Centre de formation", "Autre"];

// ---------- Demande de démonstration (public) ----------
app.post(`${P}/demo-requests`, async (c) => {
  let b: Record<string, unknown>;
  try { b = await c.req.json(); } catch { return c.json({ error: "Requête invalide." }, 400); }

  // Champ piège anti-robots : on répond OK sans rien enregistrer.
  if (b.website) return c.json({ ok: true });

  const d = {
    name: clean(b.name, 120), email: clean(b.email, 200).toLowerCase(), phone: clean(b.phone, 30), school: clean(b.school, 200),
    role: clean(b.role, 80), schoolType: clean(b.schoolType, 60), message: clean(b.message, 2000),
  };
  const errors: Record<string, string> = {};
  if (d.name.length < 2) errors.name = "Nom requis.";
  if (!EMAIL.test(d.email)) errors.email = "E-mail invalide.";
  if (d.phone && !/^\+?[0-9 .()-]{9,20}$/.test(d.phone)) errors.phone = "Téléphone invalide.";
  if (d.school.length < 2) errors.school = "Établissement requis.";
  if (!ROLES.includes(d.role)) errors.role = "Fonction invalide.";
  if (!TYPES.includes(d.schoolType)) errors.schoolType = "Type invalide.";
  if (b.consent !== true) errors.consent = "Consentement requis.";
  if (Object.keys(errors).length) return c.json({ error: "Validation", errors }, 422);

  // Limitation : 5 demandes par heure et par adresse IP.
  const ip = (c.req.header("x-forwarded-for") || "unknown").split(",")[0].trim();
  const rlKey = `rl:${ip}`;
  const now = Date.now();
  const recent = ((await kv.get(rlKey)) as number[] | null || []).filter((t) => now - t < 3_600_000);
  if (recent.length >= 5) return c.json({ error: "Trop de demandes." }, 429);
  await kv.set(rlKey, [...recent, now]);

  const id = crypto.randomUUID();
  await kv.set(`demo_request:${String(now).padStart(15, "0")}:${id}`, {
    id, ...d, consent: true, status: "new", createdAt: new Date(now).toISOString(),
  });
  return c.json({ ok: true, id }, 201);
});

// ---------- Utilisateurs (équipe EDULINKIA) ----------
async function requireAdmin(c: any) {
  const token = (c.req.header("Authorization") || "").replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await admin().auth.getUser(token);
  if (error || !data.user) return null;
  const rec = await kv.get(`admin:${data.user.id}`);
  return rec ? data.user : null;
}

// Création du tout premier administrateur : uniquement tant qu'aucun n'existe.
app.post(`${P}/auth/bootstrap`, async (c) => {
  const existing = await kv.getByPrefix("admin:");
  if (existing.length > 0) return c.json({ error: "Un administrateur existe déjà." }, 403);
  const { email, password } = await c.req.json().catch(() => ({}));
  if (!EMAIL.test(clean(email, 200)) || clean(password, 200).length < 10) return c.json({ error: "E-mail valide et mot de passe d'au moins 10 caractères requis." }, 422);
  const { data, error } = await admin().auth.admin.createUser({ email: clean(email, 200), password, email_confirm: true });
  if (error || !data.user) return c.json({ error: error?.message || "Création impossible." }, 400);
  await kv.set(`admin:${data.user.id}`, { id: data.user.id, email: data.user.email, createdAt: new Date().toISOString() });
  return c.json({ ok: true }, 201);
});

app.get(`${P}/auth/status`, async (c) => c.json({ needsBootstrap: (await kv.getByPrefix("admin:")).length === 0 }));

app.get(`${P}/admin/me`, async (c) => {
  const u = await requireAdmin(c);
  return u ? c.json({ id: u.id, email: u.email }) : c.json({ error: "Non autorisé." }, 401);
});

app.get(`${P}/admin/users`, async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: "Non autorisé." }, 401);
  return c.json({ users: await kv.getByPrefix("admin:") });
});

app.post(`${P}/admin/users`, async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: "Non autorisé." }, 401);
  const { email, password } = await c.req.json().catch(() => ({}));
  if (!EMAIL.test(clean(email, 200)) || clean(password, 200).length < 10) return c.json({ error: "E-mail valide et mot de passe d'au moins 10 caractères requis." }, 422);
  const { data, error } = await admin().auth.admin.createUser({ email: clean(email, 200), password, email_confirm: true });
  if (error || !data.user) return c.json({ error: error?.message || "Création impossible." }, 400);
  await kv.set(`admin:${data.user.id}`, { id: data.user.id, email: data.user.email, createdAt: new Date().toISOString() });
  return c.json({ ok: true }, 201);
});

app.delete(`${P}/admin/users/:id`, async (c) => {
  const me = await requireAdmin(c);
  if (!me) return c.json({ error: "Non autorisé." }, 401);
  const id = c.req.param("id");
  if (id === me.id) return c.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, 400);
  await admin().auth.admin.deleteUser(id);
  await kv.del(`admin:${id}`);
  return c.json({ ok: true });
});

// ---------- Gestion des demandes (équipe) ----------
app.get(`${P}/admin/requests`, async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: "Non autorisé." }, 401);
  const items = (await kv.getByPrefix("demo_request:")) as { createdAt: string }[];
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return c.json({ requests: items });
});

app.patch(`${P}/admin/requests/:id`, async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: "Non autorisé." }, 401);
  const { status } = await c.req.json().catch(() => ({}));
  if (!["new", "contacted", "closed"].includes(status)) return c.json({ error: "Statut invalide." }, 422);
  const items = (await kv.getByPrefix("demo_request:")) as { id: string; createdAt: string }[];
  const it = items.find((x) => x.id === c.req.param("id"));
  if (!it) return c.json({ error: "Introuvable." }, 404);
  await kv.set(`demo_request:${String(Date.parse(it.createdAt)).padStart(15, "0")}:${it.id}`, { ...it, status });
  return c.json({ ok: true });
});

app.delete(`${P}/admin/requests/:id`, async (c) => {
  if (!(await requireAdmin(c))) return c.json({ error: "Non autorisé." }, 401);
  const items = (await kv.getByPrefix("demo_request:")) as { id: string; createdAt: string }[];
  const it = items.find((x) => x.id === c.req.param("id"));
  if (!it) return c.json({ error: "Introuvable." }, 404);
  await kv.del(`demo_request:${String(Date.parse(it.createdAt)).padStart(15, "0")}:${it.id}`);
  return c.json({ ok: true });
});

Deno.serve(app.fetch);