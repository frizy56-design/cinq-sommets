// Fonction « coach » : relaie les demandes du jeu vers l'API Claude.
// La clé ANTHROPIC_API_KEY reste côté serveur. Seuls les membres connectés
// peuvent l'utiliser, dans la limite de 150 appels par jour et par joueur.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const MODEL = Deno.env.get("COACH_MODEL") ?? "claude-sonnet-5-5";
const MODEL_FAST = Deno.env.get("COACH_MODEL_FAST") ?? "claude-haiku-5-5";
const MAX_INPUT_CHARS = 200_000;

type Msg = { role: "user" | "assistant"; content: string };

function reply(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function toMessages(input: unknown): Msg[] | null {
  let list: Msg[];
  if (typeof input === "string") list = [{ role: "user", content: input }];
  else if (Array.isArray(input)) list = input as Msg[];
  else return null;
  const out: Msg[] = [];
  let total = 0;
  for (const m of list) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim();
    if (!content) return null;
    total += content.length;
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += "\n\n" + content;
    else out.push({ role: m.role, content });
  }
  if (!out.length || out[0].role !== "user" || out[out.length - 1].role !== "user") return null;
  if (total > MAX_INPUT_CHARS) return null;
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return reply(405, { code: "invalid_request" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
  const authHeader = req.headers.get("Authorization") ?? "";
  const sb = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData } = await sb.auth.getUser(authHeader.replace(/^Bearer\s+/i, ""));
  if (!userData?.user) return reply(401, { code: "session_expired" });

  const { data: isMember, error: memberError } = await sb.rpc("is_member");
  if (memberError || !isMember) return reply(403, { code: "not_granted" });

  let body: { input?: unknown; json?: boolean; tier?: string; ping?: boolean };
  try {
    body = await req.json();
  } catch {
    return reply(400, { code: "invalid_request" });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (body?.ping) return reply(200, { ok: Boolean(apiKey) });
  if (!apiKey) return reply(503, { code: "sampling_disabled" });

  const messages = toMessages(body?.input);
  if (!messages) return reply(400, { code: "invalid_request" });
  if (body.json) {
    messages[messages.length - 1].content +=
      "\n\nRéponds uniquement avec la valeur JSON demandée, sans texte avant ni après, sans bloc de code.";
  }

  const { data: allowed } = await sb.rpc("coach_take");
  if (!allowed) return reply(429, { code: "rate_limited", message: "Quota quotidien du coach atteint." });

  const quick = body.tier === "quick";
  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: quick ? MODEL_FAST : MODEL,
        max_tokens: quick ? 500 : 2500,
        messages,
      }),
    });
  } catch (e) {
    console.error("anthropic fetch failed", e);
    return reply(502, { code: "upstream_error" });
  }

  if (upstream.status === 429 || upstream.status === 529) return reply(429, { code: "rate_limited" });
  if (!upstream.ok) {
    console.error("anthropic error", upstream.status, (await upstream.text()).slice(0, 800));
    return reply(502, { code: "upstream_error" });
  }

  const data = await upstream.json();
  const text = (data?.content ?? [])
    .filter((c: { type?: string }) => c?.type === "text")
    .map((c: { text?: string }) => c.text ?? "")
    .join("")
    .trim();
  if (!text) return reply(502, { code: "empty_completion" });
  if (data?.stop_reason === "refusal") return reply(422, { code: "refused" });

  return reply(200, { text, truncated: data?.stop_reason === "max_tokens", model: data?.model });
});
