# Cinq Sommets

Un jeu d'apprentissage quotidien, sur le modèle de Duolingo, pour progresser sur cinq compétences : **vendre, écrire, comprendre les gens, marketer et faire fructifier son argent**. Chaque parcours s'appuie sur des livres et des études de référence, avec des cas pratiques tirés de Les Traileurs.

Le site s'installe sur un téléphone comme une application. Il fonctionne hors ligne et envoie un rappel le soir si la séance du jour n'est pas faite.

## Comment c'est construit

| Brique | Rôle |
|---|---|
| **GitHub Pages** | Héberge le site (fichiers statiques construits par `build.py`). |
| **Supabase Auth** | Connexion par code reçu par e-mail, sans mot de passe. |
| **Supabase Postgres** | Progression de chaque joueur, ligue d'équipe, liste des membres, abonnements aux notifications. Les règles de sécurité (RLS) garantissent que chacun ne lit et n'écrit que ses propres données. |
| **Fonction Edge `coach`** | Relaie les jeux de rôle, l'atelier, les défis écrits et l'entraînement illimité vers l'API Claude. La clé reste côté serveur, avec 150 appels par jour et par joueur au maximum. |
| **GitHub Actions `rappel.yml`** | Toutes les heures : relance la base pour que Supabase ne la mette jamais en pause, et envoie les notifications du soir. |
| **GitHub Actions `deploy.yml`** | Reconstruit et publie le site à chaque modification. |

```
src/content/      contenu des cinq sommets (leçons, missions, jeux de rôle)
src/engine/       moteur du jeu
src/web/          connexion, pont avec Supabase, notifications, styles du site
public/           service worker, manifeste, icônes, config.js, supabase-js
supabase/         migration SQL et fonction Edge « coach »
scripts/rappel.mjs   la tâche planifiée
```

## Mise en route

### 1. Supabase

1. Crée un projet (offre gratuite) et note son **URL** et sa **clé publique** (*Project Settings → API*).
2. Dans *SQL Editor*, exécute `supabase/migrations/20261012080000_cinq_sommets.sql`.
3. Toujours dans *SQL Editor*, enregistre le secret de la tâche planifiée (au moins 24 caractères, le même que le secret GitHub `CRON_SECRET`) :
   ```sql
   select private.set_cron_secret('ton-secret');
   ```
4. Déploie la fonction Edge `coach` (*Edge Functions → Deploy*, ou `supabase functions deploy coach`), puis ajoute le secret **`ANTHROPIC_API_KEY`** (*Edge Functions → Secrets*) avec une clé créée sur [console.anthropic.com](https://console.anthropic.com). Sans cette clé, le jeu fonctionne mais les défis se corrigent avec la grille, et les jeux de rôle, l'atelier et l'entraînement illimité restent masqués. Facultatif : `COACH_MODEL` et `COACH_MODEL_FAST` pour changer de modèle.
5. *Authentication → URL Configuration* : mets l'adresse du site dans **Site URL** et dans **Redirect URLs** (par exemple `https://ton-compte.github.io/cinq-sommets/`).
6. *Authentication → Email Templates → Magic Link* : ajoute `{{ .Token }}` dans le message pour que l'e-mail contienne un code. C'est indispensable sur iPhone, où le lien ouvre Safari et non l'application installée.

### 2. Le site

1. Remplis `public/config.js` avec l'URL, la clé publique Supabase et la clé publique VAPID. Ces valeurs peuvent être publiques.
2. Dans *Settings → Pages* du dépôt GitHub, choisis **Source : GitHub Actions**. Le workflow `deploy.yml` publie le site à chaque push.
3. Dans *Settings → Secrets and variables → Actions*, ajoute deux secrets :
   - `CRON_SECRET` : le même secret qu'à l'étape 1.3 ;
   - `VAPID_PRIVATE_KEY` : la clé privée VAPID (générée avec `npx web-push generate-vapid-keys`).

### 3. Premier lancement

Le **premier compte qui se connecte devient administrateur**. Ensuite, seuls les e-mails ajoutés dans *Profil → Équipe* peuvent entrer.

Sans service d'e-mail branché, Supabase n'envoie les codes qu'aux membres de l'équipe du projet Supabase, et seulement deux e-mails par heure. Pour ouvrir le jeu à d'autres personnes, deux solutions :
- inviter la personne dans l'équipe du projet (*Organization → Team*) ;
- ou brancher un service d'e-mail gratuit, comme Brevo ou Resend, dans *Authentication → SMTP Settings*.

## Le rappel qui relance la base

Supabase met en pause les projets gratuits sans activité pendant 7 jours. Le workflow `rappel.yml` tourne toutes les heures :

1. il appelle la fonction `rappels_du_moment`, qui écrit un battement de cœur dans la base : le projet reste actif ;
2. elle renvoie les joueurs dont l'heure de rappel est passée, qui n'ont pas encore fait leur séance et qui n'ont pas déjà été relancés aujourd'hui ;
3. le script leur envoie une notification Web Push (« Ta série de 12 jours s'arrête à minuit… »).

GitHub désactive les tâches planifiées d'un dépôt public après 60 jours sans commit : le workflow ajoute donc un petit commit tous les 45 jours.

Chaque joueur active le rappel dans *Profil → Rappel du soir* et choisit son heure (18 h à 22 h). Sur iPhone, il faut d'abord installer le site sur l'écran d'accueil (*Partager → Sur l'écran d'accueil*).

## Développer en local

```bash
python3 build.py                     # construit dist/
python3 -m http.server -d dist 8080  # puis ouvre http://localhost:8080
```

Pour tester la migration sur un Postgres local : `tests/supabase_stubs.sql` crée les objets Supabase minimaux, puis `tests/test_migration.sql` vérifie les règles d'accès et les rappels.

## Coûts

GitHub Pages, GitHub Actions (dépôt public) et l'offre gratuite de Supabase ne coûtent rien. Seul le coach consomme l'API Claude, facturée à l'usage sur le compte Anthropic qui fournit la clé.
