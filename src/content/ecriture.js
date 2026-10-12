window.SUMMITS = window.SUMMITS || [];
window.SUMMITS.push({
  id: "ecrire",
  name: "Écrire",
  short: "Écriture",
  color: "var(--c-ecrire)",
  tagline: "Expliquer une idée en deux phrases, et être lu jusqu'au bout.",
  units: [
    {
      title: "Moins, c'est plus",
      sub: "Writing for Busy Readers, On Writing Well, Orwell",
      lessons: [
        {
          title: "Écrire pour des lecteurs pressés",
          cards: [
            { h: "La science de l'écrit efficace", b: "Todd Rogers (Harvard) et Jessica Lasky-Fink ont testé en conditions réelles ce qui fait qu'un message est lu et suivi d'effet. Ils en tirent **6 principes**.", src: "Writing for Busy Readers, Rogers & Lasky-Fink (2023)" },
            { h: "Les 6 principes", b: "1. **Moins, c'est plus** : moins de mots, moins d'idées, moins de demandes.\n2. **Rendre la lecture facile** : mots courts et courants, phrases simples.\n3. **Faciliter la navigation** : l'essentiel visible d'emblée, une idée par bloc.\n4. **Assez de mise en forme, pas plus.**\n5. **Dire pourquoi c'est important** pour ce lecteur-là.\n6. **Rendre la réponse facile.**", src: "Writing for Busy Readers" },
            { h: "L'ordre compte", b: "Dans une liste, le premier élément reçoit généralement le plus d'attention. Mets ta demande principale en premier, pas en dernier.", src: "Writing for Busy Readers" }
          ],
          ex: [
            { t: "qcm", q: "Ton e-mail contient 4 demandes différentes. Que recommandent Rogers et Lasky-Fink ?", o: ["En faire moins, ou les séparer, pour que chacune ait une chance d'être traitée", "Les mettre en gras toutes les quatre", "Les placer à la fin", "Ajouter « urgent » dans l'objet"], a: 0, x: "Chaque demande en plus réduit les chances que les autres soient faites. Un message, une demande principale." },
            { t: "vf", q: "Dans une liste, le premier élément reçoit généralement le plus d'attention.", a: true, x: "Vrai. C'est pour ça que la chose la plus importante va en tête, dans une liste comme dans un e-mail." },
            { t: "qcm", c: 1, q: "Tu veux que les membres du club confirment leur présence. Quelle fin de message rend la réponse la plus facile ?", o: ["« Réponds juste 1 si tu viens, 2 si tu ne viens pas. »", "« N'hésite pas à me faire savoir si jamais tu es disponible. »", "« Merci de remplir le formulaire en pièce jointe et de me le renvoyer signé. »", "« À très vite ! »"], a: 0, x: "Une réponse d'un caractère, sans effort ni ambiguïté. Principe 6 : réduire au minimum l'effort pour agir." },
            { t: "paires", q: "Associe chaque correction au principe qu'elle applique.", p: [["Couper un paragraphe de contexte inutile", "Moins, c'est plus"], ["Remplacer « appréhender » par « comprendre »", "Rendre la lecture facile"], ["Mettre la date et le lieu en première ligne", "Faciliter la navigation"], ["Ajouter « Ça te concerne si tu cours à Lyon »", "Dire pourquoi c'est important"]], x: "Chaque principe attaque une raison différente pour laquelle un lecteur pressé décroche." },
            { t: "qcm", q: "Pourquoi trop de gras dans un texte nuit-il ?", o: ["Si tout est mis en avant, plus rien ne ressort", "C'est moins joli", "Les téléphones ne l'affichent pas", "Ça rallonge le texte"], a: 0, x: "Principe 4 : la mise en forme est un outil. Réserve le gras à une ou deux informations vraiment clés." },
            { t: "trou", q: "Préfère les mots ___ et courants.", o: ["courts", "techniques", "rares", "longs"], a: 0, x: "Un lecteur pressé lit plus vite et comprend mieux les mots qu'il connaît déjà." }
          ]
        },
        {
          title: "Chasser le superflu",
          cards: [
            { h: "Le fouillis", b: "William Zinsser appelle **clutter** (le fouillis) tous les mots qui ne servent à rien. Le secret d'une bonne écriture, dit-il, est de ramener chaque phrase à ses éléments les plus propres.", src: "On Writing Well, William Zinsser (1976)" },
            { h: "Les règles d'Orwell", b: "Mot court plutôt que long. Si un mot peut sauter, coupe-le. **Voix active** plutôt que passive. Pas de jargon s'il existe un mot courant. Pas de métaphore usée.", src: "Politics and the English Language, George Orwell (1946)" },
            { h: "« Omit needless words »", b: "La règle la plus célèbre de Strunk & White, un des manuels de style les plus lus aux États-Unis : supprime les mots inutiles.", src: "The Elements of Style, Strunk & White (1959)" }
          ],
          ex: [
            { t: "qcm", q: "Quelle version est la plus claire ?", o: ["« On part à 8 h du parking. »", "« Il est à noter que le départ sera donné aux alentours de 8 h depuis le parking. »", "« Le départ, qui aura lieu depuis le parking, est prévu à 8 h. »", "« Au niveau de l'horaire, c'est 8 h au parking. »"], a: 0, x: "Sept mots, voix active, aucun mot qui ne sert à rien." },
            { t: "paires", q: "Associe chaque expression à sa version courte.", p: [["Au jour d'aujourd'hui", "Aujourd'hui"], ["Dans le but de", "Pour"], ["À l'heure actuelle", "Maintenant"], ["Procéder à la vérification de", "Vérifier"]], x: "Chaque remplacement économise des mots sans rien perdre. Sur un texte entier, ça change tout." },
            { t: "qcm", q: "Laquelle de ces phrases est à la voix active ?", o: ["« Kilian a remporté la course. »", "« La course a été remportée par Kilian. »", "« La victoire a été obtenue. »", "« Il a été décidé que la course serait remportée. »"], a: 0, x: "Sujet, verbe, complément : on sait tout de suite qui fait quoi. La voix passive cache souvent l'acteur." },
            { t: "vf", q: "Selon Orwell, si un mot peut être supprimé, il faut le supprimer.", a: true, x: "Vrai. C'est sa deuxième règle. Relis chaque phrase en te demandant : qu'est-ce qui se passe si j'enlève ce mot ?" },
            { t: "qcm", c: 1, q: "Quelle légende Instagram applique le mieux ces règles ?", o: ["« 3 200 m de D+ en une journée : Lucie a bouclé la traversée en 11 h. »", "« Une aventure incroyable et vraiment hors du commun qui restera gravée dans les mémoires. »", "« Il convient de souligner que cette performance mérite d'être saluée. »", "« Au niveau de la perf, c'est quelque chose de très fort. »"], a: 0, x: "Des faits précis, des mots courts, un sujet qui agit. Les autres phrases parlent pour ne rien dire." },
            { t: "trou", q: "« Il est important de noter que le club recrute » devient : « Le club ___ ».", o: ["recrute", "est en phase de recrutement", "procède à des recrutements", "a pour projet de recruter"], a: 0, x: "« Il est important de noter que » n'apporte rien. Si c'est important, le lecteur le verra." }
          ]
        },
        {
          title: "Défi : couper de moitié",
          defi: true,
          cards: [{ h: "Coupe sans pitié", b: "Vise moins de la moitié des mots. Garde la demande, la date, la raison. Tout le reste doit justifier sa place.", src: "Zinsser ; Rogers & Lasky-Fink" }],
          ex: [
            { t: "ecrit", ctx: "Texte d'origine (≈ 90 mots) : « Bonjour à toutes et à tous, j'espère que vous allez bien. Je me permets de revenir vers vous dans le cadre de l'organisation de notre prochaine sortie du club qui, comme vous le savez sans doute, aura lieu le samedi 14 au matin. Il serait vraiment important, dans la mesure du possible, que chacun puisse nous faire savoir s'il compte être présent ou non afin que nous puissions anticiper au mieux la logistique, notamment en ce qui concerne le ravitaillement. N'hésitez pas à revenir vers moi pour toute question. »", q: "Réécris ce message en 40 mots maximum.", crit: ["40 mots maximum", "Garde la date et l'objet (la sortie)", "Une seule demande claire, facile à faire", "Explique en quelques mots pourquoi on demande (le ravito)", "Aucune formule creuse"], ex: "Sortie du club samedi 14 au matin. Réponds « 1 » si tu viens, « 2 » sinon, avant jeudi : on prépare le ravito au nombre près. Merci !" }
          ]
        }
      ]
    },
    {
      title: "La réponse d'abord",
      sub: "The Pyramid Principle, Smart Brevity",
      lessons: [
        {
          title: "Le principe de la pyramide",
          cards: [
            { h: "Commence par la conclusion", b: "Barbara Minto, première femme consultante chez McKinsey, a formé des générations de consultants à une règle : **donne la réponse d'abord**, puis les arguments qui la soutiennent, regroupés et ordonnés.", src: "The Pyramid Principle, Barbara Minto (1987)" },
            { h: "S-C-Q", b: "Pour introduire : **Situation** (ce que le lecteur sait déjà), **Complication** (ce qui a changé), **Question** (que faire ?). Ta réponse vient juste après.", src: "The Pyramid Principle" },
            { h: "Groupe par 3", b: "Sous la réponse, regroupe tes arguments en un petit nombre de blocs logiques, idéalement trois. Chaque bloc résume ce qu'il y a dessous.", src: "The Pyramid Principle" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Tu écris à l'équipe pour proposer d'arrêter les lives Instagram. Quelle première phrase respecte la pyramide ?", o: ["« Je propose qu'on arrête les lives et qu'on mette ce temps sur les carrousels. »", "« Comme vous le savez, on fait des lives depuis deux ans… »", "« J'ai analysé nos 358 posts de l'année. »", "« Petite question : vous aimez les lives ? »"], a: 0, x: "La recommandation d'abord. Les chiffres viennent ensuite pour la soutenir. Le lecteur sait dès la première ligne ce qu'on attend de lui." },
            { t: "ordre", q: "Imagine que les sorties du club de Lyon soient prises d'assaut. Remets l'introduction S-C-Q dans l'ordre, puis la réponse.", items: ["Le club de Lyon organise une sortie par mois.", "Les inscriptions sont complètes en deux heures et la liste d'attente déborde.", "Comment accueillir plus de coureurs sans perdre l'ambiance ?", "Je propose une deuxième sortie mensuelle, encadrée par deux nouveaux ambassadeurs."], x: "Situation, Complication, Question, puis Réponse. Le lecteur suit le raisonnement sans effort." },
            { t: "vf", q: "Dans la pyramide de Minto, on garde la conclusion pour la fin, pour créer du suspense.", a: false, x: "Faux. C'est l'inverse : la conclusion d'abord. Le suspense, c'est pour les histoires, pas pour les e-mails de travail." },
            { t: "qcm", q: "Pourquoi regrouper ses arguments en trois blocs plutôt que d'en lister neuf ?", o: ["Le lecteur retient mieux un petit nombre de groupes logiques", "Trois est un chiffre porte-bonheur", "Neuf arguments, c'est malhonnête", "C'est plus court à taper"], a: 0, x: "La mémoire de travail est limitée. Trois blocs bien nommés se retiennent, neuf points en vrac se perdent." },
            { t: "qcm", c: 1, q: "Quel objet d'e-mail suit la logique « réponse d'abord » ?", o: ["« Validé : on lance une sortie de nuit en janvier »", "« Point sur Grenoble »", "« Quelques réflexions »", "« Réunion de jeudi »"], a: 0, x: "L'objet contient déjà la décision. Même sans ouvrir l'e-mail, le lecteur a l'essentiel." },
            { t: "trou", q: "Situation, Complication, ___.", o: ["Question", "Conclusion", "Contexte", "Chiffres"], a: 0, x: "La question est celle que le lecteur se pose naturellement. Ta réponse y répond juste après." }
          ]
        },
        {
          title: "Smart Brevity",
          cards: [
            { h: "Le format Axios", b: "Les fondateurs d'Axios ont construit un média entier sur un format court et structuré, qu'ils proposent aujourd'hui aux entreprises pour leur communication interne.", src: "Smart Brevity, VandeHei, Allen & Schwartz (2022)" },
            { h: "4 éléments", b: "**Accroche** : un titre court et fort.\n**Phrase clé** : la chose que le lecteur doit retenir, en une phrase.\n**Pourquoi c'est important** : le contexte, en une ou deux lignes.\n**Pour aller plus loin** : les détails, pour qui veut.", src: "Smart Brevity" }
          ],
          ex: [
            { t: "paires", q: "Associe chaque morceau à sa fonction Smart Brevity.", p: [["« Le club de Marseille court pour la première fois »", "Accroche"], ["« Premier social run le mercredi 28 octobre. »", "Phrase clé"], ["« C'est le premier rendez-vous du club : l'occasion de rencontrer les ambassadrices. »", "Pourquoi c'est important"], ["« Parcours et horaires : lien en bio. »", "Pour aller plus loin"]], x: "Chaque élément a un rôle unique. Le lecteur peut s'arrêter à n'importe quel niveau et repartir avec l'essentiel." },
            { t: "qcm", q: "Quelle est la meilleure « phrase clé » pour annoncer un nouveau partenariat ?", o: ["« Les Traileurs et une marque de montres GPS lancent un défi de 30 jours, ouvert à tous les abonnés. »", "« Nous sommes très heureux et fiers de vous annoncer une grande nouvelle. »", "« Après de longs mois de discussions passionnantes… »", "« Vous l'attendiez, le voici ! »"], a: 0, x: "Elle dit qui, quoi et pour qui en une phrase. Les autres retardent l'information." },
            { t: "vf", q: "Dans Smart Brevity, la partie « Pour aller plus loin » est facultative pour le lecteur.", a: true, x: "Vrai. C'est le principe : l'essentiel tient au-dessus, les détails sont là pour ceux qui les veulent." },
            { t: "qcm", c: 1, q: "Quelle accroche de newsletter est la plus Smart Brevity ?", o: ["« Les Monts du Lyonnais en bus et à pied »", "« Newsletter n°12 – octobre »", "« Des nouvelles de l'équipe et plein d'autres choses »", "« Vous n'allez pas en croire vos yeux !!! »"], a: 0, x: "Courte, concrète, elle annonce le sujet. Le numéro de newsletter ne donne aucune raison d'ouvrir." },
            { t: "qcm", q: "Quel est le risque principal d'un texte sans « pourquoi c'est important » ?", o: ["Le lecteur ne voit pas en quoi ça le concerne et passe à autre chose", "Il est trop court", "Il manque de sources", "Il est mal mis en page"], a: 0, x: "Rogers et Lasky-Fink disent la même chose : dis au lecteur pourquoi il devrait s'en soucier, sinon il ne lira pas." }
          ]
        },
        {
          title: "Défi : l'idée en deux phrases",
          defi: true,
          cards: [{ h: "Le test des deux phrases", b: "Si tu peux expliquer une idée en deux phrases, tu l'as comprise. Première phrase : ce que c'est. Deuxième : pourquoi ça compte pour celui qui lit.", src: "Minto ; Smart Brevity" }],
          ex: [
            { t: "ecrit", ctx: "Un responsable marketing qui ne connaît pas le trail te demande ce qu'est Champions by Les Traileurs.", q: "Explique le projet en deux phrases maximum.", crit: ["Deux phrases maximum", "La première dit clairement ce que c'est", "La seconde dit pourquoi ça intéresse une marque", "Mots simples, aucun jargon de coureur", "Pas de superlatifs creux"], ex: "Champions, c'est un jeu gratuit où les fans de trail pronostiquent les résultats des grandes courses et se classent entre eux. Pour une marque, c'est un moyen d'être présente pendant toute la course auprès de milliers de passionnés qui la suivent en direct." }
          ]
        }
      ]
    },
    {
      title: "Une idée qui colle",
      sub: "Made to Stick, la théorie de la curiosité",
      lessons: [
        {
          title: "Les 6 ingrédients SUCCESs",
          cards: [
            { h: "Pourquoi certaines idées survivent", b: "Chip et Dan Heath ont étudié les idées qui se transmettent : légendes urbaines, slogans, proverbes. Elles partagent 6 traits : **Simple, Inattendue, Concrète, Crédible, Émotionnelle, une Histoire**.", src: "Made to Stick, Chip & Dan Heath (2007)" },
            { h: "La malédiction du savoir", b: "Dans une expérience de Stanford (Elizabeth Newton, 1990), des personnes tapaient le rythme d'une chanson connue. Elles pensaient qu'on la reconnaîtrait une fois sur deux. Les auditeurs n'en ont trouvé que **3 sur 120**. Quand tu sais quelque chose, tu ne peux plus imaginer ne pas le savoir.", src: "Made to Stick" }
          ],
          ex: [
            { t: "qcm", q: "Que montre l'expérience des « tapeurs » de Newton ?", o: ["Celui qui sait surestime énormément ce que l'autre comprend", "La musique est universelle", "Les auditeurs sont distraits", "Le rythme suffit à reconnaître une chanson"], a: 0, x: "Les tapeurs entendaient la mélodie dans leur tête, pas les auditeurs. C'est exactement ce qui t'arrive quand tu écris sur un sujet que tu maîtrises." },
            { t: "paires", q: "Associe chaque version à l'ingrédient SUCCESs qu'elle illustre.", p: [["« La sortie du club, c'est 12 km et un croissant à l'arrivée. »", "Concrète"], ["« Le plus dur de l'UTMB n'est pas la montée. »", "Inattendue"], ["« Testé sur 300 km par notre équipe. »", "Crédible"], ["« À 3 h du matin, au fond de la vallée, il a voulu abandonner. »", "Histoire"]], x: "Plus une idée coche d'ingrédients, plus elle a de chances d'être retenue et répétée." },
            { t: "qcm", c: 1, q: "Quelle phrase est la plus concrète pour donner envie de rejoindre le club ?", o: ["« Samedi, 25 coureurs, 600 m de D+ et un café en terrasse à l'arrivée. »", "« Un club bienveillant pour progresser ensemble dans une ambiance conviviale. »", "« Rejoins une communauté de passionnés. »", "« Des valeurs fortes au service du trail. »"], a: 0, x: "On voit la scène. Les phrases abstraites comme « bienveillant » ou « convivial » sont utilisées par tous les clubs et ne se retiennent pas." },
            { t: "vf", q: "Selon les Heath, « Simple » veut dire dire moins de choses, pas parler comme à un enfant.", a: true, x: "Vrai. Simple, c'est trouver le cœur de l'idée et le dire sans détour. On peut être simple et profond." },
            { t: "qcm", q: "Comment combattre la malédiction du savoir quand tu écris ?", o: ["Faire relire par quelqu'un qui ne connaît pas le sujet", "Ajouter plus de détails techniques", "Écrire plus long", "Utiliser plus d'acronymes"], a: 0, x: "Ton lecteur test te montre tout de suite où tu as sauté une étape." }
          ]
        },
        {
          title: "Créer de la curiosité",
          cards: [
            { h: "Le vide d'information", b: "L'économiste George Loewenstein a proposé en 1994 que la curiosité naît quand on perçoit **un écart entre ce qu'on sait et ce qu'on voudrait savoir**. Les Heath s'en servent pour expliquer le « Inattendu » : ouvre une question, puis comble-la.", src: "Loewenstein (1994) ; Made to Stick" },
            { h: "Ouvrir sans tromper", b: "Une bonne accroche crée un manque que le contenu comble vraiment. Si la réponse déçoit, tu perds la confiance du lecteur pour la fois suivante.", src: "Made to Stick" }
          ],
          ex: [
            { t: "qcm", c: 1, q: "Quelle cover de carrousel crée le meilleur vide d'information ?", o: ["« Il a gagné la Diagonale des Fous… / et il n'avait jamais couru 100 km ? »", "« Retour sur la Diagonale des Fous 2026 »", "« Diagonale des Fous : les résultats complets »", "« Notre analyse de la course »"], a: 0, x: "Le haut pose un fait connu, le bas crée une contradiction. Le lecteur doit glisser pour comprendre." },
            { t: "vf", q: "Une accroche qui promet plus que ce que le contenu livre finit par coûter de l'attention.", a: true, x: "Vrai. Le vide d'information doit être comblé. Sinon, le lecteur apprend à ignorer tes accroches." },
            { t: "qcm", q: "D'après Loewenstein, quand la curiosité est-elle la plus forte ?", o: ["Quand on sait déjà un peu, et qu'on voit précisément ce qui manque", "Quand on ne sait rien du tout du sujet", "Quand on sait déjà tout", "Quand le texte est très long"], a: 0, x: "Il faut un peu de savoir pour remarquer le trou. C'est pourquoi un nom connu en ouverture fonctionne si bien." },
            { t: "trou", q: "La curiosité naît d'un ___ entre ce qu'on sait et ce qu'on veut savoir.", o: ["écart", "accord", "rapport", "contrat"], a: 0, x: "C'est la théorie du vide d'information de George Loewenstein." },
            { t: "qcm", q: "Quel ingrédient SUCCESs manque à : « Notre gel est efficace » ?", o: ["Concret et crédible : aucun fait, aucune preuve", "Simple : la phrase est trop longue", "Émotion : le gel n'est pas triste", "Rien, la phrase est parfaite"], a: 0, x: "« Efficace » ne dit rien. « 3 coureurs sur 4 l'ont gardé sur 80 km sans souci d'estomac » serait concret et crédible, à condition d'être vrai." }
          ]
        },
        {
          title: "Sommet : rends-la mémorable",
          defi: true,
          cards: [{ h: "Abstrait → concret", b: "Remplace chaque mot abstrait par une scène, un chiffre ou une personne. Ouvre un vide, comble-le.", src: "Made to Stick" }],
          ex: [
            { t: "ecrit", ctx: "Texte abstrait : « Les Traileurs, c'est une communauté bienveillante et dynamique qui rassemble des passionnés autour de valeurs fortes de partage et de dépassement de soi. »", q: "Réécris ce texte en 3 phrases maximum pour qu'il soit concret, inattendu et mémorable.", crit: ["Au moins un détail concret (scène, chiffre, lieu, personne)", "Un élément inattendu ou une question qui accroche", "Plus aucun mot abstrait creux (bienveillant, valeurs, passion…)", "3 phrases maximum", "Reste vrai et crédible"], ex: "Un samedi par mois, 30 inconnus se retrouvent à 7 h sur un parking des Monts du Lyonnais. Trois heures plus tard, ils partagent un café en se racontant leur prochain ultra. C'est ça, Les Traileurs." }
          ]
        }
      ]
    }
  ],
  books: [
    { t: "Writing for Busy Readers", a: "Todd Rogers et Jessica Lasky-Fink", y: 2023, proof: "Six principes tirés d'expériences de terrain menées par des chercheurs en sciences comportementales de Harvard.", idea: "Moins de mots, moins d'idées, moins de demandes, et une réponse facile à donner." },
    { t: "On Writing Well", a: "William Zinsser", y: 1976, proof: "Le manuel d'écriture non fictionnelle de référence depuis près de 50 ans.", idea: "Supprime le fouillis : chaque mot doit avoir une fonction." },
    { t: "The Pyramid Principle", a: "Barbara Minto", y: 1987, proof: "La méthode enseignée aux consultants de McKinsey pour structurer notes et présentations.", idea: "La réponse d'abord, puis les arguments regroupés et ordonnés." },
    { t: "Made to Stick (Ces idées qui collent)", a: "Chip et Dan Heath", y: 2007, proof: "Synthèse de recherches en psychologie sur ce qui rend une idée mémorable, best-seller mondial.", idea: "Simple, inattendue, concrète, crédible, émotionnelle, racontée." },
    { t: "Smart Brevity", a: "Jim VandeHei, Mike Allen, Roy Schwartz", y: 2022, proof: "Le format sur lequel Axios a bâti son média, adopté par de nombreuses entreprises pour leur communication interne.", idea: "Accroche, phrase clé, pourquoi c'est important, pour aller plus loin." },
    { t: "Politics and the English Language", a: "George Orwell", y: 1946, proof: "Essai court, cité dans la plupart des guides de style depuis 80 ans.", idea: "Mot court, voix active, et coupe tout ce qui peut l'être." }
  ]
});
