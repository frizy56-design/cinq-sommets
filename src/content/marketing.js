window.SUMMITS = window.SUMMITS || [];
window.SUMMITS.push({
  id: "marketing",
  name: "Marketer",
  short: "Marketing",
  color: "var(--c-marketing)",
  tagline: "Positionner Les Traileurs, faire grandir la marque, faire parler de chaque contenu.",
  units: [
    {
      title: "Être choisi",
      sub: "Positioning, Obviously Awesome, This Is Marketing",
      lessons: [
        {
          title: "Le positionnement",
          cards: [
            { h: "La bataille se joue dans les têtes", b: "Pour Al Ries et Jack Trout, le positionnement n'est pas ce que tu fais au produit, c'est **la place qu'il occupe dans l'esprit du client** face aux autres. Les marques fortes y possèdent **un mot** : Volvo, c'est la sécurité.", src: "Positioning: The Battle for Your Mind, Ries & Trout (1981)" },
            { h: "Les 5 composantes", b: "April Dunford décompose le positionnement en cinq briques :\n**Alternatives** : ce que le client ferait sans toi.\n**Attributs uniques** : ce que tu as et qu'elles n'ont pas.\n**Valeur** : ce que ces attributs apportent, preuves à l'appui.\n**Clients cibles** : ceux qui tiennent le plus à cette valeur.\n**Catégorie** : le cadre qui dit au client à quoi te comparer.", src: "Obviously Awesome, April Dunford (2019)" },
            { h: "Partir des fans", b: "Dunford conseille de commencer par **tes clients les plus enthousiastes**, puis de lister ce qu'ils feraient vraiment sans toi. Ton vrai concurrent est souvent un tableur, WhatsApp ou « ne rien faire ».", src: "Obviously Awesome" }
          ],
          ex: [
            { t: "qcm", q: "Selon Ries et Trout, où se joue le positionnement ?", o: ["Dans l'esprit du client, face aux autres marques", "Dans les caractéristiques techniques du produit", "Dans le prix affiché par rapport aux concurrents", "Dans le logo et la charte graphique de la marque"], a: 0, x: "Deux produits presque identiques peuvent occuper des places très différentes dans les têtes. C'est cette place qu'on travaille." },
            { t: "paires", c: 1, q: "Associe chaque composante de Dunford à son application pour Champions.", p: [["Alternatives", "Faire des pronos entre potes sur WhatsApp"], ["Valeur", "Vivre la course de l'intérieur, avec un enjeu"], ["Clients cibles", "Les fans qui suivent les ultras en direct la nuit"], ["Catégorie", "Jeu de pronostics sportifs"]], x: "Partir des alternatives réelles évite de te comparer à des concurrents que tes joueurs n'envisagent même pas." },
            { t: "vf", q: "Pour Dunford, la catégorie de marché est un détail cosmétique à choisir en dernier.", a: false, x: "Faux. La catégorie fixe le cadre de comparaison et les attentes. « Jeu de pronostics » et « application d'entraînement » ne se jugent pas sur les mêmes critères." },
            { t: "qcm", c: 1, q: "Un coureur hésite entre le club Les Traileurs et le club de running de son quartier, qui sort chaque mardi. Quel positionnement exploite la vraie différence ?", o: ["Le club des grandes sorties trail du week-end, pour découvrir les meilleurs spots de la région", "Un club de running sympa et ouvert à tous, avec une super ambiance et de vraies valeurs", "Le club qui sort le plus souvent, avec plus de séances et plus de coachs que les autres", "Le club le plus exigeant de la ville, réservé aux coureurs déjà confirmés en trail"], a: 0, x: "Tu te places là où l'alternative ne va pas : le trail, le week-end, la découverte. « Sympa et ouvert à tous », tous les clubs le disent." },
            { t: "trou", q: "Les marques fortes possèdent un ___ dans l'esprit des gens.", o: ["mot", "logo", "slogan", "budget"], a: 0, x: "Un seul mot, associé durablement à la marque. Pour Les Traileurs, lequel veux-tu posséder ?" },
            { t: "qcm", q: "Par quoi Dunford conseille-t-elle de commencer un travail de positionnement ?", o: ["Par tes clients les plus enthousiastes et ce qu'ils feraient sans toi", "Par un nom de catégorie à la mode, pour attirer l'attention", "Par la liste complète des fonctionnalités de ton produit", "Par ce que disent les publicités de tes concurrents directs"], a: 0, x: "Tes meilleurs clients ont déjà compris ta valeur. Leur regard t'indique où tu gagnes vraiment." }
          ]
        },
        {
          title: "Le plus petit marché viable",
          cards: [
            { h: "Qui peux-tu aider ?", b: "Seth Godin conseille de viser **le plus petit marché viable** : le groupe le plus restreint qui suffit à faire vivre ton projet et que tu peux servir mieux que personne. On le définit par **ce que les gens croient et veulent**, pas par leur âge.", src: "This Is Marketing, Seth Godin (2018)" },
            { h: "« Les gens comme nous… »", b: "Pour Godin, le comportement suit la culture d'un groupe : **« les gens comme nous font des choses comme ça »**. Le marketing réussi crée cette norme, il ne crie pas plus fort.", src: "This Is Marketing" },
            { h: "1 000 vrais fans", b: "Kevin Kelly a calculé en 2008 qu'un créateur peut vivre avec **1 000 vrais fans** qui dépensent chacun environ 100 dollars par an, à condition de garder **une relation directe** avec eux.", src: "1,000 True Fans, Kevin Kelly (2008)" },
            { h: "Le job à faire", b: "Clayton Christensen : on n'achète pas un produit, on l'**« embauche »** pour faire un progrès. Son exemple : des milkshakes achetés le matin pour occuper un long trajet en voiture, pas pour le goût.", src: "Competing Against Luck, Clayton Christensen (2016)" }
          ],
          ex: [
            { t: "qcm", q: "Pourquoi Godin conseille-t-il de viser d'abord un petit marché ?", o: ["Une petite audience bien servie parle de toi et t'ouvre la suivante", "Une petite audience coûte moins cher en publicité payante", "Les grandes audiences n'achètent presque jamais en ligne", "Une petite audience est plus facile à mesurer et à suivre"], a: 0, x: "Le bouche-à-oreille part toujours d'un noyau qui se sent vraiment compris." },
            { t: "calc", c: 1, q: "Les Traileurs veut diversifier ses revenus avec une adhésion club à 60 € par an. Combien de membres faut-il pour 30 000 € de revenu annuel ?", a: 500, tol: 0, unit: "membres", x: "30 000 ÷ 60 = 500. C'est le raisonnement de Kelly : un objectif concret, atteignable avec des fans en relation directe." },
            { t: "vf", q: "Godin recommande de définir sa cible d'abord par l'âge, le sexe et le revenu.", a: false, x: "Faux. Il privilégie la psychographie : ce que les gens croient, veulent et ce qui leur donne du statut." },
            { t: "qcm", c: 1, q: "Pour quel « job » un traileur embauche-t-il une sortie du club ?", o: ["Découvrir de nouveaux spots en sécurité avec des gens qui partagent sa passion", "Obtenir un plan d'entraînement personnalisé pour préparer sa prochaine course", "Courir plus vite grâce aux conseils techniques d'un entraîneur diplômé", "Profiter de réductions sur le matériel des marques partenaires du club"], a: 0, x: "Le job décide de ce que tu dois soigner : le choix du parcours, l'accueil, la sécurité, le moment partagé." },
            { t: "trou", q: "Pour Godin : « Les gens comme nous font des ___ comme ça. »", o: ["choses", "achats", "courses", "promesses"], a: 0, x: "Rejoindre une sortie, porter le maillot, poster sa trace : ce sont des signaux d'appartenance." },
            { t: "paires", q: "Associe chaque idée à son auteur.", p: [["Le plus petit marché viable", "Seth Godin"], ["1 000 vrais fans", "Kevin Kelly"], ["Le job à faire", "Clayton Christensen"], ["Posséder un mot dans l'esprit", "Ries & Trout"]], x: "Quatre angles complémentaires : où se placer, pour qui, combien il en faut, et pour quel progrès." }
          ]
        },
        {
          title: "Défi : ta promesse marketing",
          defi: true,
          cards: [{ h: "La promesse en trois phrases", b: "Godin propose un gabarit : « Ce que je fais est pour les gens qui croient que… Je me concentre sur ceux qui veulent… Je promets qu'en l'utilisant, ils obtiendront… »", src: "This Is Marketing" }],
          ex: [
            { t: "ecrit", ctx: "Tu dois clarifier le positionnement des clubs Les Traileurs avant d'ouvrir de nouvelles villes.", q: "Écris la promesse marketing des clubs en trois phrases, avec le gabarit de Godin.", crit: ["Une croyance précise du public visé, pas une donnée démographique", "Un segment resserré et assumé", "Un résultat concret promis, pas un slogan", "Se distingue clairement des alternatives (club de quartier, courir seul)", "Honnête : rien que le club ne puisse tenir"], ex: "Les clubs Les Traileurs sont pour les coureurs qui pensent que le trail se vit mieux à plusieurs que seul avec sa montre. Je me concentre sur ceux qui veulent découvrir les plus beaux spots autour de chez eux sans passer des heures à préparer leur sortie. Je promets qu'en venant une fois par mois, ils auront de nouveaux terrains de jeu et une bande avec qui les courir." }
          ]
        }
      ]
    },
    {
      title: "Faire grandir une marque",
      sub: "How Brands Grow, The Long and the Short of It",
      lessons: [
        {
          title: "Comment les marques grandissent",
          cards: [
            { h: "Des lois, pas des opinions", b: "Byron Sharp et l'institut Ehrenberg-Bass ont étudié des décennies de données d'achat. Constat : les marques grandissent surtout en **gagnant des acheteurs** (la pénétration), pas en rendant les fidèles encore plus fidèles. Et la plupart des acheteurs sont **occasionnels**.", src: "How Brands Grow, Byron Sharp (2010)" },
            { h: "La double peine", b: "Les petites marques ont moins d'acheteurs, **et** ces acheteurs sont un peu moins fidèles. Une petite marque compense rarement son petit nombre de clients par une fidélité exceptionnelle.", src: "How Brands Grow" },
            { h: "Disponibilité et actifs distinctifs", b: "**Disponibilité mentale** : venir à l'esprit au moment d'acheter.\n**Disponibilité physique** : être facile à trouver et à acheter.\n**Actifs distinctifs** : couleurs, formats, logos qui font reconnaître la marque sans lire son nom. Pour Sharp, ils comptent plus qu'une différence revendiquée.", src: "How Brands Grow" }
          ],
          ex: [
            { t: "qcm", q: "Selon Sharp, comment une marque grandit-elle surtout ?", o: ["En recrutant de nouveaux acheteurs, y compris occasionnels", "En rendant ses clients actuels encore plus fidèles", "En baissant ses prix plus que tous ses concurrents", "En se différenciant par un produit unique au monde"], a: 0, x: "La croissance vient de la pénétration. Les fidèles comptent, mais leur nombre est limité." },
            { t: "vf", q: "D'après Sharp, les petites marques compensent leur petit nombre d'acheteurs par une fidélité plus forte.", a: false, x: "Faux. C'est l'inverse : la loi de la double peine. Leurs acheteurs sont aussi un peu moins fidèles." },
            { t: "qcm", c: 1, q: "Une marque de chaussures hésite : « Vos abonnés courent déjà chez nous ou chez nos concurrents. » Quel argument tiré de Sharp est le plus solide ?", o: ["Tes ventes futures viendront surtout de traileurs qui achètent rarement : il faut rester présent dans leur tête", "Tes clients actuels sont les plus rentables : il faut d'abord les fidéliser avant d'en chercher d'autres", "Nos abonnés achètent tous plusieurs paires par an : ce sont les plus gros acheteurs du marché", "Une seule grosse campagne suffit pour marquer durablement les esprits de toute la communauté"], a: 0, x: "Tu vends de la disponibilité mentale auprès d'acheteurs occasionnels. Attention aux arguments chiffrés que tu ne peux pas prouver." },
            { t: "paires", q: "Associe chaque notion à son exemple.", p: [["Disponibilité mentale", "Penser à la marque au moment de changer de chaussures"], ["Disponibilité physique", "Trouver le modèle facilement en magasin ou en ligne"], ["Actif distinctif", "Reconnaître un post avant de lire le nom du compte"], ["Pénétration", "Le nombre de personnes qui achètent la marque dans l'année"]], x: "Les deux disponibilités sont les leviers de croissance. Les actifs distinctifs servent la disponibilité mentale." },
            { t: "qcm", c: 1, q: "Lequel de ces éléments est un actif distinctif pour Les Traileurs ?", o: ["Ta cover en deux temps, reconnaissable avant même de lire le nom", "Le fait de publier régulièrement des contenus de bonne qualité", "Le nombre d'abonnés affiché en haut de ton profil Instagram", "Les hashtags trail que la plupart des comptes utilisent aussi"], a: 0, x: "Un actif distinctif est propre à la marque et reconnu sans effort. La régularité et les hashtags, tout le monde peut les avoir." },
            { t: "trou", q: "Pour Sharp, les marques grandissent surtout par la ___.", o: ["pénétration", "fidélité", "différenciation", "promotion"], a: 0, x: "Plus d'acheteurs, y compris ceux qui n'achètent qu'une fois de temps en temps." }
          ]
        },
        {
          title: "Le long terme et le court terme",
          cards: [
            { h: "996 campagnes analysées", b: "Les Binet et Peter Field ont analysé **996 campagnes** de la base de l'IPA, entre 1980 et 2010. Ils distinguent **l'activation** (effet rapide, qui retombe vite) et **la construction de marque** (effet lent, qui s'accumule).", src: "The Long and the Short of It, Binet & Field (2013)" },
            { h: "Le ratio 60/40", b: "En moyenne, le meilleur équilibre tourne autour de **60 % de construction de marque pour 40 % d'activation**. C'est une moyenne : elle varie selon les catégories.", src: "The Long and the Short of It" },
            { h: "L'émotion paie", b: "Les campagnes émotionnelles produisent plus d'effets business que les rationnelles. Sur le long terme, elles sont presque **deux fois plus souvent** associées à une forte croissance des profits. Et les campagnes qui recrutent battent celles qui ne visent que les fidèles.", src: "The Long and the Short of It" }
          ],
          ex: [
            { t: "qcm", q: "Quel équilibre Binet et Field observent-ils en moyenne ?", o: ["Environ 60 % marque, 40 % activation", "Environ 20 % marque, 80 % activation", "Environ 50 % marque, 50 % activation", "Environ 90 % marque, 10 % activation"], a: 0, x: "L'activation fait vendre cette semaine, la marque fait vendre plus cher et plus longtemps. Il faut les deux." },
            { t: "vf", q: "Dans les données de l'IPA, les campagnes émotionnelles font mieux sur le long terme que les campagnes rationnelles.", a: true, x: "Vrai. Elles construisent des souvenirs qui facilitent les achats futurs." },
            { t: "paires", c: 1, q: "Classe chaque action Les Traileurs.", p: [["Code promo -20 % valable 48 h", "Activation"], ["Portraits de coureurs toute la saison", "Construction de marque"], ["Lien d'inscription à la sortie de samedi", "Activation"], ["Rendez-vous mensuel du club, même identité", "Construction de marque"]], x: "Les deux ont leur place. Le piège, c'est de ne faire que de l'activation parce qu'elle se mesure tout de suite." },
            { t: "qcm", c: 1, q: "Une marque ne veut que des stories avec code promo, jugées à 7 jours. Que lui proposer, d'après Binet et Field ?", o: ["Garder l'activation, mais ajouter un format récurrent qui construit la marque, mesuré sur la saison", "Augmenter la remise du code promo pour faire grimper au maximum les ventes de la semaine", "Remplacer tous les codes promo par un seul gros post émotionnel publié une fois dans l'année", "Ne plus mesurer les ventes et ne suivre que le nombre de vues pour montrer la portée"], a: 0, x: "Tu ne combats pas son besoin de résultats rapides, tu y ajoutes ce qui fera vendre l'an prochain." },
            { t: "calc", q: "Un budget annuel de 20 000 € suit le ratio 60/40. Combien d'euros vont à la construction de marque ?", a: 12000, tol: 0, unit: "€", x: "60 % de 20 000 € = 12 000 €, et 8 000 € pour l'activation." },
            { t: "trou", q: "Les effets de la construction de marque s'___ dans le temps.", o: ["accumulent", "épuisent", "annulent", "inversent"], a: 0, x: "C'est toute la différence avec l'activation, dont l'effet retombe dès la fin de la campagne." }
          ]
        },
        {
          title: "Défi : vendre le long terme",
          defi: true,
          cards: [{ h: "Argumenter avec la science", b: "Les marques respectent les arguments fondés sur des données. Cite un principe exact, relie-le à leur objectif, propose un format concret.", src: "Sharp ; Binet & Field" }],
          ex: [
            { t: "ecrit", ctx: "Une marque de nutrition fait avec toi des stories code promo ponctuelles. Tu veux transformer ça en partenariat annuel.", q: "Écris l'argument que tu envoies à son directeur marketing (5 phrases maximum).", crit: ["Cite au moins un principe exact (acheteurs occasionnels, pénétration, 60/40, émotion)", "Relie ce principe à l'objectif de la marque", "Propose un format récurrent concret", "Propose une façon de mesurer sur la durée", "Aucune affirmation chiffrée invérifiable sur ton audience"], ex: "Vos codes promo marchent, mais ils ne touchent que les traileurs prêts à acheter cette semaine. Or, selon les travaux de Byron Sharp, l'essentiel de vos ventes futures viendra de coureurs qui n'achètent que de temps en temps et qu'il faut garder en tête toute l'année. Je vous propose une série mensuelle « Ravito » sur la nutrition en course, sur toute la saison, en gardant un code promo à chaque épisode. On mesure les ventes du code et la notoriété auprès de notre audience en début et en fin de saison. On en parle 20 minutes la semaine prochaine ?" }
          ]
        }
      ]
    },
    {
      title: "Faire parler",
      sub: "Contagious, Ogilvy, Hooked",
      lessons: [
        {
          title: "Pourquoi on partage",
          cards: [
            { h: "STEPPS", b: "Jonah Berger (Wharton) identifie six moteurs du partage :\n**Monnaie sociale** : partager nous fait bien voir.\n**Déclencheurs** : ce qui nous y fait penser au quotidien.\n**Émotion** : surtout les émotions qui activent.\n**Public** : ce qui se voit s'imite.\n**Valeur pratique** : ce qui rend service.\n**Histoires** : le message voyage dans un récit.", src: "Contagious, Jonah Berger (2013)" },
            { h: "Les émotions qui activent", b: "Berger et Katherine Milkman ont étudié près de **7 000 articles du New York Times** sur trois mois. Les contenus positifs sont plus partagés que les négatifs, et les émotions qui activent (émerveillement, colère, inquiétude) bien plus que la tristesse, qui fait décrocher.", src: "Berger & Milkman (2012)" }
          ],
          ex: [
            { t: "paires", c: 1, q: "Associe chaque principe STEPPS à un contenu Les Traileurs.", p: [["Monnaie sociale", "Une info exclusive qu'on est fier de partager en premier"], ["Déclencheurs", "Le récap du lundi, attendu après chaque week-end de course"], ["Valeur pratique", "Le guide des 10 spots à faire autour de Lyon"], ["Histoires", "Le récit de l'abandon puis du retour d'un coureur"]], x: "Un contenu qui active plusieurs principes à la fois voyage beaucoup plus loin." },
            { t: "qcm", q: "Selon Berger et Milkman, quel type de contenu est le moins partagé ?", o: ["Celui qui rend triste", "Celui qui met en colère", "Celui qui émerveille", "Celui qui inquiète"], a: 0, x: "La tristesse fait décrocher. La colère, l'inquiétude et l'émerveillement mettent en mouvement, donc font partager." },
            { t: "vf", q: "D'après Berger, seules les émotions positives poussent au partage.", a: false, x: "Faux. C'est le niveau d'activation qui compte : la colère fait aussi partager. Le positif l'emporte en moyenne, mais ce n'est pas la seule voie." },
            { t: "qcm", c: 1, q: "Quel sujet de carrousel a le plus de chances d'être partagé et commenté ?", o: ["Une grande course change ses règles de qualification : pour ou contre ?", "L'histoire du premier ultra-trail organisé en France, il y a 50 ans", "Notre sélection des plus belles photos des Alpes cet automne", "Le rappel des résultats complets du week-end de courses dernier"], a: 0, x: "Un nom connu, une incertitude, un camp à choisir : c'est ce que montrent aussi tes propres chiffres 2026." },
            { t: "qcm", q: "Que désigne « Public » dans STEPPS ?", o: ["Ce qui se voit s'imite : rendre visible l'usage ou l'adhésion", "Toucher le plus grand nombre possible de personnes à la fois", "Publier ses contenus en accès libre, sans abonnement payant", "Faire relayer son message par des médias grand public"], a: 0, x: "Le maillot du club en course, le badge Champions partagé en story : l'adhésion devient visible, donc contagieuse." },
            { t: "trou", q: "Un contenu utile qu'on transfère à un ami relève de la valeur ___.", o: ["pratique", "sociale", "émotionnelle", "publique"], a: 0, x: "« Ça va te servir » est une des premières raisons de partager." }
          ]
        },
        {
          title: "Accroches et habitudes",
          cards: [
            { h: "Le titre fait le travail", b: "David Ogilvy, fondateur d'une des plus grandes agences de publicité du XXe siècle : en moyenne, **cinq fois plus de gens lisent le titre que le texte**. Si le titre ne vend pas, tu as perdu l'essentiel.", src: "Ogilvy on Advertising, David Ogilvy (1983)" },
            { h: "Le modèle Hook", b: "Nir Eyal décrit la boucle des produits qu'on utilise par habitude : **Déclencheur → Action → Récompense variable → Investissement**. Chaque tour rend le suivant plus probable. Ce jeu l'utilise, et Champions peut l'utiliser.", src: "Hooked, Nir Eyal (2014)" },
            { h: "La question éthique", b: "Eyal propose deux questions : est-ce que **tu utiliserais** ce produit toi-même ? Est-ce qu'il **améliore vraiment** la vie des gens ? Si la réponse est non, tu manipules.", src: "Hooked" }
          ],
          ex: [
            { t: "qcm", q: "D'après Ogilvy, combien de fois plus de personnes lisent le titre que le texte ?", o: ["Environ cinq fois plus", "Environ deux fois plus", "Environ dix fois plus", "À peu près autant"], a: 0, x: "D'où l'importance de tes covers de carrousels : c'est souvent la seule chose lue." },
            { t: "ordre", c: 1, q: "Remets dans l'ordre la boucle Hook de Champions.", items: ["Notification : « La course démarre dans 1 h »", "Le joueur fait son prono en deux clics", "Il découvre son classement, jamais le même", "Il choisit ses coureurs favoris pour la prochaine course"], x: "Déclencheur, action, récompense variable, investissement. L'investissement prépare le déclencheur suivant." },
            { t: "vf", q: "Dans le modèle Hook, une récompense toujours identique entretient mieux l'habitude qu'une récompense variable.", a: false, x: "Faux. L'incertitude du résultat est ce qui donne envie de revenir voir." },
            { t: "qcm", c: 1, q: "Pour Champions, quel « investissement » augmente le plus les chances que le joueur revienne ?", o: ["Lui faire choisir les coureurs qu'il suivra toute la saison", "Lui envoyer un e-mail de bienvenue très complet et détaillé", "Lui offrir un code promo d'une marque dès son inscription", "Lui montrer le classement général de tous les joueurs du jeu"], a: 0, x: "L'investissement, c'est ce que le joueur met de lui dans le produit. Plus il en met, plus il a de raisons de revenir." },
            { t: "qcm", q: "Quelle question Eyal propose-t-il pour vérifier qu'un produit qui crée une habitude reste éthique ?", o: ["Est-ce que je l'utiliserais moi-même, et améliore-t-il vraiment la vie des gens ?", "Est-ce que le produit génère assez de revenus pour rester rentable longtemps ?", "Est-ce que les concurrents utilisent déjà les mêmes mécanismes d'engagement ?", "Est-ce que les utilisateurs ont bien accepté les conditions d'utilisation ?"], a: 0, x: "Un créateur qui utilise son produit et qui l'améliore vraiment pour les gens est du bon côté de la ligne." },
            { t: "trou", q: "En moyenne, cinq fois plus de gens lisent le ___ que le texte.", o: ["titre", "premier paragraphe", "nom de l'auteur", "dernier paragraphe"], a: 0, x: "Passe autant de temps sur ton titre que sur tout le reste." }
          ]
        },
        {
          title: "Sommet : lance la saison de Champions",
          defi: true,
          cards: [{ h: "Tout mettre ensemble", b: "Positionnement, marque et activation, STEPPS, boucle Hook. Un vrai plan tient en quelques lignes.", src: "Dunford ; Sharp ; Binet & Field ; Berger ; Eyal" }],
          ex: [
            { t: "ecrit", ctx: "La nouvelle saison de courses commence. Tu veux faire grandir Champions by Les Traileurs, qui a son propre compte Instagram.", q: "Écris ton plan de lancement en 6 lignes maximum.", crit: ["Une phrase de positionnement claire (alternative, valeur, cible)", "Au moins deux leviers STEPPS concrets", "Une boucle Hook décrite (déclencheur, action, récompense, investissement)", "Un format récurrent qui construit la marque, pas seulement de l'activation", "Un indicateur de réussite mesurable"], ex: "Positionnement : Champions, c'est le jeu de pronostics pour les fans qui suivent les ultras en direct, plus vivant qu'un live sans enjeu.\nSTEPPS : un badge « pronostiqueur de l'année » à partager (monnaie sociale) et un rendez-vous le vendredi avant chaque grande course (déclencheur).\nHook : notification au départ, prono en deux clics, classement surprise à l'arrivée, choix de ses coureurs favoris pour la suite.\nMarque : un carrousel mensuel « Les pronos qui ont tout changé », même format, même couleur.\nMesure : joueurs actifs qui reviennent sur au moins trois courses de la saison." }
          ]
        }
      ]
    }
  ],
  books: [
    { t: "Positioning: The Battle for Your Mind", a: "Al Ries et Jack Trout", y: 1981, proof: "Le livre qui a imposé la notion de positionnement, toujours enseigné dans les écoles de commerce.", idea: "Le positionnement se joue dans la tête du client : possède un mot." },
    { t: "Obviously Awesome", a: "April Dunford", y: 2019, proof: "La méthode de positionnement de référence dans les start-up, tirée de sa carrière de dirigeante marketing.", idea: "Pars de tes meilleurs clients et de leurs vraies alternatives." },
    { t: "This Is Marketing", a: "Seth Godin", y: 2018, proof: "Synthèse de plusieurs décennies de travail d'un des auteurs marketing les plus lus au monde.", idea: "Vise le plus petit marché viable et crée une norme : « les gens comme nous… »." },
    { t: "How Brands Grow", a: "Byron Sharp", y: 2010, proof: "Fondé sur des décennies de données d'achat de l'institut Ehrenberg-Bass.", idea: "On grandit en gagnant des acheteurs, grâce à la disponibilité mentale et physique." },
    { t: "The Long and the Short of It", a: "Les Binet et Peter Field", y: 2013, proof: "Analyse de 996 campagnes de la base de l'IPA entre 1980 et 2010.", idea: "Environ 60 % de construction de marque, 40 % d'activation, et l'émotion paie." },
    { t: "Contagious", a: "Jonah Berger", y: 2013, proof: "Fondé sur ses recherches à Wharton, dont l'étude de près de 7 000 articles du New York Times.", idea: "STEPPS : monnaie sociale, déclencheurs, émotion, public, valeur pratique, histoires." },
    { t: "Hooked", a: "Nir Eyal", y: 2014, proof: "Le modèle de référence des produits qui créent des habitudes, avec son garde-fou éthique.", idea: "Déclencheur, action, récompense variable, investissement." },
    { t: "Ogilvy on Advertising", a: "David Ogilvy", y: 1983, proof: "Le bilan d'un des publicitaires les plus influents du XXe siècle.", idea: "Le titre est lu cinq fois plus que le texte : soigne-le." }
  ]
});
