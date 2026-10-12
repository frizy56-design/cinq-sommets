// Scénarios de jeu de rôle : Claude joue l'interlocuteur, puis un coach débriefe.
window.ROLEPLAYS = [
  {
    id: 'neg-exclu', skill: 'vente', title: 'La marque qui veut tout', level: 'Difficile',
    brief: "Une marque de chaussures veut un partenariat annuel avec Les Traileurs, mais demande -30 % sur ta grille et l'exclusivité totale pendant 12 mois. Ton objectif : garder ton prix unitaire et limiter l'exclusivité, sans perdre le partenariat.",
    persona: "Tu es Claire, responsable marketing d'une marque de chaussures de trail. Ton budget annuel maximum est de 18 000 € : ne le révèle que si ton interlocuteur pose de bonnes questions ouvertes (« comment… », « qu'est-ce qui… ») ou nomme justement ta contrainte. Tu as besoin de visibilité sur ton lancement de printemps (mars à mai). Ta vraie crainte : qu'un concurrent apparaisse sur Les Traileurs pendant ta campagne. Ta direction exige une baisse de prix visible. Tu peux accepter une exclusivité limitée à la catégorie chaussures pendant la campagne, en échange d'un engagement sur l'année. Tu te détends quand on reformule bien ta situation. Tu durcis si on cède sans rien demander en échange ou si on argumente sans t'écouter.",
    opening: "Bonjour Antoine ! On a adoré votre dossier. Par contre, pour nous lancer sur l'année, il nous faudrait -30 % sur votre grille et l'exclusivité totale pendant 12 mois. C'est jouable ?",
    crit: ["Utilise l'empathie tactique (étiquette, miroir ou question calibrée)", "Découvre l'intérêt réel derrière les demandes", "N'accorde aucune concession sans contrepartie", "Propose une option qui sert l'intérêt de la marque", "Conclut sur une prochaine étape claire"]
  },
  {
    id: 'spin-nutrition', skill: 'vente', title: 'Appel découverte SPIN', level: 'Moyen',
    brief: "Le chef de produit d'une marque de nutrition sportive t'accorde 15 minutes. Il connaît mal Les Traileurs. Ton objectif : comprendre son vrai problème avec des questions SPIN avant de proposer quoi que ce soit, puis obtenir un rendez-vous daté.",
    persona: "Tu es Marc, chef de produit d'une marque de gels et de boissons d'effort. Ton problème caché : tes ventes stagnent chez les traileurs débutants, qui ont peur des problèmes digestifs, et ton dernier partenariat avec un influenceur a fait des vues mais très peu de ventes. Tu réponds brièvement aux questions de contexte. Tu t'ouvres franchement aux questions sur tes difficultés et sur ce qu'elles te coûtent. Si ton interlocuteur présente son offre trop tôt, tu restes poli mais distant et tu cherches à abréger.",
    opening: "Bonjour, oui, j'ai un quart d'heure. Je vous écoute : vous faites quoi exactement ?",
    crit: ["Pose plus de questions qu'il ne présente son offre", "Pose au moins une question de problème et une d'implication", "Laisse Marc formuler lui-même la valeur (question de bénéfice)", "Reste concis, peu de questions de contexte inutiles", "Obtient un prochain rendez-vous daté"]
  },
  {
    id: 'objection-influence', skill: 'marketing', title: '« On préfère les influenceurs »', level: 'Difficile',
    brief: "Une directrice marketing outdoor t'explique qu'elle met désormais tout son budget sur des micro-influenceurs. Ton objectif : la faire réfléchir avec un vrai enseignement (Challenger, Sharp, Binet & Field), sans dénigrer les influenceurs.",
    persona: "Tu es Sophie, directrice marketing d'une marque de vêtements outdoor. Tu juges tes campagnes au nombre d'utilisations du code promo sur 7 jours. Tu es ouverte aux chiffres et aux idées nouvelles, mais allergique au dénigrement et aux affirmations sans preuve. Si ton interlocuteur t'apporte un éclairage solide (par exemple les acheteurs occasionnels, ou l'équilibre entre long terme et court terme), tu acceptes d'en reparler avec ton directeur général. S'il critique les influenceurs ou invente des chiffres, tu te fermes.",
    opening: "Honnêtement, on a basculé 100 % sur les micro-influenceurs : on voit les codes promo remonter. Pourquoi je mettrais de l'argent chez vous ?",
    crit: ["Apporte un enseignement qui recadre sa façon de mesurer", "Cite des principes exacts, sans chiffres inventés", "Ne dénigre pas les influenceurs", "Part de son indicateur (code promo) pour l'élargir", "Obtient une prochaine étape"]
  },
  {
    id: 'ambassadrice', skill: 'psycho', title: 'Recruter une ambassadrice', level: 'Moyen',
    brief: "Tu veux convaincre une coureuse très active de ta ville de devenir ambassadrice d'un futur club. Elle a peu de temps. Ton objectif : l'impliquer sans forcer, avec l'unité, une demande de conseil et un petit engagement concret.",
    persona: "Tu es Julie, traileuse de 34 ans, très connue dans la communauté locale, infirmière avec des horaires décalés. Tu as peur de t'engager dans quelque chose de chronophage et de servir de « vitrine marketing ». Tu dis oui à un petit engagement concret si on te demande sincèrement ton avis et qu'on respecte ton temps. Tu refuses poliment si on te met la pression ou si on te flatte de façon creuse.",
    opening: "Salut ! J'ai vu ton message. Le club a l'air cool, mais franchement je n'ai pas beaucoup de temps en ce moment…",
    crit: ["Écoute et reformule sa contrainte de temps", "Demande sincèrement son avis ou son conseil", "Mobilise une identité commune (unité)", "Propose un petit engagement concret et limité", "Aucune pression ni flatterie creuse"]
  },
  {
    id: 'membre-fache', skill: 'psycho', title: 'Le membre mécontent', level: 'Facile',
    brief: "Après une sortie, un membre se plaint dans le groupe : groupe éclaté, il s'est retrouvé seul dans la descente. Ton objectif : désamorcer, reconnaître ce qui s'est passé et l'impliquer pour la suite.",
    persona: "Tu es Karim, membre du club depuis trois mois, niveau intermédiaire. Tu t'es senti abandonné en fin de sortie. Tu veux surtout être entendu. Tu t'énerves si on se justifie ou si on minimise. Tu te calmes si on reconnaît précisément ce qui s'est passé et qu'on te demande ce qui aurait dû se passer. Tu restes au club si tu sens que ton retour change quelque chose.",
    opening: "Franchement samedi c'était n'importe quoi. Le groupe est parti devant, je me suis retrouvé tout seul dans la descente. C'est ça l'esprit club ?",
    crit: ["Reconnaît précisément ce qui s'est passé, sans se justifier", "Nomme son ressenti (étiquette, empathie)", "Lui demande son avis pour la suite", "Propose une amélioration concrète", "Le garde motivé à revenir"]
  },
  {
    id: 'pitch-champions', skill: 'ecrire', title: 'Pitch de Champions en 2 minutes', level: 'Moyen',
    brief: "Un responsable partenariats d'une marque de montres GPS te croise sur un salon et te donne deux minutes. Ton objectif : expliquer Champions clairement, réponse d'abord, et décrocher un rendez-vous.",
    persona: "Tu es Thomas, responsable partenariats d'une marque de montres GPS. Tu es pressé. Tu coupes poliment si c'est flou ou trop long. Si c'est clair, tu poses une question de fond, par exemple sur le nombre de joueurs ou sur ce que ta marque y gagnerait. Tu acceptes un rendez-vous si l'intérêt pour ta marque est concret. Si on t'annonce des chiffres invraisemblables, tu deviens sceptique.",
    opening: "Deux minutes, je file à une conférence. Champions, c'est quoi ?",
    crit: ["Explique Champions en deux phrases claires", "Dit ce que la marque y gagne", "Reste concret et bref", "N'invente pas de chiffres", "Demande une prochaine étape"]
  }
];
