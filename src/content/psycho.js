window.SUMMITS = window.SUMMITS || [];
window.SUMMITS.push({
  id: "psycho",
  name: "Comprendre",
  short: "Psychologie",
  color: "var(--c-psycho)",
  tagline: "Pourquoi les gens font ce qu'ils font, et comment influencer sans manipuler.",
  units: [
    {
      title: "Les 7 leviers de l'influence",
      sub: "Influence et Pre-Suasion, Robert Cialdini",
      lessons: [
        {
          title: "Réciprocité, engagement, preuve, autorité",
          cards: [
            { h: "Le livre de référence", b: "Robert Cialdini, professeur de psychologie à l'Arizona State University, a passé des années à observer vendeurs, recruteurs et collecteurs de fonds de l'intérieur. Il en a tiré **6 principes**, puis un 7e en 2016.", src: "Influence, Robert Cialdini (1984)" },
            { h: "Les 4 premiers", b: "**Réciprocité** : on rend ce qu'on a reçu.\n**Engagement et cohérence** : on veut rester fidèle à ce qu'on a dit ou fait, surtout publiquement.\n**Preuve sociale** : dans le doute, on fait comme les autres, surtout ceux qui nous ressemblent.\n**Autorité** : on suit les experts crédibles.", src: "Influence" },
            { h: "La règle éthique", b: "Cialdini distingue l'usage honnête (mettre en avant un principe **réellement présent**) de la manipulation (le fabriquer). Une fausse rareté ou un faux témoignage marchent une fois, puis détruisent la confiance.", src: "Influence ; Pre-Suasion" }
          ],
          ex: [
            { t: "paires", q: "Associe chaque situation au principe de Cialdini.", p: [["Tu envoies gratuitement à une marque une analyse de son public sur ton compte", "Réciprocité"], ["Les coureurs qui ont écrit « je viens » en story viennent plus souvent", "Engagement"], ["« 180 coureurs déjà inscrits »", "Preuve sociale"], ["Le parcours est validé par un guide de haute montagne", "Autorité"]], x: "Ces leviers marchent parce qu'ils sont des raccourcis mentaux utiles au quotidien. Ils deviennent toxiques quand ils sont faux." },
            { t: "qcm", c: 1, q: "Tu veux que plus d'inscrits viennent vraiment à la sortie du club. Quel levier d'engagement est le plus efficace ?", o: ["Leur demander de répondre publiquement « je viens » dans la conversation du groupe", "Leur envoyer un rappel générique la veille", "Mettre plus de photos sur le compte", "Augmenter le nombre de places"], a: 0, x: "Un engagement actif et public est plus contraignant qu'une case cochée en silence. On veut rester cohérent avec ce qu'on a affiché." },
            { t: "vf", q: "D'après Cialdini, la preuve sociale est plus forte quand les autres nous ressemblent.", a: true, x: "Vrai. « 40 coureurs de ton niveau sont inscrits » pèse plus que « 40 000 personnes nous suivent »." },
            { t: "qcm", q: "Pour la réciprocité, qu'est-ce qui rend un cadeau le plus efficace ?", o: ["Qu'il soit significatif, personnalisé et inattendu", "Qu'il soit cher", "Qu'il soit offert à tout le monde en même temps", "Qu'il soit accompagné d'une demande immédiate"], a: 0, x: "Cialdini insiste sur ces trois traits. Un goodies générique envoyé à 500 contacts déclenche peu de dette." },
            { t: "qcm", c: 1, q: "Quel usage de l'autorité est honnête et efficace pour une page d'inscription au club ?", o: ["Présenter les ambassadeurs avec leurs vraies références de courses", "Écrire « recommandé par des experts » sans dire lesquels", "Ajouter le logo d'une marque qui n'est pas partenaire", "Inventer un titre de coach diplômé"], a: 0, x: "L'autorité se montre avec des faits vérifiables. Le reste est de la manipulation, et ça finit toujours par se voir." },
            { t: "trou", q: "Dans le doute, on a tendance à faire comme les ___.", o: ["autres", "experts", "anciens", "plus jeunes"], a: 0, x: "C'est la preuve sociale. Elle joue surtout quand la situation est incertaine ou nouvelle." }
          ]
        },
        {
          title: "Sympathie, rareté, unité",
          cards: [
            { h: "Sympathie", b: "On dit plus facilement oui aux gens qu'on apprécie : ceux qui nous ressemblent, qui nous font des compliments sincères, qui coopèrent avec nous vers un même but.", src: "Influence" },
            { h: "Rareté", b: "Ce qui devient rare paraît plus précieux. L'effet est plus fort quand la rareté est **nouvelle** et quand **d'autres** convoitent la même chose.", src: "Influence" },
            { h: "Unité, le 7e principe", b: "Ajouté dans Pre-Suasion en 2016 : quand les gens te perçoivent comme faisant partie de leur **« nous »** (famille, lieu, passion partagée), tout devient plus facile. Ce n'est pas une ressemblance superficielle, c'est une identité commune.", src: "Pre-Suasion, Robert Cialdini (2016)" }
          ],
          ex: [
            { t: "qcm", q: "Quel est le 7e principe ajouté par Cialdini en 2016 ?", o: ["L'unité", "L'urgence", "La nouveauté", "La simplicité"], a: 0, x: "L'unité, c'est l'identité partagée. Le nom même « Les Traileurs » en est un exemple : un « nous »." },
            { t: "qcm", c: 1, q: "Quelle annonce utilise la rareté honnêtement ?", o: ["« 40 places, parce qu'au-delà les ambassadrices ne peuvent plus encadrer. Il en reste 9. »", "« Dernières places !!! » (alors que la sortie est à moitié vide)", "« Offre valable 2 h » (renouvelée tous les jours)", "« Réservé à une élite »"], a: 0, x: "La limite est réelle et justifiée. C'est plus convaincant et ça ne grille pas ta crédibilité pour la prochaine fois." },
            { t: "vf", q: "L'unité, c'est simplement avoir des points communs superficiels, comme le même prénom.", a: false, x: "Faux. Cialdini range les ressemblances dans la sympathie. L'unité, c'est une identité partagée : « on est des traileurs »." },
            { t: "paires", q: "Associe chaque phrase au principe utilisé.", p: [["« Entre traileurs, on se doit bien ça. »", "Unité"], ["« Il ne reste que 9 dossards. »", "Rareté"], ["« Comme toi, j'ai commencé par le 10 km. »", "Sympathie"]], x: "Trois principes différents, trois effets différents. Les mélanger avec honnêteté rend un message bien plus fort." },
            { t: "qcm", q: "D'après Cialdini, quand la rareté agit-elle le plus ?", o: ["Quand elle vient d'apparaître et que d'autres convoitent la même chose", "Quand elle dure depuis longtemps", "Quand personne ne s'y intéresse", "Quand le produit est gratuit"], a: 0, x: "Une ressource qui devient rare, disputée par d'autres : c'est le cocktail le plus puissant, et pour ça le plus facile à abuser." },
            { t: "qcm", c: 1, q: "Tu demandes un conseil plutôt qu'un avis à une marque partenaire sur ta nouvelle offre. Pourquoi Cialdini le recommande-t-il ?", o: ["Demander un conseil fait faire à l'autre un pas vers toi, il se sent partenaire", "Ça fait gagner du temps", "Ça évite de parler prix", "Les avis sont toujours négatifs"], a: 0, x: "Dans Pre-Suasion, il explique qu'un conseil met l'autre en position de co-créateur : c'est une forme d'unité." }
          ]
        },
        {
          title: "Défi : une story qui remplit la sortie",
          defi: true,
          cards: [{ h: "Persuader honnêtement", b: "Utilise au moins trois principes, uniquement s'ils sont vrais. Le coach vérifie aussi l'éthique.", src: "Cialdini" }],
          ex: [
            { t: "ecrit", ctx: "Le club organise une sortie samedi. Il reste des places et certains inscrits risquent de ne pas venir.", q: "Écris le texte d'une story Instagram (4 lignes maximum) qui donne envie de s'inscrire et de venir vraiment.", crit: ["Au moins 3 principes de Cialdini identifiables", "Chaque principe repose sur un fait vraisemblable, rien d'inventé ou d'exagéré", "Une demande claire et facile (répondre, s'inscrire)", "4 lignes maximum, ton Les Traileurs"], ex: "Samedi, 600 m de D+ au-dessus de Lyon avec la team du club.\n32 traileurs déjà inscrits, plus que 8 places pour garder un groupe soudé.\nTu viens ? Réponds « je viens » à cette story, on te garde ta place." }
          ]
        }
      ]
    },
    {
      title: "Les deux vitesses de la pensée",
      sub: "Thinking, Fast and Slow, Daniel Kahneman",
      lessons: [
        {
          title: "Système 1, système 2",
          cards: [
            { h: "Un prix Nobel", b: "Daniel Kahneman, psychologue, a reçu le prix Nobel d'économie en 2002 pour ses travaux avec Amos Tversky sur la prise de décision. Son livre de 2011 en fait la synthèse.", src: "Thinking, Fast and Slow, Daniel Kahneman (2011)" },
            { h: "Deux systèmes", b: "**Système 1** : rapide, automatique, intuitif, sans effort.\n**Système 2** : lent, attentif, coûteux en énergie. Le système 2 est paresseux : il valide souvent ce que propose le système 1 sans vérifier.", src: "Thinking, Fast and Slow" },
            { h: "Ancrage et aversion à la perte", b: "**Ancrage** : le premier chiffre entendu tire les estimations vers lui, même s'il n'a aucun rapport.\n**Aversion à la perte** : perdre fait environ deux fois plus mal que gagner fait plaisir.", src: "Kahneman & Tversky" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Une marque te demande ton tarif. Comment utiliser l'ancrage à ton avantage ?", o: ["Annoncer en premier un chiffre ambitieux mais défendable", "Attendre qu'ils donnent leur budget", "Donner une fourchette très large", "Dire « on verra »"], a: 0, x: "Le premier chiffre posé sert de référence à toute la discussion. Dans une négociation où tu connais bien ta valeur, ancrer en premier est souvent payant." },
            { t: "vf", q: "D'après Kahneman, perdre 100 € fait à peu près autant d'effet que gagner 100 €.", a: false, x: "Faux. La perte pèse environ deux fois plus. C'est pour ça qu'une série perdue te fait plus mal que la série gagnée ne t'a fait plaisir… et que ce jeu en a une." },
            { t: "paires", q: "Associe chaque situation au système de pensée.", p: [["Lire « 2 + 2 »", "Système 1"], ["Calculer 17 × 24", "Système 2"], ["Sentir qu'un message est agressif", "Système 1"], ["Comparer trois devis ligne à ligne", "Système 2"]], x: "Le système 1 travaille en permanence, le système 2 seulement quand on le mobilise volontairement." },
            { t: "qcm", q: "Quelle formulation profite de l'aversion à la perte ?", o: ["« Sans ton inscription avant vendredi, tu perds ta place sur la liste prioritaire. »", "« Inscris-toi avant vendredi pour être sur la liste prioritaire. »", "« Les inscriptions sont ouvertes. »", "« Tu peux t'inscrire quand tu veux. »"], a: 0, x: "Même information, cadrée comme une perte. À utiliser seulement si c'est vrai : sinon, c'est de la manipulation." },
            { t: "qcm", q: "Que montre l'expérience de la roue de la fortune de Tversky et Kahneman (1974) ?", o: ["Un nombre tiré au hasard influence une estimation qui n'a rien à voir", "Les gens aiment les jeux de hasard", "La chance n'existe pas", "On se souvient mieux des grands nombres"], a: 0, x: "Les participants voyaient la roue s'arrêter sur 10 ou 65, puis estimaient le pourcentage de pays africains à l'ONU. Ceux qui avaient vu 65 donnaient des estimations bien plus hautes." },
            { t: "trou", q: "Le système ___ est rapide, intuitif et automatique.", o: ["1", "2", "3", "0"], a: 0, x: "Le système 1. Il a raison la plupart du temps, mais se trompe de façon prévisible." }
          ]
        },
        {
          title: "Le pic, la fin et les plans trop optimistes",
          cards: [
            { h: "La règle pic-fin", b: "On juge une expérience surtout sur **son moment le plus intense** et **sa fin**, beaucoup moins sur sa durée. Kahneman l'a montré notamment avec des patients pendant une coloscopie (Redelmeier et Kahneman, 1996).", src: "Thinking, Fast and Slow" },
            { h: "L'illusion de planification", b: "On sous-estime presque toujours le temps et le coût de nos projets, même en sachant que les précédents ont débordé. Le remède : **regarder la durée réelle de projets similaires** (la vue extérieure) plutôt que d'imaginer le sien.", src: "Kahneman & Tversky (1979)" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Comment appliquer la règle pic-fin à une sortie du club ?", o: ["Soigner un moment fort (point de vue) et finir sur une note agréable (café, photo de groupe)", "Rallonger la sortie pour en donner plus", "Finir par la montée la plus dure", "Supprimer les pauses"], a: 0, x: "Les participants garderont surtout le sommet et l'arrivée. Une fin ratée gâche le souvenir d'une très bonne sortie." },
            { t: "vf", q: "D'après la règle pic-fin, une expérience plus longue est toujours jugée plus positivement si elle contient plus de bons moments.", a: false, x: "Faux. La durée compte peu : c'est l'intensité du pic et la qualité de la fin qui dominent le souvenir." },
            { t: "qcm", c: 1, q: "Tu estimes que la refonte du site des clubs prendra 2 semaines. Que conseille Kahneman ?", o: ["Regarder combien de temps ont réellement pris tes derniers projets web comparables", "Faire confiance à ton estimation, tu connais le projet", "Diviser par deux pour te motiver", "Ne pas estimer du tout"], a: 0, x: "La vue extérieure s'appuie sur des cas réels. Si tes trois derniers projets ont pris 5 semaines, c'est ta meilleure prévision." },
            { t: "trou", q: "On juge une expérience surtout sur son pic et sur sa ___.", o: ["fin", "durée", "début", "prix"], a: 0, x: "C'est la règle pic-fin. La fin est le dernier souvenir, donc le plus présent." },
            { t: "qcm", q: "Pourquoi l'illusion de planification persiste-t-elle même chez les gens expérimentés ?", o: ["On imagine son projet comme un cas particulier, sans les imprévus", "On ment volontairement", "Les projets sont toujours plus courts que prévu", "On manque de calendrier"], a: 0, x: "On construit un scénario où tout se passe bien. Les imprévus, eux, sont la règle, pas l'exception." },
            { t: "qcm", q: "Quel exemple illustre le cadrage (framing) ?", o: ["« 90 % de finishers » rassure plus que « 10 % d'abandons »", "Un prix en rouge se vend mieux", "Une photo carrée attire plus qu'une photo verticale", "Les gens préfèrent les chiffres ronds"], a: 0, x: "Même fait, deux présentations, deux réactions. Kahneman cite une étude où des médecins choisissaient un traitement différent selon qu'on leur présentait les chances de survie ou de mortalité." }
          ]
        },
        {
          title: "Défi : analyse un comportement",
          defi: true,
          cards: [{ h: "Diagnostiquer avant d'agir", b: "Nomme le biais ou le principe en jeu, puis propose une action concrète qui en tient compte.", src: "Kahneman ; Cialdini" }],
          ex: [
            { t: "ecrit", ctx: "Sur Champions by Les Traileurs, beaucoup de joueurs font leurs pronostics pour une course, puis ne reviennent pas pour la suivante.", q: "Explique en 4 à 6 phrases quels mécanismes psychologiques pourraient les faire revenir, et propose deux actions concrètes.", crit: ["Nomme au moins deux mécanismes réels (aversion à la perte, engagement, preuve sociale, pic-fin…)", "Explique le lien entre chaque mécanisme et le comportement", "Propose deux actions concrètes et réalisables", "Reste éthique : pas de faux signaux ni de culpabilisation excessive"], ex: "Un joueur qui a un classement à défendre craint de le perdre : afficher sa position et ce qu'il risque de céder s'il ne joue pas la prochaine course active l'aversion à la perte. L'engagement aide aussi : lui proposer, juste après ses pronostics, de « s'inscrire » d'un clic à la course suivante crée un petit pas qu'il voudra tenir. Enfin, la règle pic-fin plaide pour soigner la fin de chaque course : un récap personnalisé avec son meilleur pronostic. Actions : 1) un rappel « ton rang est en jeu » 48 h avant la course suivante ; 2) un récap de fin de course avec bouton de préinscription." }
          ]
        }
      ]
    },
    {
      title: "Démêler le vrai du faux",
      sub: "Crise de réplication, Dale Carnegie",
      lessons: [
        {
          title: "Les mythes qui ont la vie dure",
          cards: [
            { h: "La crise de la réplication", b: "Depuis les années 2010, des équipes indépendantes refont les expériences célèbres de psychologie. Beaucoup tiennent (ancrage, aversion à la perte), d'autres s'effondrent. Savoir lesquelles, c'est éviter de bâtir ta stratégie sur du sable.", src: "Open Science Collaboration (2015)" },
            { h: "Trois cas", b: "**Amorçage social** : Kahneman a reconnu en 2017 que les effets décrits dans son chapitre 4 ne pouvaient pas être aussi forts qu'il l'avait écrit.\n**Power posing** : en 2016, Dana Carney, co-autrice de l'étude originale, a déclaré ne plus croire à ces effets.\n**Épuisement de l'ego** : une réplication menée dans 23 laboratoires (2016) a trouvé un effet proche de zéro.", src: "Kahneman (2017) ; Carney (2016) ; Hagger et al. (2016)" },
            { h: "Le faux « 7-38-55 »", b: "On répète que la communication serait à 7 % les mots, 38 % la voix, 55 % le corps. Albert Mehrabian, auteur des études, précise qu'elles ne portaient que sur des messages ambigus concernant les **sentiments**, pas sur la communication en général.", src: "Mehrabian" }
          ],
          ex: [
            { t: "vf", q: "Daniel Kahneman a reconnu que les effets d'amorçage social décrits dans son livre étaient surestimés.", a: true, x: "Vrai. En 2017, en réponse à une analyse statistique de son chapitre 4, il a écrit avoir changé d'avis sur l'ampleur de ces effets. Un bel exemple d'honnêteté scientifique." },
            { t: "qcm", q: "Que dit vraiment Mehrabian de sa règle 7-38-55 ?", o: ["Elle ne vaut que pour des messages ambigus sur les émotions, pas pour toute communication", "Elle s'applique à toutes les présentations", "Elle a été confirmée dans 100 pays", "Elle concerne seulement les e-mails"], a: 0, x: "Si les mots ne comptaient que pour 7 %, tu comprendrais un film en langue étrangère. Les mots comptent, énormément." },
            { t: "vf", q: "Une grande réplication menée dans 23 laboratoires a confirmé un fort effet d'épuisement de l'ego (la volonté qui s'épuiserait comme un muscle).", a: false, x: "Faux. L'effet mesuré était proche de zéro. Le sujet reste débattu, mais l'idée d'un réservoir de volonté qui se vide n'est pas solide." },
            { t: "qcm", q: "Quel effet de psychologie a plutôt bien résisté aux réplications ?", o: ["L'ancrage", "Le power posing", "L'amorçage par des mots liés à la vieillesse", "L'épuisement de l'ego"], a: 0, x: "L'ancrage se reproduit de façon robuste dans de nombreuses études. Les trois autres ont échoué à des réplications sérieuses." },
            { t: "qcm", c: 1, q: "Un « expert » te vend une formation de prise de parole fondée sur la règle 7-38-55. Quelle est la bonne réaction ?", o: ["Te méfier : la base scientifique annoncée est un contresens", "Acheter, c'est un chiffre précis donc sérieux", "Demander une réduction", "Appliquer seulement les 55 % du corps"], a: 0, x: "Un chiffre précis n'est pas une preuve. Remonte toujours à la source et à ce qu'elle mesurait vraiment." },
            { t: "trou", q: "En 2016, Dana Carney a déclaré ne plus croire aux effets du ___ posing.", o: ["power", "yoga", "speed", "photo"], a: 0, x: "Elle était co-autrice de l'étude originale de 2010. Sa prise de position a beaucoup compté dans le débat sur la réplication." }
          ]
        },
        {
          title: "Se faire apprécier pour de vrai",
          cards: [
            { h: "Le classique de 1936", b: "Dale Carnegie a écrit un des livres de relations humaines les plus vendus au monde, réédité sans interruption depuis 1936. Ses conseils sont simples et toujours d'actualité.", src: "How to Win Friends and Influence People, Dale Carnegie (1936)" },
            { h: "Les essentiels", b: "Ne critique pas, ne condamne pas, ne te plains pas. Fais des **compliments sincères**. Intéresse-toi vraiment aux autres. **Retiens les prénoms.** Laisse l'autre parler. Parle de ce qui l'intéresse, lui. Évite les disputes : on ne gagne jamais vraiment une dispute.", src: "Carnegie" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Un membre du club se plaint publiquement que la sortie était mal organisée. Que conseillerait Carnegie ?", o: ["Le remercier pour son retour, reconnaître ce qui était vrai, et lui demander ce qu'il aurait fait", "Lui expliquer point par point pourquoi il a tort", "Supprimer son commentaire", "Ne rien répondre"], a: 0, x: "Gagner la dispute en public te ferait perdre un membre et ceux qui regardent. Reconnaître et impliquer transforme un critique en allié." },
            { t: "paires", q: "Associe chaque conseil de Carnegie à son application.", p: [["Retenir les prénoms", "Accueillir chaque nouveau à la sortie par son prénom"], ["Parler de ce qui intéresse l'autre", "Demander à une marque ce qui compte pour sa saison"], ["Compliment sincère", "Dire précisément ce que tu as aimé dans le travail d'une ambassadrice"], ["Éviter les disputes", "Ne pas répondre à chaud à un commentaire agressif"]], x: "Rien de spectaculaire, mais appliqué tous les jours, ça construit une réputation." },
            { t: "vf", q: "Selon Carnegie, un compliment est efficace même s'il n'est pas sincère.", a: false, x: "Faux. Il distingue l'appréciation sincère de la flatterie, qui se repère vite et produit l'effet inverse." },
            { t: "qcm", q: "Pourquoi retenir le prénom de quelqu'un a-t-il autant d'effet ?", o: ["C'est le signe le plus simple qu'on le considère comme une personne, pas un numéro", "Ça fait gagner du temps", "C'est une obligation de politesse", "Ça impressionne les autres"], a: 0, x: "Dans une communauté qui grandit, c'est ce qui fait qu'un club reste un club et pas un événement anonyme." },
            { t: "qcm", c: 1, q: "Une ambassadrice semble démotivée. Quelle ouverture suit Carnegie ?", o: ["« J'ai vu ton post sur la sortie de dimanche, l'idée du départ inversé était top. Comment tu le vis, toi, en ce moment ? »", "« Il faudrait que tu postes plus souvent. »", "« Tout va bien ? Parce que les chiffres baissent. »", "« Tu devrais faire comme Lyon. »"], a: 0, x: "Un compliment précis et sincère, puis une question ouverte sur elle. Aucune critique, aucune comparaison." }
          ]
        },
        {
          title: "Sommet : le message aux ambassadeurs",
          defi: true,
          cards: [{ h: "Tout mettre ensemble", b: "Unité, engagement, compliment sincère, question ouverte. Et rien que du vrai.", src: "Cialdini ; Carnegie" }],
          ex: [
            { t: "ecrit", ctx: "La participation aux sorties d'un club baisse depuis deux mois. Tu écris aux ambassadeurs du club.", q: "Rédige ton message (6 phrases maximum) pour les remobiliser.", crit: ["Commence par une appréciation sincère et précise", "Mobilise l'identité commune (unité)", "Implique-les : question ouverte ou demande de conseil", "Obtiens un petit engagement concret", "Aucune culpabilisation ni comparaison blessante"], ex: "Salut l'équipe, je repense encore à la montée de septembre : c'est grâce à vous que des inconnus sont repartis en se donnant rendez-vous. Ce club, c'est le nôtre, et je sens qu'on a un peu perdu le fil ces deux derniers mois. J'ai besoin de votre avis : qu'est-ce qui ferait revenir les habitués selon vous ? Proposez chacun une idée d'ici dimanche, on en teste une dès la prochaine sortie." }
          ]
        }
      ]
    }
  ],
  books: [
    { t: "Influence", a: "Robert Cialdini", y: 1984, proof: "Le livre de référence sur la persuasion, fondé sur des expériences et trois ans d'observation de vendeurs et recruteurs. Édition augmentée en 2021.", idea: "Réciprocité, engagement, preuve sociale, autorité, sympathie, rareté, unité." },
    { t: "Pre-Suasion", a: "Robert Cialdini", y: 2016, proof: "La suite d'Influence, qui introduit l'unité comme 7e principe.", idea: "Ce qui se passe juste avant ton message décide de la façon dont il sera reçu." },
    { t: "Thinking, Fast and Slow (Système 1 / Système 2)", a: "Daniel Kahneman", y: 2011, proof: "Synthèse des travaux qui ont valu le Nobel d'économie 2002. Le chapitre sur l'amorçage est à lire avec la mise à jour de 2017.", idea: "Notre pensée rapide se trompe de façon prévisible : ancrage, aversion à la perte, cadrage." },
    { t: "How to Win Friends and Influence People (Comment se faire des amis)", a: "Dale Carnegie", y: 1936, proof: "Un des livres de développement personnel les plus vendus de l'histoire, réédité depuis 90 ans.", idea: "Intéresse-toi sincèrement aux autres et n'essaie pas de gagner les disputes." },
    { t: "Nudge", a: "Richard Thaler et Cass Sunstein", y: 2008, proof: "Thaler a reçu le Nobel d'économie en 2017 pour ses travaux en économie comportementale.", idea: "La façon dont un choix est présenté change ce que les gens choisissent." }
  ]
});
