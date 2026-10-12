window.SUMMITS = window.SUMMITS || [];
window.SUMMITS.push({
  id: "argent",
  name: "Faire fructifier",
  short: "Argent",
  color: "var(--c-argent)",
  tagline: "Garder ce que tu gagnes, le faire grandir, et piloter l'argent de ta boîte.",
  units: [
    {
      title: "Garder ce que tu gagnes",
      sub: "The Psychology of Money, I Will Teach You to Be Rich",
      lessons: [
        {
          title: "Se payer en premier",
          cards: [
            { h: "Avant de commencer", b: "Ce parcours explique des principes reconnus par les meilleurs auteurs. Ce n'est **pas un conseil financier personnalisé** : pour tes décisions, appuie-toi aussi sur ton expert-comptable ou un conseiller.", src: "Les Cinq Sommets" },
            { h: "Une règle de 1926", b: "Dans **L'Homme le plus riche de Babylone**, George Clason résume tout en une règle : garde pour toi une part de tout ce que tu gagnes, au moins un dixième, **avant** de payer quoi que ce soit d'autre.", src: "The Richest Man in Babylon, George Clason (1926)" },
            { h: "Automatiser", b: "Ramit Sethi ajoute l'outil moderne : des **virements automatiques** le jour où l'argent arrive. Ce qui part avant que tu le voies ne se dépense pas. Il propose aussi un plan simple : 50-60 % charges fixes, 10 % investissement, 5-10 % épargne pour des projets, 20-35 % de dépenses sans culpabilité.", src: "I Will Teach You to Be Rich, Ramit Sethi (2009)" }
          ],
          ex: [
            { t: "qcm", q: "Que veut dire « se payer en premier » ?", o: ["Mettre de côté une part de ses revenus dès qu'ils arrivent, avant les autres dépenses", "Se verser un salaire avant de payer les fournisseurs", "Acheter ce qui nous fait plaisir en premier", "Rembourser ses dettes en premier"], a: 0, x: "L'épargne devient une dépense prioritaire, pas ce qui reste à la fin du mois (souvent rien)." },
            { t: "vf", q: "Selon Sethi, la meilleure façon d'épargner régulièrement est de compter sur sa volonté chaque mois.", a: false, x: "Faux. Il mise tout sur l'automatisation : un virement programmé ne dépend ni de ta motivation ni de ta mémoire." },
            { t: "calc", q: "Tu te verses 2 800 € par mois. Avec la règle de Clason (au moins un dixième), combien mets-tu de côté au minimum chaque mois, en euros ?", a: 280, tol: 0, unit: "€", x: "10 % de 2 800 € = 280 €. Programme le virement le jour où ton salaire arrive." },
            { t: "qcm", q: "Une épargne de précaution correspond souvent à :", o: ["3 à 6 mois de dépenses, et davantage quand les revenus sont irréguliers", "1 semaine de dépenses", "2 ans de salaire", "Le montant d'un loyer"], a: 0, x: "Elle sert à encaisser un imprévu sans vendre tes placements au mauvais moment ni t'endetter. Un entrepreneur, aux revenus variables, vise plutôt le haut de la fourchette." },
            { t: "paires", q: "Associe chaque poste du plan de Sethi à sa part indicative.", p: [["Charges fixes", "50 à 60 %"], ["Investissement", "10 %"], ["Épargne pour des projets", "5 à 10 %"], ["Dépenses sans culpabilité", "20 à 35 %"]], x: "Le dernier poste est essentiel : dépenser sans culpabilité ce qui est prévu pour ça rend le plan tenable dans la durée." },
            { t: "trou", q: "Ce qui part ___ ne se dépense pas.", o: ["automatiquement", "en espèces", "le soir", "par chèque"], a: 0, x: "L'automatisation retire la décision du quotidien. C'est le meilleur allié de la discipline." }
          ]
        },
        {
          title: "La psychologie de l'argent",
          cards: [
            { h: "Le comportement compte plus que le savoir", b: "Morgan Housel raconte des histoires vraies pour montrer une idée : réussir avec l'argent dépend moins de ce que tu sais que de **ton comportement**, surtout face à la peur et à l'envie.", src: "The Psychology of Money, Morgan Housel (2020)" },
            { h: "Ses idées clés", b: "**Assez** : savoir quand on a assez évite de tout risquer pour plus.\n**Marge d'erreur** : prévois que tes plans se passeront moins bien que prévu.\n**La richesse ne se voit pas** : c'est l'argent que tu n'as pas dépensé.\n**Le temps** : l'immense majorité de la fortune de Warren Buffett est arrivée après ses 65 ans, parce qu'il a investi très longtemps.", src: "The Psychology of Money" }
          ],
          ex: [
            { t: "qcm", q: "D'après Housel, pourquoi la fortune de Warren Buffett est-elle si grande ?", o: ["Surtout parce qu'il investit depuis l'enfance et ne s'est jamais arrêté", "Uniquement parce qu'il choisit les meilleures actions", "Grâce à un héritage", "Parce qu'il a pris des risques énormes"], a: 0, x: "Son talent compte, mais c'est la durée qui fait exploser les intérêts composés. L'essentiel de sa fortune est arrivé après 65 ans." },
            { t: "vf", q: "Pour Housel, la richesse, c'est surtout ce qu'on voit : la voiture, la maison, la montre.", a: false, x: "Faux. Ce qu'on voit, c'est ce qui a été dépensé. La richesse, ce sont les actifs qu'on n'a pas transformés en objets." },
            { t: "qcm", q: "Qu'est-ce que la « marge d'erreur » chez Housel ?", o: ["Prévoir que les choses se passeront moins bien que prévu, pour pouvoir rester dans la partie", "Le pourcentage de frais d'un fonds", "L'écart entre deux devis", "Une erreur de calcul acceptable"], a: 0, x: "Survivre aux mauvaises années compte plus que maximiser les bonnes. Celui qui doit vendre au pire moment a perdu, même avec la bonne stratégie." },
            { t: "qcm", c: 1, q: "Chez Les Traileurs, l'essentiel du chiffre d'affaires vient des partenariats avec les marques. Quelle idée de Housel s'applique le plus directement ?", o: ["La marge d'erreur : prévoir le cas où plusieurs marques coupent leur budget la même année", "La richesse ne se voit pas", "Savoir quand on a assez", "Raisonnable plutôt que rationnel"], a: 0, x: "Une source de revenus dominante, c'est un scénario de crise à préparer : trésorerie d'avance, diversification progressive, charges fixes maîtrisées." },
            { t: "trou", q: "Savoir quand on en a ___ évite de risquer ce qu'on a pour ce qu'on n'a pas.", o: ["assez", "trop", "peu", "besoin"], a: 0, x: "Housel rappelle que des gens très riches ont tout perdu en voulant plus, alors qu'ils avaient déjà tout ce qu'il leur fallait." },
            { t: "vf", q: "Selon Housel, mieux vaut une stratégie raisonnable qu'on tient vraiment qu'une stratégie parfaite qu'on abandonne à la première crise.", a: true, x: "Vrai. Il préfère « raisonnable » à « rationnel » : le meilleur plan est celui que tu peux suivre quand les marchés chutent." }
          ]
        },
        {
          title: "Défi : ta règle de trésorerie",
          defi: true,
          cards: [{ h: "Écris ta règle", b: "Une bonne règle d'argent est simple, automatique et prévoit le pire. Tu l'écris une fois, tu l'appliques à chaque facture.", src: "Clason ; Sethi ; Housel" }],
          ex: [
            { t: "ecrit", ctx: "Les Traileurs encaisse des montants irréguliers selon les contrats des marques.", q: "Écris la règle que tu appliques à chaque paiement reçu, en 5 lignes maximum : quelles parts vont où, et pourquoi.", crit: ["Met de côté la TVA collectée et les charges/impôts avant tout", "Prévoit une réserve de trésorerie pour les mois creux", "Sépare clairement l'argent de la société de ta rémunération", "Règle simple et automatisable", "Tient compte de l'irrégularité des revenus"], ex: "À chaque facture payée :\n1. La TVA part immédiatement sur un compte dédié, elle n'est pas à nous.\n2. 25 % du HT vont sur un compte « impôts et charges ».\n3. 15 % vont en réserve jusqu'à atteindre 6 mois de charges fixes.\n4. Ma rémunération est fixe chaque mois, versée depuis la trésorerie, jamais calée sur le dernier gros contrat.\n5. Le reste finance le développement (stagiaire, contenus)." }
          ]
        }
      ]
    },
    {
      title: "Faire grandir son argent",
      sub: "Bogle, Malkiel, Graham, SPIVA",
      lessons: [
        {
          title: "Les intérêts composés",
          cards: [
            { h: "La boule de neige", b: "Avec les intérêts composés, tes gains produisent à leur tour des gains. Au début, ça paraît lent. Après 20 ou 30 ans, la courbe s'envole. **Le facteur le plus puissant, c'est le temps.**", src: "Housel ; Bogle" },
            { h: "La règle de 72", b: "Pour savoir en combien d'années ton argent double : **72 ÷ taux annuel**. À 6 % par an, il double en environ 12 ans. À 8 %, en environ 9 ans.", src: "Règle classique de finance" },
            { h: "Un exemple", b: "200 € investis chaque mois pendant 30 ans à 6 % par an : tu as versé **72 000 €**, tu te retrouves avec environ **200 000 €**. Les rendements passés ne garantissent pas les futurs, mais la mécanique est là.", src: "Calcul : versements mensuels, capitalisation mensuelle" }
          ],
          ex: [
            { t: "calc", q: "Avec la règle de 72, en combien d'années un placement à 8 % par an double-t-il ?", a: 9, tol: 0, unit: "ans", x: "72 ÷ 8 = 9 ans. À 4 %, il faudrait 18 ans : le taux change tout sur la durée." },
            { t: "qcm", q: "Quel est le facteur le plus puissant des intérêts composés ?", o: ["La durée", "Le montant de départ", "Le nombre de placements", "La date de début dans l'année"], a: 0, x: "Commencer 10 ans plus tôt pèse souvent plus que doubler ses versements plus tard." },
            { t: "vf", q: "200 € par mois pendant 30 ans à 6 % par an donnent environ 200 000 €, pour 72 000 € versés.", a: true, x: "Vrai, si le rendement moyen est de 6 % sur toute la période. Plus de la moitié du résultat vient des intérêts sur les intérêts." },
            { t: "calc", q: "Combien d'années faut-il, d'après la règle de 72, pour qu'un livret à 3 % double ?", a: 24, tol: 0, unit: "ans", x: "72 ÷ 3 = 24 ans. Un livret protège ton épargne de précaution, mais ne la fait pas vraiment grandir." },
            { t: "qcm", q: "Pourquoi commencer tôt, même avec de petites sommes ?", o: ["Chaque année de plus laisse les gains produire de nouveaux gains", "Les banques donnent un bonus aux jeunes", "Les petites sommes rapportent un meilleur taux", "Pour payer moins d'impôts"], a: 0, x: "C'est le message de tout le parcours : le temps est ton actif le plus précieux, et il ne se rattrape pas." }
          ]
        },
        {
          title: "Frais, indices et patience",
          cards: [
            { h: "Acheter la botte de foin", b: "John Bogle, fondateur de Vanguard, a lancé en 1976 le premier fonds indiciel pour les particuliers. Son idée : plutôt que chercher l'aiguille dans la botte de foin, **achète toute la botte**, avec des frais minimes.", src: "The Little Book of Common Sense Investing, John Bogle (2007)" },
            { h: "Ce que disent les chiffres", b: "Selon le rapport SPIVA Europe de fin 2025, **97 % des fonds actions gérés activement en Europe** ont fait moins bien que leur indice de référence sur 10 ans.", src: "S&P Dow Jones Indices, SPIVA Europe (2025)" },
            { h: "Monsieur Marché", b: "Benjamin Graham, maître de Warren Buffett, imagine un associé lunatique, Monsieur Marché, qui te propose chaque jour un prix différent. Tu n'es pas obligé de l'écouter : profite de ses humeurs au lieu de les subir.", src: "The Intelligent Investor, Benjamin Graham (1949)" }
          ],
          ex: [
            { t: "qcm", q: "Selon SPIVA Europe (fin 2025), quelle part des fonds actions actifs européens a fait moins bien que son indice sur 10 ans ?", o: ["97 %", "50 %", "25 %", "10 %"], a: 0, x: "Sur longue période, battre l'indice après frais est l'exception. D'où l'intérêt des fonds indiciels à bas coût." },
            { t: "calc", q: "10 000 € placés 30 ans à 7 % brut par an. Avec 0,2 % de frais, tu obtiens environ 72 000 €. Avec 2 % de frais, environ 43 000 €. Combien de milliers d'euros les frais élevés t'ont-ils coûté ? (arrondi)", a: 29, tol: 1, unit: "k€", x: "Environ 29 000 €, soit 40 % du résultat. Les frais se composent contre toi, exactement comme les intérêts se composent pour toi." },
            { t: "vf", q: "Pour Bogle, il vaut mieux acheter tout le marché à bas coût que chercher les rares fonds qui le battront.", a: true, x: "Vrai. C'est la « botte de foin » : tu obtiens le rendement du marché, moins des frais minuscules." },
            { t: "qcm", q: "Le marché chute de 20 % en un mois. Que conseillerait Graham avec Monsieur Marché ?", o: ["Ne pas vendre sous le coup de la peur ; une baisse peut même être une occasion", "Tout vendre immédiatement", "Emprunter pour acheter plus", "Changer de stratégie chaque semaine"], a: 0, x: "Monsieur Marché est parfois euphorique, parfois déprimé. Ton plan, lui, ne doit pas dépendre de son humeur." },
            { t: "paires", q: "Associe chaque auteur à son idée principale.", p: [["John Bogle", "Acheter tout le marché à bas coût"], ["Benjamin Graham", "Monsieur Marché et la marge de sécurité"], ["Burton Malkiel", "Les cours suivent une marche au hasard difficile à prévoir"], ["Morgan Housel", "Le comportement compte plus que le savoir"]], x: "Quatre approches, une même conclusion : la discipline et la patience battent l'agitation." },
            { t: "trou", q: "Les frais se ___ contre toi, comme les intérêts se composent pour toi.", o: ["composent", "remboursent", "plafonnent", "annulent"], a: 0, x: "Un écart de 1,8 point de frais par an paraît petit. Sur 30 ans, il coûte environ 40 % du capital final." }
          ]
        },
        {
          title: "Défi : explique les intérêts composés",
          defi: true,
          cards: [{ h: "Enseigner pour apprendre", b: "Expliquer une notion à quelqu'un d'autre est une des meilleures façons de la retenir. Et ça sert aussi pour un carrousel.", src: "Make It Stick" }],
          ex: [
            { t: "ecrit", ctx: "Un membre du club de 25 ans te demande s'il vaut la peine de commencer à investir avec seulement 100 € par mois.", q: "Réponds-lui en 4 à 6 phrases, sans jargon, avec un exemple chiffré.", crit: ["Explique les intérêts composés simplement", "Insiste sur le rôle du temps", "Un exemple chiffré cohérent", "Mentionne les frais ou la diversification", "Ne promet aucun rendement garanti"], ex: "Oui, parce que ce qui compte le plus, c'est le temps, pas le montant. Tes gains produisent eux-mêmes des gains, et cet effet boule de neige grossit chaque année. Avec 100 € par mois à 6 % en moyenne, tu aurais environ 100 000 € dans 30 ans, pour 36 000 € versés. Ce n'est pas garanti, les marchés montent et descendent, mais sur longue période c'est la mécanique. Choisis un fonds qui réplique tout le marché mondial avec des frais très bas, et programme un virement automatique." }
          ]
        }
      ]
    },
    {
      title: "L'argent de l'entrepreneur",
      sub: "Trésorerie, prix, placements français",
      lessons: [
        {
          title: "Piloter la trésorerie",
          cards: [
            { h: "L'argent de la SAS n'est pas le tien", b: "La société est une personne distincte de toi. Son argent en sort par des voies prévues : **rémunération, dividendes, remboursement de frais justifiés**. Le prendre autrement peut constituer un abus de biens sociaux.", src: "Droit des sociétés" },
            { h: "La TVA n'est pas à toi", b: "Sur une facture de 12 000 € HT, tu encaisses 14 400 € TTC. Les **2 400 € de TVA** appartiennent à l'État : mets-les de côté dès l'encaissement.", src: "Principe de la TVA (taux normal 20 %)" },
            { h: "Réserve et concentration", b: "Garde une réserve de plusieurs mois de charges fixes. Et surveille la part de ton premier client ou de ta première source de revenus : plus elle est grande, plus ta marge d'erreur doit l'être aussi.", src: "Housel ; gestion d'entreprise" }
          ],
          ex: [
            { t: "calc", c: 1, q: "Les Traileurs facture un contrat 12 000 € HT avec une TVA à 20 %. Combien d'euros de TVA dois-tu mettre de côté ?", a: 2400, tol: 0, unit: "€", x: "12 000 × 20 % = 2 400 €. Le client paie 14 400 €, mais seuls 12 000 € sont du chiffre d'affaires." },
            { t: "calc", c: 1, q: "Tes charges fixes sont de 3 000 € par mois. Tu veux une réserve de 6 mois. Quel montant vises-tu, en euros ?", a: 18000, tol: 0, unit: "€", x: "6 × 3 000 € = 18 000 €. De quoi traverser une saison creuse sans brader tes tarifs." },
            { t: "vf", q: "Dans une SAS, tu peux utiliser librement le compte de la société pour tes dépenses personnelles, du moment que tu rembourses plus tard.", a: false, x: "Faux. L'argent de la société sort par des voies prévues. Mélanger les deux crée des risques juridiques et fiscaux. Parles-en à ton expert-comptable." },
            { t: "qcm", c: 1, q: "L'essentiel de ton chiffre d'affaires vient d'une seule source : les marques. Quelle est la démarche la plus prudente ?", o: ["Renforcer la réserve et développer progressivement d'autres revenus", "Tout miser sur les marques tant que ça marche", "Baisser tes tarifs pour sécuriser les contrats", "Embaucher plusieurs salariés tout de suite"], a: 0, x: "Plus une source domine, plus la réserve doit être solide. La diversification se construit pas à pas, sans lâcher ce qui fonctionne." },
            { t: "qcm", c: 1, q: "Ton audience est passée de 75 000 à 100 000 abonnés en un an. Que dit la logique de prix ?", o: ["Ta valeur pour les marques a augmenté, tes tarifs doivent suivre", "Garder les mêmes prix pour ne froisser personne", "Baisser les prix pour signer plus de contrats", "Facturer au nombre d'heures passées"], a: 0, x: "Tu vends de l'attention et de la confiance, pas des heures. Quand la valeur livrée augmente, le prix doit suivre, en l'annonçant à l'avance." },
            { t: "trou", q: "Le montant HT plus la TVA donne le montant ___.", o: ["TTC", "net", "brut", "HT"], a: 0, x: "HT : hors taxes. TTC : toutes taxes comprises. Ton chiffre d'affaires se compte en HT." }
          ]
        },
        {
          title: "Où placer son argent en France",
          cards: [
            { h: "Chaque enveloppe a son rôle", b: "**Livret A** : disponible à tout moment, intérêts sans impôt, plafond de 22 950 €. Idéal pour l'épargne de précaution.\n**PEA** : pour investir en actions européennes ou via des fonds éligibles ; plafond de versements de 150 000 € ; après 5 ans, les gains échappent à l'impôt sur le revenu (les prélèvements sociaux restent dus).", src: "Règles fiscales françaises (2026)" },
            { h: "Assurance-vie et PER", b: "**Assurance-vie** : enveloppe souple ; après 8 ans, un abattement annuel s'applique sur les gains retirés (4 600 € pour une personne seule, 9 200 € pour un couple).\n**PER** : les versements peuvent réduire ton revenu imposable, mais l'argent est en principe bloqué jusqu'à la retraite.", src: "Règles fiscales françaises (2026)" },
            { h: "À vérifier", b: "Les règles fiscales changent. Vérifie les conditions du moment avant d'ouvrir ou de verser, et fais-toi conseiller pour ta situation.", src: "Les Cinq Sommets" }
          ],
          ex: [
            { t: "paires", q: "Associe chaque besoin à l'enveloppe la plus adaptée.", p: [["Épargne de précaution disponible tout de suite", "Livret A"], ["Investir en actions sur le long terme avec un avantage après 5 ans", "PEA"], ["Enveloppe souple avec avantage après 8 ans", "Assurance-vie"], ["Réduire son revenu imposable en préparant la retraite", "PER"]], x: "La bonne enveloppe dépend de quand tu auras besoin de l'argent. Le temps décide, pas la promesse de rendement." },
            { t: "qcm", q: "Quel est le plafond de versements d'un PEA classique ?", o: ["150 000 €", "22 950 €", "50 000 €", "Pas de plafond"], a: 0, x: "22 950 €, c'est le plafond du Livret A. Le PEA permet de verser beaucoup plus." },
            { t: "vf", q: "Après 5 ans, les gains d'un PEA sont exonérés d'impôt sur le revenu, mais restent soumis aux prélèvements sociaux.", a: true, x: "Vrai. C'est ce qui rend le PEA intéressant pour un investissement en actions sur le long terme." },
            { t: "qcm", q: "Pourquoi l'épargne de précaution ne va-t-elle pas sur un PEA investi en actions ?", o: ["Elle doit être disponible sans risque de devoir vendre en pleine baisse", "C'est interdit", "Le PEA ne rapporte rien", "Il faut 150 000 € pour ouvrir un PEA"], a: 0, x: "Un imprévu arrive souvent au mauvais moment. Les actions, c'est pour l'argent dont tu n'auras pas besoin avant des années." },
            { t: "qcm", q: "Après combien d'années l'assurance-vie offre-t-elle son avantage fiscal principal ?", o: ["8 ans", "1 an", "5 ans", "20 ans"], a: 0, x: "Au bout de 8 ans, l'abattement annuel sur les gains retirés s'applique. Tu peux ouvrir un contrat tôt pour faire courir ce délai." }
          ]
        },
        {
          title: "Sommet : le gros contrat",
          defi: true,
          cards: [{ h: "Tout mettre ensemble", b: "TVA, charges, réserve, rémunération, investissement. Et la marge d'erreur de Housel.", src: "Housel ; Bogle ; Sethi" }],
          ex: [
            { t: "ecrit", ctx: "Les Traileurs vient d'encaisser un contrat annuel de 24 000 € HT (28 800 € TTC), payé en une fois.", q: "Explique en 6 lignes maximum comment tu répartis cet argent, avec des montants.", crit: ["Isole les 4 800 € de TVA", "Prévoit impôts et charges", "Alimente une réserve de trésorerie pour les mois creux", "Ne transforme pas tout en rémunération immédiate : lisse sur l'année", "Montants cohérents qui tombent juste"], ex: "Sur 28 800 € encaissés :\n- 4 800 € de TVA sur le compte dédié.\n- 6 000 € (25 % du HT) sur le compte impôts et charges.\n- 6 000 € en réserve jusqu'à atteindre 6 mois de charges.\n- 8 000 € pour lisser ma rémunération sur les 12 mois du contrat.\n- 4 000 € pour le développement : le stage et les contenus qui font venir des abonnés." }
          ]
        }
      ]
    }
  ],
  books: [
    { t: "The Psychology of Money (La psychologie de l'argent)", a: "Morgan Housel", y: 2020, proof: "Best-seller mondial, recommandé par de nombreux investisseurs pour son approche comportementale.", idea: "Ton comportement face à l'argent compte plus que ton intelligence." },
    { t: "The Little Book of Common Sense Investing", a: "John Bogle", y: 2007, proof: "Par le fondateur de Vanguard, inventeur du fonds indiciel pour particuliers ; les chiffres SPIVA lui donnent raison année après année.", idea: "Achète tout le marché, à bas coût, et garde-le longtemps." },
    { t: "A Random Walk Down Wall Street", a: "Burton Malkiel", y: 1973, proof: "Réédité depuis 50 ans, un des textes fondateurs de l'investissement passif.", idea: "Les cours sont difficiles à prévoir : la diversification bat les paris." },
    { t: "The Intelligent Investor (L'investisseur intelligent)", a: "Benjamin Graham", y: 1949, proof: "Warren Buffett le présente comme le meilleur livre sur l'investissement jamais écrit.", idea: "Monsieur Marché et la marge de sécurité : ne laisse pas ses humeurs décider pour toi." },
    { t: "I Will Teach You to Be Rich", a: "Ramit Sethi", y: 2009, proof: "Best-seller du New York Times, une méthode pratique centrée sur l'automatisation.", idea: "Automatise ton épargne et dépense sans culpabilité ce qui est prévu pour ça." },
    { t: "The Richest Man in Babylon (L'homme le plus riche de Babylone)", a: "George Clason", y: 1926, proof: "Un siècle de rééditions pour une règle simple.", idea: "Garde pour toi au moins un dixième de tout ce que tu gagnes." }
  ]
});
