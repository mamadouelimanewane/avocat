import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function restoreFullLibrary() {
    console.log('🔄 RESTAURATION COMPLÈTE DE LA BIBLIOTHÈQUE JURIDIQUE...\n');

    // Nettoyer d'abord la base jurisprudence pour éviter les doublons
    await prisma.jurisprudence.deleteMany({});
    console.log('✓ Nettoyage effectué\n');

    const textes = [
        // === CODES OHADA ===
        {
            title: "Acte Uniforme portant Droit Commercial Général (AUDCG)",
            type: "LOI",
            court: "OHADA",
            region: "OHADA",
            date: new Date("2010-12-15"),
            reference: "AUDCG-2010",
            summary: "Texte fondamental régissant le statut du commerçant, le RCCM, le bail commercial et les contrats commerciaux dans l'espace OHADA.",
            content: `ACTE UNIFORME PORTANT DROIT COMMERCIAL GÉNÉRAL

TITRE PRELIMINAIRE - DISPOSITIONS GENERALES

Article 1 : Le présent Acte uniforme s'applique à tout commerçant, personne physique ou morale.

LIVRE PREMIER - LE COMMERCANT

Article 2 : Est commerçant celui qui fait de l'accomplissement d'actes de commerce par nature sa profession.

Article 3 : Les actes de commerce par nature sont réputés faits dans un but de spéculation.

LIVRE DEUXIEME - LE FONDS DE COMMERCE

Article 103 : Le fonds de commerce est constitué par l'ensemble des biens meubles corporels et incorporels affectés à l'exercice d'une ou plusieurs activités commerciales.

Article 104 : Sont notamment compris dans le fonds de commerce : la clientèle, l'enseigne, le nom commercial, les brevets d'invention, les licences, les marques de produits ou de services.

LIVRE TROISIEME - LE BAIL COMMERCIAL

Article 101 : Les dispositions du présent Livre s'appliquent aux baux des immeubles ou locaux dans lesquels un fonds est exploité, que ce fonds appartienne soit à un commerçant, soit à un artisan immatriculé au Registre du Commerce et du Crédit Mobilier.

Article 102 : Le bailleur ne peut refuser le renouvellement du bail que s'il justifie d'un motif grave et légitime à l'encontre du locataire.

Article 105 : Le bail commercial est conclu pour une durée minimale de deux (2) ans.`,
            keywords: JSON.stringify(["commerce", "bail", "commerçant", "RCCM", "fonds de commerce", "OHADA"]),
            status: "VALIDATED"
        },

        {
            title: "Acte Uniforme portant organisation des Sûretés (AUS)",
            type: "LOI",
            court: "OHADA",
            region: "OHADA",
            date: new Date("2010-12-15"),
            reference: "AUS-2010",
            summary: "Régime juridique des sûretés personnelles et réelles mobilières dans l'espace OHADA.",
            content: `ACTE UNIFORME PORTANT ORGANISATION DES SURETES

TITRE PREMIER - DISPOSITIONS GENERALES

Article 1 : Les sûretés sont des garanties destinées à assurer le paiement d'une obligation.

TITRE II - LES SURETES PERSONNELLES

Chapitre 1 - Le cautionnement
Article 4 : Le cautionnement est le contrat par lequel une personne, la caution, s'oblige envers le créancier à satisfaire à l'obligation du débiteur, si celui-ci n'y satisfait pas lui-même.

TITRE III - LES SURETES REELLES MOBILIERES

Chapitre 1 - Le gage
Article 92 : Le gage est un contrat par lequel un bien meuble est remis au créancier ou à un tiers convenu pour garantir le paiement d'une dette.

Chapitre 2 - Le nantissement
Article 108 : Le nantissement sans dépossession permet au débiteur de conserver l'usage du bien gagé tout en garantissant le créancier.`,
            keywords: JSON.stringify(["sûretés", "cautionnement", "gage", "nantissement", "garantie", "OHADA"]),
            status: "VALIDATED"
        },

        {
            title: "Acte Uniforme relatif au Droit des Sociétés Commerciales et du GIE (AUDSCGIE)",
            type: "LOI",
            court: "OHADA",
            region: "OHADA",
            date: new Date("2014-01-30"),
            reference: "AUDSCGIE-2014",
            summary: "Cadre juridique des sociétés commerciales (SARL, SA, SAS, GIE) dans l'espace OHADA.",
            content: `ACTE UNIFORME RELATIF AU DROIT DES SOCIETES COMMERCIALES ET DU GIE

LIVRE PREMIER - DISPOSITIONS GENERALES

Article 4 : La société commerciale est créée par deux ou plusieurs personnes qui conviennent par contrat de mettre quelque chose en commun en vue de partager les bénéfices ou de profiter de l'économie qui pourra en résulter.

LIVRE DEUXIEME - LA SOCIETE A RESPONSABILITE LIMITEE (SARL)

Article 309 : La SARL est une société dans laquelle les associés ne sont responsables qu'à concurrence de leurs apports.

Article 311 : Le capital social doit être d'au moins un million (1.000.000) de francs CFA.

Article 313 : La SARL est dirigée par un ou plusieurs gérants nommés parmi les associés ou en dehors d'eux.

LIVRE TROISIEME - LA SOCIETE ANONYME (SA)

Article 385 : La SA est une société dans laquelle les actionnaires ne sont responsables que dans la limite de leurs apports.

Article 387 : Le capital minimum de la SA est fixé à dix millions (10.000.000) de francs CFA.`,
            keywords: JSON.stringify(["sociétés", "SARL", "SA", "SAS", "GIE", "capital social", "OHADA"]),
            status: "VALIDATED"
        },

        // === JURISPRUDENCE CCJA ===
        {
            title: "Arrêt N° 028/2024 CCJA - Rupture Abusive de Bail Commercial",
            type: "JURISPRUDENCE",
            court: "CCJA",
            region: "OHADA",
            date: new Date("2024-03-15"),
            reference: "J-028/2024",
            summary: "La CCJA rappelle que la rupture du bail commercial sans mise en demeure préalable est nulle et de nul effet. Condamnation du bailleur à des dommages-intérêts.",
            content: `COUR COMMUNE DE JUSTICE ET D'ARBITRAGE (CCJA)
ARRÊT N° 028/2024 DU 15 MARS 2024

FAITS ET PROCÉDURE :
La Société Immobilière BAMA a donné en location un local commercial à M. DIOP, commerçant exploitant un fonds de commerce de vente de matériaux.

Par lettre du 10 janvier 2023, sans mise en demeure préalable, BAMA a notifié la résiliation du bail pour défaut d'entretien du local et a procédé à l'expulsion du locataire.

M. DIOP a saisi le Tribunal de Commerce qui a débouté sa demande. La Cour d'Appel de Dakar a confirmé le jugement.

MOTIFS :

Attendu qu'il résulte des articles 101 et 133 de l'Acte Uniforme portant Droit Commercial Général que le bailleur ne peut résilier le contrat de bail commercial sans avoir préalablement servi une mise en demeure au preneur d'avoir à respecter les clauses du bail;

Attendu qu'en l'espèce, aucune mise en demeure n'a été adressée à M. DIOP avant la résiliation;

Que la rupture est donc abusive;

PAR CES MOTIFS :

- CASSE et ANNULE l'arrêt de la Cour d'Appel de Dakar;
- DIT que la rupture du bail est abusive;
- CONDAMNE la Société BAMA à verser 15.000.000 FCFA de dommages-intérêts à M. DIOP.`,
            keywords: JSON.stringify(["bail commercial", "résiliation", "mise en demeure", "CCJA", "rupture abusive"]),
            status: "VALIDATED"
        },

        {
            title: "Arrêt N° 045/2023 CCJA - Validité de la Saisie-Attribution",
            type: "JURISPRUDENCE",
            court: "CCJA",
            region: "OHADA",
            date: new Date("2023-06-22"),
            reference: "J-045/2023",
            summary: "Précisions sur les mentions obligatoires du procès-verbal de saisie-attribution. Nullité en l'absence de décompte distinct des sommes dues.",
            content: `COUR COMMUNE DE JUSTICE ET D'ARBITRAGE
ARRÊT N° 045/2023 DU 22 JUIN 2023

Sur le pourvoi formé par la BICIS contre l'arrêt de la Cour d'Appel de Lomé ayant annulé une saisie-attribution pratiquée sur le compte bancaire de la société GLOBALEX.

ATTENDU que la saisie-attribution doit comporter sous peine de nullité :
- L'indication précise de la créance en principal, intérêts et frais;
- Un décompte distinct des sommes réclamées;
- La désignation de l'établissement bancaire tiers saisi.

ATTENDU qu'en l'espèce, le procès-verbal ne mentionnait pas le décompte distinct des intérêts moratoires, rendant impossible pour le débiteur de contester utilement.

PAR CES MOTIFS :

REJETTE le pourvoi;
CONFIRME l'arrêt entrepris;
CONDAMNE la BICIS aux dépens.`,
            keywords: JSON.stringify(["saisie-attribution", "nullité", "banque", "procès-verbal", "CCJA"]),
            status: "VALIDATED"
        },

        // === CODES SÉNÉGALAIS ===
        {
            title: "Code des Obligations Civiles et Commerciales (COCC)",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1976-10-22"),
            reference: "COCC-1976",
            summary: "Loi fondamentale régissant les contrats, la responsabilité civile et les obligations au Sénégal.",
            content: `CODE DES OBLIGATIONS CIVILES ET COMMERCIALES

LIVRE PREMIER - DES OBLIGATIONS EN GENERAL

TITRE PREMIER - Les sources des obligations

Chapitre 1 - Le contrat

Article 42 : Le contrat est la convention par laquelle une ou plusieurs personnes s'obligent envers une ou plusieurs autres à donner, à faire ou à ne pas faire quelque chose.

Article 43 : Les contrats sont conclus dès que les volontés des parties se sont rencontrées.

Article 62 : Les contrats légalement formés tiennent lieu de loi à ceux qui les ont faits.

Chapitre 2 - Les délits et quasi-délits

Article 83 : Tout fait quelconque de l'homme qui cause à autrui un dommage oblige celui par la faute duquel il est arrivé à le réparer.

Article 84 : Chacun est responsable du dommage qu'il a causé non seulement par son fait, mais encore par sa négligence ou par son imprudence.

LIVRE DEUXIEME - MODALITES DES OBLIGATIONS

Article 120 : L'obligation est conditionnelle lorsqu'elle dépend d'un événement futur et incertain.

Article 140 : Le débiteur est mis en demeure soit par sommation ou par tout acte équivalent, soit par l'effet de la convention lorsqu'elle porte que le débiteur sera en demeure par la seule échéance du terme.`,
            keywords: JSON.stringify(["contrat", "obligation", "responsabilité", "faute", "dommage", "Sénégal"]),
            status: "VALIDATED"
        },

        {
            title: "Code du Travail Sénégalais - Loi N° 97-17",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1997-12-01"),
            reference: "L97-17",
            summary: "Cadre juridique des relations de travail au Sénégal : contrats, licenciement, syndicats, inspection du travail.",
            content: `CODE DU TRAVAIL - LOI N° 97-17 DU 1ER DECEMBRE 1997

TITRE PREMIER - DISPOSITIONS GENERALES

Article L.1 : Le présent Code régit les relations de travail entre employeurs et travailleurs.

TITRE II - DU CONTRAT DE TRAVAIL

Article L.23 : Le contrat de travail est une convention par laquelle le travailleur s'engage à mettre son activité professionnelle sous la direction de l'employeur moyennant une rémunération.

Article L.27 : Le contrat de travail à durée déterminée ne peut avoir, dans le cas général, une durée supérieure à deux ans, renouvellement compris.

Article L.45 : Tout employeur désirant procéder à un licenciement pour motif économique doit en informer préalablement l'Inspecteur du Travail.

Article L.56 : Tout licenciement collectif fondé sur un motif économique est subordonné à l'autorisation de l'Inspecteur du Travail et de la Sécurité Sociale.

TITRE V - DES SYNDICATS PROFESSIONNELS

Article L.4 : Les travailleurs et les employeurs ont le droit de constituer librement des organisations syndicales de leur choix.`,
            keywords: JSON.stringify(["travail", "contrat", "licenciement", "syndicat", "inspection", "Sénégal"]),
            status: "VALIDATED"
        },

        {
            title: "Loi N° 64-46 sur le Domaine National",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1964-06-17"),
            reference: "L64-46",
            summary: "Loi fondamentale sur le domaine national et l'affectation des terres au Sénégal.",
            content: `LOI N° 64-46 DU 17 JUIN 1964 RELATIVE AU DOMAINE NATIONAL

Article 1er : Constituent de plein droit le domaine national toutes les terres non classées dans le domaine public, non immatriculées ou dont la propriété n'a pas été transcrite à la Conservation des Hypothèques à la date d'entrée en vigueur de la présente loi.

Article 2 : L'Etat détient les terres du domaine national en vue d'en assurer l'utilisation et le développement rationnels, conformément aux plans de développement et aux programmes d'aménagement.

Article 3 : Le domaine national est réparti en quatre catégories :
1° Les zones urbaines
2° Les zones classées
3° Les zones de terroir
4° Les zones pionnières

Article 8 : Dans les zones urbaines, les terres peuvent faire l'objet de bail ou de concession.

Article 12 : Les terres des zones de terroir sont affectées aux membres de la communauté rurale pour l'habitat et la culture.`,
            keywords: JSON.stringify(["domaine national", "terres", "affectation", "zones", "Sénégal"]),
            status: "VALIDATED"
        },

        {
            title: "Code Général des Impôts (CGI) - Édition 2025",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("2025-01-01"),
            reference: "CGI-2025",
            summary: "Code fiscal sénégalais régissant l'IS, la TVA, l'IR et les taxes locales. Nouveautés 2025 : facturation électronique obligatoire.",
            content: `CODE GENERAL DES IMPOTS - SENEGAL (EDITION 2025)

LIVRE PREMIER - IMPOTS DIRECTS

TITRE PREMIER - Impôt sur les Sociétés (IS)

Article 6 : Sont passibles de l'impôt sur les sociétés, toutes les sociétés et personnes morales se livrant à une exploitation ou à des opérations à caractère lucratif.

Article 8 : Le taux normal de l'impôt sur les sociétés est fixé à 30%.

Article 12 : Les entreprises nouvelles créées dans les zones économiques spéciales bénéficient d'une exonération totale de l'IS pendant les cinq (5) premières années d'exploitation.

TITRE II - Impôt sur le Revenu (IR)

Article 167 : L'impôt sur le revenu des personnes physiques est établi d'après le montant total du revenu net annuel.

Article 170 : Le barème progressif de l'IR comporte cinq tranches, avec un taux maximum de 40%.

LIVRE DEUXIEME - IMPOTS INDIRECTS

TITRE PREMIER - Taxe sur la Valeur Ajoutée (TVA)

Article 352 : Sont soumis à la TVA les livraisons de biens et les prestations de services effectuées à titre onéreux par un assujetti agissant en tant que tel.

Article 354 : Le taux normal de la TVA est fixé à 18%. Un taux réduit de 10% s'applique aux produits de première nécessité.

NOUVEAUTÉS 2025 :

Article 419 bis : Obligation de facturation électronique certifiée pour toutes les entreprises réalisant un CA supérieur à 100 millions FCFA.`,
            keywords: JSON.stringify(["impôts", "TVA", "IS", "IR", "fiscalité", "Sénégal", "facturation électronique"]),
            status: "VALIDATED"
        },

        // === TEXTES COMPLÉMENTAIRES ===
        {
            title: "Code de la Famille (Loi 72-61 modifiée)",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1972-06-13"),
            reference: "L72-61",
            summary: "Régime juridique du mariage, de la filiation, de la succession et des libéralités au Sénégal.",
            content: `CODE DE LA FAMILLE - LOI N° 72-61 DU 13 JUIN 1972

LIVRE PREMIER - DU MARIAGE

Article 116 : Le mariage est l'union légale de deux personnes de sexe différent.

Article 143 : Le régime matrimonial peut être : la séparation des biens, la communauté des biens ou la communauté de meubles et acquêts.

LIVRE QUATRIEME - DES SUCCESSIONS

Article 522 : La succession est dévolue sans distinction de sexe et de primogéniture.

Article 533 : En présence de descendants et du conjoint survivant, l'actif successoral est divisé comme suit :
- 1/4 au conjoint survivant
- 3/4 aux descendants

Article 548 : La réserve héréditaire est la part minimale garantie aux héritiers réservataires. Elle est de :
- 1/2 si le défunt ne laisse qu'un enfant
- 2/3 s'il laisse deux enfants
- 3/4 s'il laisse trois enfants ou plus`,
            keywords: JSON.stringify(["famille", "mariage", "succession", "héritage", "régime matrimonial", "Sénégal"]),
            status: "VALIDATED"
        },

        {
            title: "Loi sur l'Expropriation pour Cause d'Utilité Publique (N° 76-67)",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1976-07-02"),
            reference: "L76-67",
            summary: "Procédure et conditions d'expropriation des immeubles pour cause d'utilité publique.",
            content: `LOI N° 76-67 DU 2 JUILLET 1976 RELATIVE A L'EXPROPRIATION

Article 1er : L'expropriation d'immeubles, en tout ou en partie, ou de droits réels immobiliers ne peut être prononcée qu'autant qu'elle aura été précédée d'une déclaration d'utilité publique intervenue à la suite d'une enquête.

Article 3 : L'utilité publique est constatée par un décret pris en Conseil des Ministres.

Article 8 : L'indemnité d'expropriation doit comprendre le prix du terrain et des impenses (constructions, plantations).

Article 12 : À défaut d'accord amiable, l'indemnité est fixée par le juge de l'expropriation.

Article 15 : Le transfert de propriété n'a lieu qu'après paiement ou consignation de l'indemnité.`,
            keywords: JSON.stringify(["expropriation", "utilité publique", "indemnité", "immobilier", "Sénégal"]),
            status: "VALIDATED"
        },

        {
            title: "Code Pénal Sénégalais (Réforme 2024)",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("2024-02-09"),
            reference: "CP-2024",
            summary: "Code pénal avec les nouvelles infractions numériques et le renforcement de la lutte anti-corruption.",
            content: `CODE PENAL SENEGALAIS - REFORME N° 2024-06 DU 9 FEVRIER 2024

LIVRE PREMIER - DISPOSITIONS GENERALES

Article 1er : Nul ne peut être puni d'une peine qui n'était pas prononcée par la loi avant que l'infraction fût commise.

Article 4 : Les infractions sont classées en trois catégories : crimes, délits et contraventions.

LIVRE II - DES CRIMES ET DELITS

Titre VII bis - DES INFRACTIONS NUMERIQUES (Cybercriminalité)

Article 431-1 : L'accès frauduleux à un système de traitement automatisé de données est puni de deux (2) à cinq (5) ans d'emprisonnement et d'une amende de 500.000 à 5.000.000 FCFA.

Article 431-5 : La propagation intentionnelle de fausses nouvelles via les réseaux sociaux causant un trouble à l'ordre public est punie d'une amende de 500.000 à 5.000.000 FCFA.

Titre X - LUTTE CONTRE LA CORRUPTION

Article 485-1 : Création de pôles judiciaires financiers spécialisés dans les affaires de corruption.

Article 485-7 : Extension de la saisie des avoirs illicites aux prête-noms et sociétés écrans.`,
            keywords: JSON.stringify(["pénal", "cybercriminalité", "corruption", "infractions", "Sénégal"]),
            status: "VALIDATED"
        }
    ];

    console.log(`📚 Installation de ${textes.length} textes juridiques...\n`);

    for (const texte of textes) {
        await prisma.jurisprudence.create({ data: texte });
        console.log(`   ✅ ${texte.title}`);
    }

    console.log(`\n🎉 RESTAURATION TERMINÉE !`);
    console.log(`   Total installé : ${textes.length} textes`);
}

restoreFullLibrary()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error('❌ Erreur :', e);
        await prisma.$disconnect();
        process.exit(1);
    });
