window.SUMMITS = window.SUMMITS || [];
window.SUMMITS.push({
  id: "vente",
  name: "Vendre",
  short: "Vente",
  color: "var(--c-vente)",
  tagline: "Décrocher des contrats, négocier ses tarifs, convaincre sans forcer.",
  units: [
    {
      title: "Écouter avant de pitcher",
      sub: "SPIN Selling, The Mom Test, Gong Labs",
      lessons: [
        {
          title: "La méthode SPIN",
          cards: [
            { h: "La plus grande étude jamais faite sur la vente", b: "Neil Rackham et l'équipe Huthwaite ont observé **35 000 rendez-vous commerciaux** pendant 12 ans. Conclusion : dans les grosses ventes, ce qui marche, ce n'est pas le pitch ni le closing, ce sont **les questions**.", src: "SPIN Selling, Neil Rackham (1988)" },
            { h: "S · P · I · N", b: "**Situation** : comprendre le contexte (à doser, ça ennuie vite le client).\n**Problème** : faire émerger une difficulté.\n**Implication** : faire mesurer ce que ce problème coûte.\n**Need-payoff** : faire dire au client ce que la solution lui apporterait.\nC'est le client qui formule la valeur, pas toi.", src: "SPIN Selling" },
            { h: "Écouter plus que parler", b: "Gong Labs a analysé des appels de vente B2B : chez les vendeurs les plus performants, le ratio tourne autour de **43 % de parole pour 57 % d'écoute**.", src: "Gong Labs" }
          ],
          ex: [
            { t: "qcm", q: "Dans SPIN, que désigne le « I » ?", o: ["Implication : ce que le problème coûte au client", "Intérêt : ce qui plaît au client", "Insight : une idée nouvelle apportée par le vendeur", "Invitation : la proposition de rendez-vous"], a: 0, x: "Les questions d'implication font mesurer au client la taille de son problème. Ce sont elles qui, d'après Rackham, distinguent le plus les vendeurs qui réussissent les grosses ventes." },
            { t: "ordre", q: "Remets ces questions dans l'ordre SPIN, pour un rendez-vous avec la responsable marketing d'une marque de chaussures trail.", items: ["Comment organisez-vous vos lancements de chaussures aujourd'hui ?", "Qu'est-ce qui vous a déçus dans votre dernière activation ?", "Si le modèle ne touche pas les traileurs avant le printemps, qu'est-ce que ça coûte en ventes ?", "Si des milliers de traileurs voyaient ce modèle testé sur un vrai terrain avant la saison, qu'est-ce que ça changerait ?"], x: "Situation, Problème, Implication, Need-payoff. Remarque que tu ne parles pas de ton offre avant la dernière question, et même là c'est elle qui décrit le bénéfice." },
            { t: "vf", q: "D'après les recherches de Rackham, poser beaucoup de questions de situation augmente les chances de conclure une grosse vente.", a: false, x: "Faux. Les vendeurs qui réussissent posent moins de questions de situation : elles apportent peu au client et l'ennuient. Fais tes recherches avant le rendez-vous pour ne garder que l'essentiel." },
            { t: "vf", q: "Selon Rackham, les techniques de closing qui mettent la pression marchent mieux dans les petites ventes que dans les grosses.", a: true, x: "Vrai. Sur un achat rapide et peu cher, la pression peut faire basculer. Sur un contrat important, elle braque l'acheteur, qui a le temps de réfléchir et de comparer." },
            { t: "qcm", c: 1, q: "Une marque t'écrit : « On a du budget pour le printemps, envoie-nous ton media kit. » Quelle réponse est la plus SPIN ?", o: ["« Avec plaisir. Pour t'envoyer la bonne proposition : qu'est-ce que vous voulez obtenir avec ce lancement, et qu'est-ce qui a manqué la dernière fois ? »", "Envoyer tout de suite le media kit complet avec la grille tarifaire.", "« Je te fais -20 % si tu signes avant vendredi. »", "« Notre audience est la meilleure du trail français, tu ne seras pas déçue. »"], a: 0, x: "Tu poses une question de problème avant d'envoyer quoi que ce soit. Ta proposition répondra à leur vrai enjeu au lieu d'être un catalogue qu'on compare au prix." },
            { t: "qcm", q: "D'après Gong Labs, quel ratio parole / écoute observe-t-on chez les meilleurs vendeurs ?", o: ["Environ 43 % de parole, 57 % d'écoute", "Environ 70 % de parole, 30 % d'écoute", "Environ 50 / 50", "Environ 20 % de parole, 80 % d'écoute"], a: 0, x: "Les meilleurs écoutent un peu plus qu'ils ne parlent, sans pour autant se taire. Les vendeurs moins performants parlent davantage, surtout dans les deals qu'ils perdent." },
            { t: "paires", q: "Associe chaque question à son type SPIN.", p: [["Combien de contenus sponsorisés faites-vous par an ?", "Situation"], ["Qu'est-ce qui ne vous satisfait pas dans vos résultats ?", "Problème"], ["Combien de ventes perdez-vous si personne ne parle du modèle ?", "Implication"], ["Qu'est-ce qu'une campagne réussie vous permettrait ?", "Need-payoff"]], x: "Les questions de situation et de problème ouvrent, les questions d'implication et de bénéfice font avancer la vente." }
          ]
        },
        {
          title: "Les bonnes questions",
          cards: [
            { h: "The Mom Test", b: "Rob Fitzpatrick part d'un constat : tout le monde te ment par politesse quand tu présentes ton idée, même ta mère. La solution : **parle de leur vie, pas de ton idée**, demande **des faits passés précis**, pas des opinions sur le futur.", src: "The Mom Test, Rob Fitzpatrick (2013)" },
            { h: "Un compliment n'est pas une donnée", b: "« Génial, on adore ! » ne vaut rien. Le vrai signal, c'est **l'engagement** : du temps (un rendez-vous), de la réputation (te présenter à leur boss) ou de l'argent (une précommande, un acompte).", src: "The Mom Test" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Tu veux savoir si un jeu de pronostics trail intéresse vraiment ton audience. Quelle question respecte le Mom Test ?", o: ["« La dernière fois que tu as suivi une course en direct, comment tu l'as suivie ? »", "« Est-ce que tu jouerais à un jeu de pronostics sur l'UTMB ? »", "« Tu trouves que c'est une bonne idée, un jeu de pronostics ? »", "« Combien tu paierais pour ce jeu ? »"], a: 0, x: "Elle porte sur un comportement passé et précis. Les trois autres demandent une opinion ou une promesse sur le futur, et les gens répondent ce qui te fait plaisir." },
            { t: "vf", q: "« C'est super, on adore ce que vous faites ! » est un bon signal d'achat.", a: false, x: "Faux. C'est un compliment, pas un engagement. Réponds-y en proposant une étape concrète : un appel daté, une intro à la personne qui décide, un brief." },
            { t: "paires", q: "Associe chaque signal à la « monnaie » d'engagement qu'il représente.", p: [["Elle bloque un appel de 30 min jeudi", "Temps"], ["Il te présente à sa directrice marketing", "Réputation"], ["Ils versent un acompte pour réserver la date", "Argent"]], x: "Fitzpatrick distingue ces trois monnaies. Plus l'engagement coûte au client, plus le signal est fiable." },
            { t: "qcm", q: "Pourquoi les questions sur le futur (« tu utiliserais… ? ») sont-elles trompeuses ?", o: ["Les gens sont trop optimistes sur ce qu'ils feront et veulent te faire plaisir", "Elles sont trop longues", "Elles sont illégales en prospection", "Elles mettent le client en colère"], a: 0, x: "On surestime toujours ce qu'on fera plus tard. Le passé, lui, ne ment pas : ce que quelqu'un a déjà fait, payé ou cherché est la meilleure prévision." },
            { t: "qcm", c: 1, q: "Fin d'un appel avec une marque, tout s'est bien passé. Quelle est la meilleure dernière phrase ?", o: ["« On se cale 20 minutes mardi avec ta responsable budget pour valider le format ? »", "« Super, n'hésite pas à revenir vers moi ! »", "« Je t'envoie une proposition et tu me dis. »", "« On reste en contact. »"], a: 0, x: "Tu demandes un engagement daté, avec la personne qui décide. « Reviens vers moi » laisse la vente mourir en silence." },
            { t: "trou", q: "Pour tester une idée, parle de leur ___, pas de ton idée.", o: ["vie", "budget", "concurrent", "avenir"], a: 0, x: "C'est la règle n°1 du Mom Test : interroge les gens sur ce qu'ils vivent et font déjà." }
          ]
        },
        {
          title: "Défi : 3 questions qui vendent",
          defi: true,
          cards: [{ h: "Ton premier défi écrit", b: "Écris, le coach corrige. C'est en produisant que tu retiens le mieux : on appelle ça l'effet de génération, et c'est un des principes les mieux établis de la recherche sur l'apprentissage.", src: "Make It Stick, Brown, Roediger, McDaniel (2014)" }],
          ex: [
            { t: "ecrit", ctx: "La responsable marketing d'une marque de chaussures lance un nouveau modèle trail au printemps. Tu as 20 minutes en visio avec elle.", q: "Écris 3 questions : une question Problème, une question Implication, une question Need-payoff.", crit: ["Une question de problème qui fait émerger une difficulté réelle", "Une question d'implication qui fait mesurer un coût (ventes, image, timing)", "Une question de bénéfice où c'est elle qui décrit la valeur", "Questions ouvertes, courtes, sans pitch caché"], ex: "P : « Sur vos derniers lancements trail, qu'est-ce qui a moins bien marché que prévu ? »\nI : « Si ce modèle arrive en magasin sans que les traileurs l'aient vu en conditions réelles, qu'est-ce que ça coûte sur la saison ? »\nN : « Si 100 000 traileurs le voyaient testé sur un vrai parcours dès mars, qu'est-ce que ça changerait pour vous ? »" }
          ]
        }
      ]
    },
    {
      title: "Enseigner, adapter, cadrer",
      sub: "The Challenger Sale (CEB / Gartner)",
      lessons: [
        {
          title: "Le profil Challenger",
          cards: [
            { h: "6 000 vendeurs étudiés", b: "Le CEB (aujourd'hui Gartner) a étudié plus de 6 000 commerciaux dans environ 90 entreprises. Tous entrent dans 5 profils : **le bosseur, le Challenger, le relationnel, le loup solitaire, le résolveur de problèmes**.", src: "The Challenger Sale, Dixon & Adamson (2011)" },
            { h: "Le gagnant et le perdant", b: "Près de **40 % des meilleurs vendeurs** sont des Challengers. Le profil relationnel, celui qui veut avant tout être apprécié, ne représente que **7 %** des meilleurs. L'écart grandit avec la complexité de la vente.", src: "The Challenger Sale" },
            { h: "Enseigner · Adapter · Cadrer", b: "Le Challenger **enseigne** au client quelque chose de neuf sur son propre business, **adapte** son message à chaque interlocuteur, et **cadre** la discussion, y compris sur l'argent, sans peur de la tension.", src: "The Challenger Sale" }
          ],
          ex: [
            { t: "qcm", q: "Quel profil est le plus représenté chez les meilleurs vendeurs de l'étude du CEB ?", o: ["Le Challenger", "Le relationnel", "Le bosseur", "Le résolveur de problèmes"], a: 0, x: "Près de 40 % des vendeurs stars sont des Challengers. Le relationnel arrive dernier, avec 7 %." },
            { t: "vf", q: "Dans l'étude du CEB, être apprécié du client suffit à devenir un des meilleurs vendeurs.", a: false, x: "Faux. Le profil relationnel est le moins représenté chez les stars. La relation compte, mais elle ne remplace pas une idée qui fait avancer le client." },
            { t: "paires", q: "Associe chaque action à la compétence Challenger.", p: [["Montrer à une marque un chiffre qu'elle ne connaît pas sur son public", "Enseigner"], ["Parler ventes au directeur commercial et image à la chargée de com", "Adapter"], ["Dire clairement que ton tarif ne baissera pas sans contrepartie", "Cadrer"]], x: "Enseigner crée la valeur, adapter la rend pertinente pour chacun, cadrer la protège." },
            { t: "qcm", c: 1, q: "Quel message d'ouverture est un vrai « enseignement commercial » pour une marque ?", o: ["« Sur notre compte, ce sont les carrousels qui expliquent l'actu autour d'un nom connu qui font venir le plus d'abonnés. Votre lancement peut devenir ce type d'actu plutôt qu'une pub de plus. »", "« Nous avons 100 000 abonnés très engagés. »", "« Nous adorons votre marque depuis toujours. »", "« Voici nos 4 formules, de 1 500 à 6 000 €. »"], a: 0, x: "Tu apportes une observation qu'elle n'a pas, tirée de tes données, et qui mène vers ce que toi seul sais faire. Les autres messages parlent de toi, pas de son problème." },
            { t: "vf", q: "D'après le CEB, l'avantage du Challenger est plus net dans les ventes complexes que dans les ventes simples.", a: true, x: "Vrai. Dans les ventes simples, les profils se valent à peu près. Plus la décision implique d'acteurs et d'enjeux, plus enseigner et cadrer font la différence." },
            { t: "qcm", q: "Que veut dire « cadrer » (take control) chez le Challenger ?", o: ["Assumer la tension : parler argent, relancer, défendre sa valeur", "Imposer sa solution coûte que coûte", "Contrôler l'agenda du client", "Refuser toute négociation"], a: 0, x: "Cadrer, ce n'est pas être agressif. C'est ne pas fuir les sujets inconfortables, à commencer par le prix." }
          ]
        },
        {
          title: "Parler prix sans trembler",
          cards: [
            { h: "La valeur d'abord, le prix ensuite", b: "Dans les données de Gong Labs, les meilleurs vendeurs abordent le prix **plus tard** dans l'appel, une fois la valeur établie, alors que les autres l'évoquent à n'importe quel moment.", src: "Gong Labs (2016)" },
            { h: "Ne donne rien, échange", b: "Une remise sans contrepartie apprend au client que ton premier prix était faux. Toute concession s'échange : « Je peux faire X **si** vous faites Y. »", src: "Getting to Yes, Fisher & Ury ; The Challenger Sale" },
            { h: "Trois options", b: "Présenter trois formules oriente souvent le choix vers celle du milieu : c'est **l'effet de compromis**, documenté en recherche marketing depuis les années 1980. Construis l'offre du milieu comme celle que tu veux vendre.", src: "Simonson (1989)" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Une marque demande -30 % sur ton offre. Quelle réponse protège ta valeur ?", o: ["« Je peux descendre si on passe de 3 à 2 carrousels, ou si vous vous engagez sur 3 activations dans l'année. Qu'est-ce qui vous convient le mieux ? »", "« OK pour -30 %, on veut vraiment travailler avec vous. »", "« C'est non. »", "« Je peux faire -15 %, c'est mon dernier mot. »"], a: 0, x: "Tu échanges une baisse contre un périmètre plus petit ou un engagement plus long. Le client choisit, mais ton prix unitaire reste crédible." },
            { t: "vf", q: "D'après Gong Labs, les meilleurs vendeurs parlent prix plutôt tard dans l'appel.", a: true, x: "Vrai. Ils installent d'abord le problème et la valeur. Le prix arrive quand il peut être comparé à ce qu'il rapporte." },
            { t: "qcm", q: "Tu proposes trois formules à une marque. Où places-tu l'offre que tu veux vraiment vendre ?", o: ["Au milieu", "En premier, la moins chère", "En dernier, la plus chère", "Peu importe"], a: 0, x: "L'effet de compromis pousse beaucoup d'acheteurs vers l'option intermédiaire. L'offre haute sert aussi d'ancre qui rend celle du milieu raisonnable." },
            { t: "calc", c: 1, q: "Un contrat à 3 000 € te demande 25 h de travail. Les allers-retours avec le client en ajoutent 10. Quel est ton taux horaire réel, en € par heure (arrondi) ?", a: 86, tol: 1, unit: "€/h", x: "3 000 € ÷ 35 h ≈ 86 €/h, contre 120 €/h prévus. Les échanges sans fin coûtent cher : chiffre-les, ou facture-les." },
            { t: "trou", q: "Une concession ne se donne pas, elle s'___.", o: ["échange", "annonce", "négocie seule", "offre"], a: 0, x: "« Si vous… alors je… » : chaque geste de ta part appelle un geste de leur part." },
            { t: "qcm", q: "Pourquoi une remise sans contrepartie est-elle dangereuse ?", o: ["Elle signale que ton premier prix était gonflé et invite à redemander", "Elle est interdite par la loi", "Elle rallonge le contrat", "Elle oblige à refaire un devis"], a: 0, x: "Le client apprend qu'insister paie. Au contrat suivant, il redemandera, et plus fort." }
          ]
        },
        {
          title: "Défi : l'e-mail qui enseigne",
          defi: true,
          cards: [{ h: "Rappel", b: "Un bon e-mail Challenger suit trois temps : **une observation** qu'ils n'ont pas, **la conséquence** pour eux, puis **ce que tu proposes** pour en profiter.", src: "The Challenger Sale" }],
          ex: [
            { t: "ecrit", ctx: "Tu écris à une marque de textile outdoor qui n'a jamais travaillé avec Les Traileurs.", q: "Rédige un e-mail de prospection de 5 phrases maximum qui commence par un enseignement (une observation utile pour eux), puis propose un appel.", crit: ["Ouvre sur une observation qu'ils ne connaissent probablement pas, pas sur toi", "Relie cette observation à un enjeu de la marque", "Amène l'offre comme conséquence logique", "Termine par une demande précise et datée", "5 phrases maximum, sans superlatifs creux"], ex: "Objet : ce que vos clientes lisent avant d'acheter\n\nBonjour Claire, sur @lestraileurs, ce sont les carrousels qui expliquent une actu autour d'un nom connu qui nous font gagner le plus d'abonnés, bien plus que les visuels produit. Votre collection hiver arrive au moment où la saison des ultras fait l'actu. On peut raconter vos pièces à travers ces histoires-là plutôt que dans une pub de plus. Je vous propose 20 minutes mardi ou jeudi pour vous montrer deux exemples ?" }
          ]
        }
      ]
    },
    {
      title: "Négocier",
      sub: "Never Split the Difference, Getting to Yes",
      lessons: [
        {
          title: "L'empathie tactique",
          cards: [
            { h: "La méthode d'un négociateur du FBI", b: "Chris Voss a négocié des prises d'otages pour le FBI. Sa thèse : une négociation est d'abord émotionnelle. Avant d'argumenter, fais en sorte que l'autre se sente **compris**.", src: "Never Split the Difference, Chris Voss (2016)" },
            { h: "4 outils", b: "**Miroir** : répéter les 1 à 3 derniers mots, sur un ton de question.\n**Étiquette** : nommer l'émotion (« On dirait que… »).\n**Audit d'accusation** : dire toi-même les reproches qu'il pourrait te faire.\n**Question calibrée** : « Comment… ? » ou « Qu'est-ce qui… ? », jamais « Pourquoi ».", src: "Never Split the Difference" },
            { h: "Viser « C'est exactement ça »", b: "« Vous avez raison » sert souvent à te faire taire. « C'est exactement ça » montre que l'autre se sent compris : c'est là que la négociation bascule.", src: "Never Split the Difference" }
          ],
          ex: [
            { t: "paires", q: "Associe chaque phrase à la technique de Voss.", p: [["« …trop cher ? »", "Miroir"], ["« On dirait que le budget de cette campagne est déjà serré. »", "Étiquette"], ["« Vous allez sûrement trouver qu'on est plus chers que les autres médias trail. »", "Audit d'accusation"], ["« Comment je peux faire ça avec ce budget ? »", "Question calibrée"]], x: "Ces quatre outils servent le même but : faire parler l'autre et lui montrer que tu as compris sa position." },
            { t: "qcm", c: 1, q: "Une marque te dit : « Votre tarif est trop élevé pour nous. » Quelle réponse applique l'empathie tactique ?", o: ["« On dirait que vous avez déjà engagé une bonne partie du budget de la saison. »", "« Nos tarifs sont justifiés par notre audience. »", "« Combien vous avez ? »", "« Pourquoi vous trouvez ça cher ? »"], a: 0, x: "L'étiquette nomme ce qu'elle vit sans la contredire. Elle va préciser sa contrainte, et tu sauras sur quoi tu négocies vraiment." },
            { t: "vf", q: "Voss conseille d'utiliser des questions qui commencent par « Pourquoi ».", a: false, x: "Faux. « Pourquoi » sonne comme un reproche et met sur la défensive. Il recommande « Comment » et « Qu'est-ce qui »." },
            { t: "qcm", q: "Quelle réponse de l'autre partie signale, selon Voss, qu'il se sent vraiment compris ?", o: ["« C'est exactement ça. »", "« Vous avez raison. »", "« Oui, oui. »", "« Pourquoi pas. »"], a: 0, x: "« Vous avez raison » est souvent une façon polie de clore. « C'est exactement ça » signifie que ta reformulation est juste." },
            { t: "qcm", c: 1, q: "Tu dois annoncer à un partenaire que le contenu promis sortira avec une semaine de retard. Comment ouvrir avec un audit d'accusation ?", o: ["« Tu vas sûrement penser qu'on n'est pas fiables et que tu as eu tort de nous faire confiance. »", "« Petit souci de planning, rien de grave. »", "« Ce n'est pas de notre faute, le photographe a annulé. »", "« Bonne nouvelle, on a du temps en plus pour peaufiner ! »"], a: 0, x: "En formulant toi-même le pire, tu désamorces le reproche. L'autre répond souvent « Non, pas du tout », et la discussion part sur de bonnes bases." },
            { t: "trou", q: "Le miroir consiste à répéter les ___ derniers mots de l'autre.", o: ["1 à 3", "5 à 10", "15", "tous les"], a: 0, x: "Juste quelques mots, sur un ton interrogatif. L'autre développe de lui-même." }
          ]
        },
        {
          title: "Intérêts, plan B et contre-offres",
          cards: [
            { h: "Intérêts, pas positions", b: "Le Harvard Negotiation Project a posé 4 principes : séparer les personnes du problème, **se concentrer sur les intérêts plutôt que sur les positions**, inventer des options gagnant-gagnant, s'appuyer sur des critères objectifs.", src: "Getting to Yes, Fisher & Ury (1981)" },
            { h: "Ton plan B fait ta force", b: "La **MESORE** (BATNA en anglais) est ta meilleure solution de rechange si l'accord échoue. Plus elle est solide, moins tu as besoin de céder. Construis-la avant de négocier.", src: "Getting to Yes" },
            { h: "La méthode Ackerman", b: "Côté acheteur, Voss propose : fixe ton prix cible, ouvre à **65 %**, puis monte à **85 %, 95 %, 100 %**. Les hausses rétrécissent, le dernier chiffre est précis (pas rond), et tu ajoutes à la fin un petit élément non financier.", src: "Never Split the Difference" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Une marque exige l'exclusivité totale pendant 12 mois. Quel est probablement son intérêt derrière cette position ?", o: ["Ne pas voir un concurrent profiter de la même audience pendant sa campagne", "Te faire perdre de l'argent", "Contrôler ta ligne éditoriale", "Tester ta loyauté"], a: 0, x: "Une fois l'intérêt identifié, tu peux proposer une option : exclusivité sur la seule catégorie chaussures, pendant les 3 mois de campagne. L'intérêt est servi, ta liberté préservée." },
            { t: "vf", q: "Ta MESORE (BATNA) se construit avant la négociation, pas pendant.", a: true, x: "Vrai. Deux autres marques intéressées par le même format, c'est un plan B qui te permet de dire non sereinement." },
            { t: "calc", q: "Tu commandes des maillots personnalisés pour un club. Ton prix cible est 2 000 €. Selon la méthode Ackerman, quelle est ta première offre, en euros ?", a: 1300, tol: 0, unit: "€", x: "65 % de 2 000 € = 1 300 €. Ensuite 1 700 € (85 %), 1 900 € (95 %), puis un chiffre précis comme 1 987 € avec un petit bonus non financier." },
            { t: "ordre", q: "Remets les étapes Ackerman dans l'ordre, pour un prix cible de 2 000 €.", items: ["Offre à 1 300 € (65 %)", "Remontée à 1 700 € (85 %)", "Remontée à 1 900 € (95 %)", "Offre finale précise à 1 987 € + un élément non financier"], x: "Des hausses qui rétrécissent signalent que tu approches de ta limite. Le chiffre non rond paraît calculé, donc ferme." },
            { t: "paires", q: "Associe chaque principe de Getting to Yes à son application.", p: [["Séparer les personnes du problème", "Rester cordial même si le désaccord sur le prix est dur"], ["Intérêts, pas positions", "Chercher pourquoi la marque veut l'exclusivité"], ["Options gagnant-gagnant", "Proposer une exclusivité limitée à une catégorie"], ["Critères objectifs", "S'appuyer sur la portée moyenne réelle de tes posts"]], x: "Ces quatre principes transforment un bras de fer en résolution de problème à deux." },
            { t: "qcm", q: "Pourquoi Voss recommande-t-il un dernier chiffre précis, comme 1 987 € ?", o: ["Il donne l'impression d'un calcul sérieux, donc d'une limite réelle", "Il est plus facile à retenir", "Il est obligatoire sur une facture", "Il porte chance"], a: 0, x: "Un chiffre rond invite à négocier encore. Un chiffre précis semble résulter d'un calcul que tu ne peux pas dépasser." }
          ]
        },
        {
          title: "Sommet : la contre-proposition",
          defi: true,
          cards: [{ h: "Tout mettre ensemble", b: "Étiquette pour désamorcer, question calibrée pour faire chercher l'autre, concession échangée contre une contrepartie. Et toujours en tête : ton plan B.", src: "Voss ; Fisher & Ury" }],
          ex: [
            { t: "ecrit", ctx: "Une marque veut un partenariat annuel avec Les Traileurs, mais demande -30 % sur ta grille et l'exclusivité totale pendant 12 mois.", q: "Rédige ta réponse par e-mail (6 phrases maximum).", crit: ["Utilise au moins une étiquette ou un audit d'accusation", "Pose au moins une question calibrée (Comment / Qu'est-ce qui)", "N'accorde aucune remise sans contrepartie", "Propose une option qui sert l'intérêt de la marque (exclusivité ciblée, durée réduite…)", "Reste cordial et ferme"], ex: "Bonjour Thomas, merci pour la proposition. On dirait que vous voulez surtout éviter qu'un concurrent profite de notre audience pendant votre lancement, et je le comprends. Une exclusivité sur la catégorie chaussures pendant vos 3 mois de campagne réglerait ce point. Sur le tarif, je peux revoir le prix si on passe à 4 activations dans l'année plutôt que 3 au détail. Comment voyez-vous la répartition sur la saison ?" }
          ]
        }
      ]
    }
  ],
  books: [
    { t: "SPIN Selling", a: "Neil Rackham", y: 1988, proof: "Fondé sur l'observation de 35 000 rendez-vous commerciaux pendant 12 ans par l'équipe Huthwaite.", idea: "Dans les grosses ventes, ce sont les questions d'implication et de bénéfice qui font signer, pas le closing." },
    { t: "The Challenger Sale", a: "Matthew Dixon et Brent Adamson", y: 2011, proof: "Étude du CEB (Gartner) sur plus de 6 000 commerciaux : près de 40 % des meilleurs sont des Challengers.", idea: "Enseigne au client quelque chose de neuf sur son business, adapte, et assume la tension." },
    { t: "Never Split the Difference", a: "Chris Voss", y: 2016, proof: "Techniques issues de la négociation de crise au FBI, devenues une référence en négociation commerciale.", idea: "Fais d'abord en sorte que l'autre se sente compris : miroir, étiquette, questions calibrées." },
    { t: "Getting to Yes (Comment réussir une négociation)", a: "Roger Fisher et William Ury", y: 1981, proof: "Issu du Harvard Negotiation Project, enseigné dans la plupart des écoles de commerce et de droit.", idea: "Négocie sur les intérêts, pas sur les positions, et connais ta solution de rechange." },
    { t: "The Mom Test", a: "Rob Fitzpatrick", y: 2013, proof: "Le guide de référence des fondateurs pour interroger des clients sans se faire mentir.", idea: "Parle de leur vie et de faits passés, pas de ton idée. Seul l'engagement compte." }
  ]
});
