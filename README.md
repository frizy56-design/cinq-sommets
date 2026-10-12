# Cinq Sommets

Un jeu d'apprentissage quotidien, sur le modèle de Duolingo, pour progresser sur cinq compétences : **vendre, écrire, comprendre les gens, marketer et faire fructifier son argent**. Chaque parcours s'appuie sur des livres et des études de référence, avec des cas pratiques tirés de Les Traileurs.

Le site s'installe sur un téléphone comme une application. Il fonctionne hors ligne et envoie un rappel le soir si la séance du jour n'est pas faite.

**Tout est gratuit** : pas de clé API, pas d'e-mail, pas de service payant.

## Comment c'est construit

| Brique | Rôle |
|---|---|
| **GitHub Pages** | Héberge le site (fichiers statiques construits par `build.py`). |
| **Supabase Postgres** | Comptes, progression de chaque joueur, ligue d'équipe, abonnements aux notifications. |
| **GitHub Actions `rappel.yml`** | Toutes les heures : relance la base pour que Supabase ne la mette jamais en pause, et envoie les notifications du soir. |
| **GitHub Actions `deploy.yml`** | Reconstruit et publie le site à chaque modification. |

```
src/content/      contenu des cinq sommets (leçons, missions, jeux de rôle)
src/engine/       moteur du jeu
src/web/          connexion, pont avec la base, notifications, styles du site
public/           service worker, manifeste, icônes, config.js
supabase/         migration SQL
scripts/rappel.mjs   la tâche planifiée
tests/            vérifications de la migration sur un Postgres local
```

### Connexion sans e-mail

- Chaque joueur a un **nom d'utilisateur** et un **mot de passe** (8 caractères au moins, chiffré avec bcrypt).
- À la création du compte, le site affiche une **phrase de récupération de 12 mots**. Elle seule permet de choisir un nouveau mot de passe en cas d'oubli ; elle est remplacée par une nouvelle à chaque utilisation.
- L'inscription se fait **sur invitation** : un administrateur crée un code à usage unique (*Profil → Équipe → Inviter quelqu'un*), valable 14 jours.
- Après 8 essais ratés, le compte est bloqué 15 minutes.
- Les sessions durent 180 jours après le dernier passage ; seule leur empreinte est stockée.

### Avec Claude, sans clé API

Les jeux de rôle, l'atelier, l'entraînement illimité et la correction des défis écrits se font dans une conversation avec Claude, dans l'appli ou sur claude.ai. Le jeu prépare le prompt (contexte, critères, fiches de cours), tu le colles dans Claude, puis tu reviens noter ta séance : la série, le D+, les quêtes et le carnet comptent comme avant. Les défis écrits peuvent aussi se corriger seuls, avec la grille.

### Cohabitation dans un projet Supabase existant

La base de Cinq Sommets peut vivre dans un projet qui sert déjà à autre chose :
- toutes ses tables sont dans le schéma **`cs_private`**, qui n'est pas exposé par l'API ;
- le site n'appelle que les fonctions **`public.cs_*`**, qui vérifient la session à chaque appel ;
- la migration ne touche à aucun objet existant.

## Mise en route

### 1. Supabase

1. Dans le projet (offre gratuite), ouvre *SQL Editor* et exécute `supabase/migrations/20261012120000_cinq_sommets.sql`.
2. Toujours dans *SQL Editor*, enregistre le secret de la tâche planifiée (24 caractères au moins, le même que le secret GitHub `CRON_SECRET`) :
   ```sql
   select cs_private.set_cron_secret('ton-secret');
   ```
3. Crée le code d'invitation du premier administrateur :
   ```sql
   select cs_private.invitation_admin();
   ```
4. Note l'**URL** du projet et sa **clé publique** (*Project Settings → API Keys*, clé `sb_publishable_…`).

### 2. Le site

1. Remplis `public/config.js` avec l'URL et la clé publique. Ces valeurs peuvent être publiques : la sécurité repose sur les fonctions de la base.
2. Dans *Settings → Pages* du dépôt GitHub, choisis **Source : GitHub Actions**.
3. Dans *Settings → Secrets and variables → Actions*, ajoute :
   - `CRON_SECRET` : le même secret qu'à l'étape 1.2 ;
   - `VAPID_PRIVATE_KEY` : la clé privée VAPID qui va avec la clé publique de `config.js` (une paire se génère avec `npx web-push generate-vapid-keys`).

### 3. Premier lancement

Ouvre le site, touche **« J'ai un code d'invitation »**, saisis le code de l'étape 1.3, choisis ton nom d'utilisateur et ton mot de passe, puis **note ta phrase de récupération**. Ensuite, invite ton équipe depuis *Profil → Équipe*.

Si un membre perd à la fois son mot de passe et sa phrase, un administrateur retire son compte et lui envoie une nouvelle invitation (sa progression repart de zéro, sauf s'il l'avait exportée depuis son profil).

## Le rappel qui relance la base

Supabase met en pause les projets gratuits sans activité pendant 7 jours. Le workflow `rappel.yml` tourne toutes les heures :

1. il appelle la fonction `cs_rappels_du_moment`, qui écrit un battement de cœur dans la base : le projet reste actif ;
2. elle fait le ménage (sessions et invitations expirées) et renvoie les joueurs dont l'heure de rappel est passée, qui n'ont pas encore fait leur séance et qui n'ont pas déjà été relancés aujourd'hui ;
3. le script leur envoie une notification Web Push (« Antoine, ta série de 12 jours s'arrête à minuit… »).

GitHub désactive les tâches planifiées d'un dépôt public après 60 jours sans commit : le workflow ajoute donc un petit commit tous les 45 jours.

Chaque joueur active le rappel dans *Profil → Rappel du soir* et choisit son heure (18 h à 22 h). Sur iPhone, il faut d'abord installer le site sur l'écran d'accueil (*Partager → Sur l'écran d'accueil*).

## Développer en local

```bash
python3 build.py                     # construit dist/
python3 -m http.server -d dist 8080  # puis ouvre http://localhost:8080
```

Pour tester la migration sur un Postgres local :

```bash
createdb cs_test
psql -d cs_test -f tests/supabase_stubs.sql
psql -d cs_test -f supabase/migrations/20261012120000_cinq_sommets.sql
psql -d cs_test -f tests/test_migration.sql   # 78 vérifications
```

## Coûts

GitHub Pages, GitHub Actions (dépôt public) et l'offre gratuite de Supabase ne coûtent rien. Le jeu n'appelle jamais l'API Claude : les séances « Avec Claude » passent par ton compte Claude habituel.
