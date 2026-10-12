// Tâche planifiée (GitHub Actions, toutes les heures) :
// 1. relance la base Supabase pour qu'elle ne soit jamais mise en pause ;
// 2. envoie le rappel du soir aux joueurs dont l'heure est venue et qui n'ont pas fait leur séance.
import { readFileSync } from 'node:fs';
import webpush from 'web-push';

const configText = readFileSync(new URL('../public/config.js', import.meta.url), 'utf8');
const fromConfig = key => (configText.match(new RegExp(key + "\\s*:\\s*['\"]([^'\"]*)['\"]")) || [])[1] || '';

const SUPABASE_URL = (process.env.SUPABASE_URL || fromConfig('supabaseUrl')).replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_KEY || fromConfig('supabaseKey');
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || fromConfig('vapidPublicKey');
const { CRON_SECRET, VAPID_PRIVATE_KEY } = process.env;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '/').split('/');
const SITE_URL = process.env.SITE_URL || (owner && repo ? `https://${owner.toLowerCase()}.github.io/${repo}/` : '');

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

if (!SUPABASE_URL || SUPABASE_URL.includes('A_REMPLIR')) fail('Adresse Supabase absente de public/config.js.');
if (!SUPABASE_KEY || SUPABASE_KEY.includes('A_REMPLIR')) fail('Clé publique Supabase absente de public/config.js.');
if (!CRON_SECRET) fail('Le secret CRON_SECRET n\'est pas défini dans les secrets du dépôt.');

async function rpc(name, args) {
  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
  if (SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(args) });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`${name} a répondu ${res.status} : ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

function buildMessage(row) {
  const first = row.name ? `${String(row.name).split(' ')[0]}, ` : '';
  let body = row.streak > 0
    ? `${first}ta série de ${row.streak} jour${row.streak > 1 ? 's' : ''} s'arrête à minuit. 5 minutes ce soir ?`
    : `${first}une séance de 5 minutes ce soir pour lancer ta série ?`;
  if (row.mission) {
    const m = String(row.mission);
    body += ` Mission du jour : ${m.length > 80 ? `${m.slice(0, 77)}…` : m}`;
  }
  return JSON.stringify({ title: 'Cinq Sommets', body, url: SITE_URL || './', tag: 'rappel-du-soir' });
}

async function main() {
  let due;
  try {
    due = await rpc('cs_rappels_du_moment', { p_secret: CRON_SECRET });
  } catch (e) {
    if (e.status === 401 || e.status === 403 || /unauthorized/.test(e.message)) {
      fail('Le secret CRON_SECRET ne correspond pas à celui enregistré dans la base (voir le README).');
    }
    fail(`Base injoignable : ${e.message}. Si le projet est en pause, ouvre le tableau de bord Supabase et clique sur « Resume project ».`);
  }
  due = Array.isArray(due) ? due : [];
  console.log(`Base relancée le ${new Date().toISOString()}. ${due.length} rappel(s) à envoyer.`);
  if (!due.length) return;

  if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.includes('A_REMPLIR') || !VAPID_PRIVATE_KEY) {
    fail('Clés VAPID manquantes : les rappels ne peuvent pas partir.');
  }
  webpush.setVapidDetails(SITE_URL || 'https://github.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const gone = [];
  let sent = 0;
  for (const row of due) {
    try {
      await webpush.sendNotification(
        { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
        buildMessage(row),
        { TTL: 3 * 3600, urgency: 'normal' }
      );
      sent += 1;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) gone.push(row.endpoint);
      else console.warn(`Envoi impossible (${e.statusCode || 'réseau'}) : ${String(e.body || e.message || '').slice(0, 200)}`);
    }
  }
  if (gone.length) await rpc('cs_supprimer_abonnements', { p_secret: CRON_SECRET, p_endpoints: gone });
  console.log(`${sent} rappel(s) envoyé(s), ${gone.length} abonnement(s) expiré(s) retiré(s).`);
}

main().catch(e => fail(e.message));
