// Correctifs v2 : distracteurs plus plausibles et de longueur comparable,
// pour que la bonne réponse ne soit plus reconnaissable à sa longueur.
(function () {
  const P = {
    'vente/0/1/0': ["« Est-ce que tu jouerais à un jeu de pronostics pendant les grandes courses comme l'UTMB ? »", "« Franchement, tu trouves que c'est une bonne idée, un jeu de pronostics sur le trail ? »", "« Combien tu serais prêt à payer chaque année pour un jeu de pronostics comme ça ? »"],
    'vente/2/0/3': ["« Oui, vous avez raison. »", "« Oui, oui, d'accord. »", "« Pourquoi pas, oui. »"],
    'ecrire/2/0/2': ["« Un club bienveillant pour progresser ensemble dans une ambiance conviviale. »", "« Rejoins une communauté de passionnés qui partagent les mêmes valeurs que toi. »", "« Des valeurs fortes au service du trail et du partage, pour tous les niveaux. »"],
    'ecrire/2/1/4': ["Simple : la phrase est trop longue et trop compliquée", "Émotion : le gel ne raconte aucune histoire triste", "Rien du tout : la phrase est courte, donc parfaite"],
    'psycho/0/0/3': ["Qu'il soit cher, pour que l'autre mesure l'effort fait", "Qu'il soit offert à tout le monde en même temps", "Qu'il arrive avec une demande précise et immédiate"],
    'psycho/0/0/4': ["Écrire « recommandé par des experts » sans préciser lesquels", "Ajouter le logo d'une grande marque qui n'est pas partenaire", "Présenter les ambassadeurs comme des coachs diplômés d'État"],
    'psycho/1/1/5': ["Un prix affiché en rouge se vend mieux qu'un prix en noir", "Une photo carrée attire plus l'œil qu'une photo verticale", "Les gens retiennent mieux les chiffres ronds que les autres"],
    'argent/2/0/3': ["Tout miser sur les marques tant que ça marche, et voir venir", "Baisser tes tarifs pour sécuriser les contrats en cours", "Embaucher plusieurs salariés tout de suite pour grossir vite"],
    'argent/2/0/4': ["Garder les mêmes prix pour ne froisser aucun partenaire", "Baisser les prix pour signer davantage de contrats", "Facturer au nombre d'heures réellement passées"],
    'vente/0/0/4': ["« Avec plaisir, je te l'envoie dans l'heure avec toute notre grille tarifaire et nos meilleurs cas clients. »", "« Top ! Pour te faire gagner du temps, je te propose -20 % si on signe le partenariat avant vendredi. »", "« Avec plaisir. Notre audience est la plus engagée du trail français, tu vas voir, les chiffres parlent d'eux-mêmes. »"],
    'vente/0/1/3': ["Les gens n'aiment pas parler du futur et répondent toujours de façon évasive", "Elles orientent trop la discussion vers ton produit au lieu de leur métier", "Elles prennent trop de temps et fatiguent la personne en fin d'entretien"],
    'vente/0/1/4': ["« Super échange, je t'envoie une proposition complète et tu me dis ce que tu en penses ? »", "« Merci beaucoup, n'hésite surtout pas à revenir vers moi dès que tu as un budget ! »", "« Génial, je te laisse en parler en interne et on reste en contact dans les semaines à venir. »"],
    'vente/1/0/3': ["« Nous avons 100 000 abonnés très engagés, un taux d'interaction au-dessus de la moyenne et des clubs dans plusieurs villes : votre marque y serait parfaitement à sa place. »", "« Nous suivons votre marque depuis ses débuts et nous adorons vos produits : ce serait un vrai plaisir de raconter votre prochaine collection à toute notre communauté. »", "« Voici nos quatre formules de partenariat, de 1 500 à 6 000 €, avec carrousels, stories et sorties club : dites-moi celle qui correspond le mieux à votre budget. »"],
    'vente/1/0/5': ["Imposer sa solution au client, même quand elle ne correspond pas à son besoin", "Garder la main sur l'agenda et ne jamais laisser le client proposer de date", "Refuser toute négociation pour montrer que ses prix sont déjà les plus justes"],
    'vente/1/1/0': ["« OK pour -30 %, on tient vraiment à travailler avec vous et on se rattrapera sur les prochaines campagnes. »", "« Je comprends, je peux faire un geste à -15 %, mais c'est vraiment mon dernier mot sur ce dossier. »", "« Ce n'est pas possible : nos tarifs sont alignés sur le marché et nous ne faisons jamais aucune remise. »"],
    'vente/1/1/5': ["Elle réduit ta marge sur ce contrat mais n'a aucun effet sur les suivants", "Elle oblige légalement à appliquer la même remise à tous tes autres clients", "Elle rallonge la durée du contrat et retarde le moment où tu seras payé"],
    'vente/2/0/1': ["« Nos tarifs sont justifiés par la qualité et l'engagement de notre audience. »", "« Pourquoi est-ce que vous trouvez notre proposition trop chère, exactement ? »", "« Combien avez-vous prévu, pour que je vous fasse une offre dans ce budget ? »"],
    'vente/2/0/4': ["« Petit souci de planning de notre côté, rien de grave, le contenu arrive la semaine prochaine. »", "« Ce n'est pas de notre faute : le photographe a annulé au dernier moment, on n'y pouvait rien. »", "« Bonne nouvelle : on a une semaine de plus pour peaufiner le contenu et le rendre encore meilleur ! »"],
    'vente/2/1/0': ["Faire baisser ton prix en te privant d'autres sources de revenus pendant un an", "Prendre le contrôle de ta ligne éditoriale sur tous les sujets liés aux chaussures", "Tester ta loyauté avant d'envisager un partenariat plus long et plus important"],
    'vente/2/1/5': ["Il est plus facile à retenir pour l'autre partie qu'un chiffre rond", "Il évite les erreurs de calcul de TVA au moment de la facturation", "Il montre que tu as consulté un expert avant de faire ton offre"],
    'ecrire/0/0/0': ["Les numéroter et les mettre toutes en gras pour qu'aucune ne passe inaperçue", "Les regrouper à la fin du message, dans un récapitulatif bien visible", "Ajouter « urgent » dans l'objet pour que le lecteur traite tout rapidement"],
    'ecrire/0/0/4': ["Le gras rend la lecture plus lente sur un écran de téléphone", "Le gras donne un ton agressif, comme si on criait sur le lecteur", "Le gras s'affiche mal dans la plupart des boîtes e-mail actuelles"],
    'ecrire/1/0/0': ["« Comme vous le savez, on fait des lives depuis maintenant deux ans, et j'ai réfléchi… »", "« J'ai analysé nos 358 posts de l'année et j'ai trouvé plusieurs choses intéressantes. »", "« Petite question pour l'équipe : est-ce que vous aimez vraiment faire les lives ? »"],
    'ecrire/1/0/3': ["Trois arguments suffisent toujours, au-delà on perd en crédibilité", "Un texte en trois blocs est plus court à lire qu'une liste de neuf", "Un nombre impair d'arguments paraît plus naturel et plus élégant"],
    'ecrire/1/0/4': ["« Point sur la sortie de nuit et sur nos prochaines dates »", "« Quelques réflexions sur le programme du club cet hiver »", "« Suite à notre réunion de jeudi : une sortie de nuit en janvier ? »"],
    'ecrire/1/1/1': ["« Nous sommes très heureux et fiers de vous annoncer une grande nouvelle pour toute la communauté. »", "« Après de longs mois de discussions passionnantes, un nouveau partenariat voit enfin le jour. »", "« Vous l'attendiez depuis longtemps, le voici enfin : préparez-vous, ça va bouger cet automne ! »"],
    'ecrire/1/1/4': ["Le texte devient trop court pour être pris au sérieux par le lecteur", "Le texte manque de sources et perd sa crédibilité auprès du lecteur", "Le texte est plus difficile à mettre en page sur un écran de téléphone"],
    'ecrire/2/0/0': ["La musique est un langage universel que tout le monde comprend", "Les auditeurs étaient distraits et ne faisaient pas assez d'effort", "Le rythme seul suffit à reconnaître la plupart des chansons connues"],
    'ecrire/2/0/4': ["Ajouter des détails techniques pour être plus complet", "Écrire plus long pour être sûr de tout bien expliquer", "Faire relire par un expert qui maîtrise parfaitement le sujet"],
    'ecrire/2/1/0': ["« Retour en images sur l'édition 2026 de la Diagonale des Fous »", "« Diagonale des Fous : les résultats complets et le classement final »", "« Notre analyse détaillée de la Diagonale des Fous, kilomètre par kilomètre »"],
    'ecrire/2/1/2': ["Quand on ne sait rien du tout du sujet et qu'on part de zéro", "Quand on sait déjà tout et qu'on cherche seulement une confirmation", "Quand le texte est très long et que la réponse arrive à la toute fin"],
    'psycho/0/0/1': ["Leur envoyer un rappel générique par message la veille au soir de la sortie", "Publier plus de photos des sorties précédentes sur le compte du club", "Augmenter le nombre de places pour compenser les absents habituels"],
    'psycho/0/1/1': ["« Dernières places ! Ne tarde pas, la sortie sera bientôt complète » (elle est à moitié vide)", "« Offre valable seulement 2 h » (et renouvelée automatiquement chaque jour)", "« Sortie réservée à une élite triée sur le volet » (alors qu'elle est ouverte à tous)"],
    'psycho/0/1/4': ["Quand elle dure depuis longtemps et que tout le monde y est habitué", "Quand le produit est gratuit et qu'il n'y a aucun prix à payer", "Quand le vendeur l'annonce plusieurs fois avec beaucoup d'insistance"],
    'psycho/0/1/5': ["Demander un conseil fait gagner du temps, les réponses sont plus courtes", "Demander un conseil permet d'éviter de parler du prix pendant la discussion", "Demander un conseil évite les avis négatifs, qui sont toujours plus nombreux"],
    'psycho/1/0/0': ["Attendre qu'ils annoncent leur budget avant de parler", "Donner une fourchette très large pour rester flexible", "Annoncer un prix bas pour lancer la discussion en douceur"],
    'psycho/1/0/3': ["« Inscris-toi avant vendredi pour être sur la liste prioritaire de la sortie. »", "« Les inscriptions sont ouvertes jusqu'à vendredi pour la prochaine sortie. »", "« Tu peux t'inscrire quand tu veux, il y aura toujours de la place pour toi. »"],
    'psycho/1/0/4': ["Les gens surestiment toujours les grands nombres par rapport aux petits", "Les participants trichaient pour obtenir le chiffre affiché par la roue", "La chance joue un rôle important dans les estimations de culture générale"],
    'psycho/1/1/0': ["Rallonger la sortie d'une heure pour en donner plus aux participants", "Garder la montée la plus dure pour la fin, pour finir sur un exploit", "Supprimer les pauses pour que la sortie paraisse plus courte et efficace"],
    'psycho/1/1/2': ["Faire confiance à ton estimation, puisque c'est toi qui connais le mieux le projet", "Diviser ton estimation par deux pour te mettre la pression et rester motivé", "Demander son estimation à chaque membre de l'équipe et garder la plus courte"],
    'psycho/1/1/4': ["On sous-estime volontairement pour faire accepter le projet", "Les projets sont en réalité souvent plus courts que prévu", "On manque d'outils de calendrier pour bien planifier"],
    'psycho/2/0/1': ["Elle s'applique à toutes les présentations orales, mais pas aux textes écrits", "Elle a été confirmée dans des dizaines de pays et reste valable partout", "Elle concerne surtout les e-mails, où le ton compte plus que les mots"],
    'psycho/2/0/4': ["Acheter : un chiffre aussi précis montre que c'est sérieux", "Demander une réduction avant de t'inscrire à la formation", "Appliquer seulement la partie sur le langage du corps"],
    'psycho/2/1/0': ["Lui expliquer point par point, en public, pourquoi son reproche n'est pas justifié", "Supprimer son commentaire pour ne pas donner une mauvaise image du club", "Ne rien répondre et attendre que la discussion se calme d'elle-même"],
    'psycho/2/1/3': ["Ça fait gagner du temps dans les conversations de groupe et les messages", "C'est une règle de politesse obligatoire dans le monde professionnel", "Ça impressionne les autres membres et renforce ton autorité de fondateur"],
    'psycho/2/1/4': ["« Il faudrait que tu postes plus souvent sur le compte du club, les chiffres baissent un peu. »", "« Tout va bien ? Je pose la question parce que la participation baisse depuis un mois. »", "« Tu devrais t'inspirer de ce que fait le club de Lyon, ça marche très bien chez eux. »"],
    'argent/0/0/0': ["Se verser un salaire avant de payer les fournisseurs et les charges de l'entreprise", "S'offrir ce qui fait plaisir en premier pour rester motivé à gagner plus d'argent", "Rembourser toutes ses dettes en priorité avant de mettre le moindre euro de côté"],
    'argent/0/0/3': ["1 mois de dépenses, le reste doit être investi en actions sans attendre", "2 ans de salaire, pour ne jamais avoir à toucher à ses placements", "L'équivalent d'un loyer, puisque c'est la principale dépense du mois"],
    'argent/0/1/0': ["Uniquement parce qu'il choisit les meilleures actions mieux que tout le monde", "Grâce à un héritage familial important reçu au début de sa carrière", "Parce qu'il a pris des risques énormes que personne d'autre n'osait prendre"],
    'argent/0/1/2': ["Le pourcentage de frais qu'un fonds prélève chaque année sur ton capital", "L'écart acceptable entre deux devis avant de choisir le moins cher des deux", "Une petite erreur de calcul qu'on peut tolérer dans un budget prévisionnel"],
    'argent/0/1/3': ["La richesse ne se voit pas : éviter de montrer les gros contrats sur les réseaux", "Savoir quand on a assez : refuser les nouveaux contrats une fois l'objectif atteint", "Raisonnable plutôt que rationnel : signer avec les marques qu'on aime personnellement"],
    'argent/1/0/4': ["Les banques offrent de meilleurs taux aux jeunes épargnants", "Les petites sommes rapportent proportionnellement plus que les grosses", "Les marchés montent toujours plus vite au début d'un placement"],
    'argent/1/1/3': ["Tout vendre immédiatement pour limiter les pertes avant une nouvelle baisse", "Emprunter pour acheter davantage, puisque les prix sont forcément au plus bas", "Changer de stratégie chaque semaine pour s'adapter aux humeurs du marché"],
    'argent/2/1/3': ["C'est interdit par la loi de placer une épargne de précaution sur un PEA", "Le PEA ne rapporte rien tant qu'on n'a pas atteint cinq ans de détention", "Il faut verser au moins 150 000 € pour pouvoir ouvrir un PEA classique"]
  };
  const byId = {};
  (window.SUMMITS || []).forEach(s => { byId[s.id] = s; });
  Object.keys(P).forEach(k => {
    const [sid, ui, li, ei] = k.split('/');
    const s = byId[sid]; if (!s) return;
    const e = s.units[+ui] && s.units[+ui].lessons[+li] && s.units[+ui].lessons[+li].ex[+ei];
    if (!e || e.t !== 'qcm') return;
    const correct = e.o[e.a];
    const d = P[k].slice();
    const o = [];
    const n = d.length + 1;
    for (let i = 0; i < n; i++) o.push(i === e.a ? correct : d.shift());
    e.o = o;
  });
})();
