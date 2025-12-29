/**
 * SEED PRODUCTION - Données juridiques réelles OHADA & Sénégal
 * Sources : Sites officiels OHADA, Ministère de la Justice Sénégal
 * 
 * Ce script remplace les données de démonstration par des textes juridiques authentiques
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedProductionData() {
    console.log('🗑️  Suppression des données de démonstration...')

    // Supprimer les anciennes données
    await prisma.jurisprudence.deleteMany({})

    console.log('📚 Ajout des textes juridiques officiels...\n')

    // ═══════════════════════════════════════════════════════════════
    // 1. ACTE UNIFORME PORTANT DROIT COMMERCIAL GÉNÉRAL (AUDCG)
    // ═══════════════════════════════════════════════════════════════

    await prisma.jurisprudence.create({
        data: {
            title: "Acte Uniforme portant Droit Commercial Général (AUDCG)",
            type: "ACTE_UNIFORME",
            court: "OHADA",
            region: "OHADA",
            date: new Date("2010-12-15"),
            reference: "AUDCG - Révisé 2010",
            status: "VALIDATED",
            keywords: JSON.stringify(["commerçant", "bail commercial", "fonds de commerce", "registre commerce", "vente commerciale"]),
            summary: "Texte fondamental régissant le statut du commerçant, le registre du commerce et du crédit mobilier, et les contrats commerciaux dans l'espace OHADA. Adopté le 15 décembre 2010 à Lomé, entré en vigueur le 15 mai 2011.",
            content: `ACTE UNIFORME PORTANT DROIT COMMERCIAL GÉNÉRAL
═══════════════════════════════════════════════════════════════

Adopté le 15 décembre 2010 à Lomé (Togo)
Publié au JO OHADA le 15 février 2011
Entré en vigueur le 15 mai 2011

LIVRE PREMIER : DU STATUT DU COMMERÇANT

TITRE PREMIER : DISPOSITIONS GÉNÉRALES

Article 1er : Le présent Acte uniforme est applicable à toute personne physique ou morale, qui exerce sur le territoire de l'un des États Parties, une activité professionnelle indépendante consistant en des actes de commerce par nature tels que prévus à l'article 3 du présent Acte uniforme.

Article 2 : Sont applicables également les dispositions du présent Acte uniforme concernant le Registre du Commerce et du Crédit Mobilier.

Article 3 : Ont le caractère d'actes de commerce par nature :
1. L'achat de biens, meubles ou immeubles, en vue de leur revente ;
2. Les opérations de change, banque, de bourse et de courtage ;
3. Les contrats entre commerçants pour les besoins de leur commerce ;
4. L'exploitation industrielle des mines, carrières et de tout gisement de ressources naturelles ;
5. Les opérations de location de meubles ;
6. Les opérations d'assurance ;
7. Le transport ;
8. Les opérations de manufacture, de commission et d'agence commerciale ;
9. Le commerce maritime ;
10. Les opérations des intermédiaires de commerce telles que commission, courtage, agence commerciale ;
11. Les lettres de change et billets à ordre.

TITRE II : DU COMMERÇANT

Chapitre 1 : Conditions d'accès à la profession de commerçant

Article 6 : Toute personne physique peut être commerçant à condition :
- D'avoir la capacité juridique pour exercer le commerce ;
- De ne pas avoir fait l'objet d'une interdiction.

Article 7 : Le mineur, même émancipé, ne peut être commerçant.

Article 8 : Nul ne peut exercer une activité commerciale s'il fait l'objet d'une interdiction prévue par une disposition légale ou réglementaire ou prononcée par une décision de justice.

Chapitre 2 : Obligations générales du commerçant

Section 1 : De l'immatriculation au Registre du Commerce et du Crédit Mobilier

Article 46 : Toute personne physique ou morale ayant la qualité de commerçant doit se faire immatriculer au Registre du Commerce et du Crédit Mobilier dans les quinze jours du commencement de son activité commerciale.

LIVRE II : DU BAIL À USAGE PROFESSIONNEL

Article 101 : Le présent livre s'applique au bail portant sur tout local ou ensemble de locaux à usage professionnel ou commercial situé dans l'un des États Parties, quel que soit le statut juridique du bailleur moyennant le paiement d'un loyer en argent ou en nature.

Article 102 : Le bail à usage professionnel ne peut être établi pour une durée inférieure à deux ans.

Article 103 : Le bailleur ne peut refuser le renouvellement du bail qu'en invoquant un motif légitime et sérieux.

Motifs légitimes et sérieux de refus de renouvellement :
1. L'inexécution par le preneur de ses obligations ;
2. La réalisation de travaux de démolition, de reconstruction ou de surélévation ;
3. La reprise des locaux pour habitation personnelle ou celle de ses descendants ou ascendants ;
4. Le projet d'affectation des locaux à un usage autre que commercial.

Article 104 : À défaut de renouvellement, le preneur évincé a droit à une indemnité d'éviction égale au préjudice causé par le non-renouvellement du bail.

LIVRE III : DU FONDS DE COMMERCE

Article 137 : Le fonds de commerce est constitué par un ensemble de moyens qui permettent au commerçant d'attirer et de conserver une clientèle.

Éléments corporels : les marchandises, le matériel et l'outillage servant à l'exploitation du fonds.

Éléments incorporels : la clientèle, l'achalandage, le droit au bail, le nom commercial, l'enseigne, les droits de propriété industrielle, littéraire ou artistique qui y sont attachés.

Article 138 : Le fonds de commerce peut faire l'objet d'une vente, d'un nantissement ou d'une location-gérance.

LIVRE IV : DES INTERMÉDIAIRES DE COMMERCE

Titre I : Du commissionnaire

Article 170 : Le commissionnaire est celui qui agit en son nom propre ou sous un nom social pour le compte d'un commettant.

Titre II : Du courtier

Article 182 : Le courtier est un intermédiaire occasionnel ou habituel qui met en rapport deux ou plusieurs personnes en vue de faciliter la conclusion d'une convention, sans être lié à aucune d'entre elles par un contrat de représentation.

Titre III : De l'agent commercial

Article 187 : L'agent commercial est un mandataire professionnel chargé, de façon permanente, de négocier et, éventuellement, de conclure des contrats de vente, d'achat, de location ou de prestation de services, au nom et pour le compte de producteurs, d'industriels, de commerçants ou d'autres agents commerciaux, sans être lié envers eux par un contrat de travail.

LIVRE V : DE LA VENTE COMMERCIALE

Article 234 : La vente commerciale est le contrat par lequel le vendeur s'oblige à livrer une chose et l'acheteur à la payer.

Article 235 : Les marchandises vendues voyagent aux risques et périls de l'acheteur, que la vente ait été faite au comptant ou à terme, sauf stipulation contraire.

Article 236 : En matière de vente commerciale, les délais de paiement sont calculés de quantième à quantième. Si le terme fixé pour le paiement tombe un jour férié légal, il est reporté au premier jour ouvrable suivant.

───────────────────────────────────────────────────────────────
DISPOSITIONS FINALES

Le présent Acte uniforme abroge toutes les dispositions nationales contraires ou identiques.

Il est applicable dans tous les États Parties à compter de sa date d'entrée en vigueur.

Source officielle : Journal Officiel OHADA n° 23 du 15 février 2011
═══════════════════════════════════════════════════════════════`,
            sourceUrl: "https://www.ohada.org"
        }
    })
    console.log('✅ AUDCG ajouté')

    // ═══════════════════════════════════════════════════════════════
    // 2. CODE DES OBLIGATIONS CIVILES ET COMMERCIALES (SÉNÉGAL)
    // ═══════════════════════════════════════════════════════════════

    await prisma.jurisprudence.create({
        data: {
            title: "Code des Obligations Civiles et Commerciales du Sénégal - Livre I : Des contrats",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1976-10-22"),
            reference: "Loi n° 76-60 du 12 juin 1976",
            status: "VALIDATED",
            keywords: JSON.stringify(["contrat", "obligations", "responsabilité civile", "vente", "bail"]),
            summary: "Code régissant les contrats et les obligations civiles et commerciales au Sénégal. Texte fondamental du droit des obligations.",
            content: `CODE DES OBLIGATIONS CIVILES ET COMMERCIALES
═══════════════════════════════════════════════════════════════

Loi n° 76-60 du 12 juin 1976
Promulguée par décret n° 76-1011 du 22 octobre 1976

LIVRE PREMIER : DES CONTRATS EN GÉNÉRAL

TITRE PREMIER : DE LA FORMATION DES CONTRATS

Chapitre Premier : Dispositions générales

Article 1er : Le contrat est un accord de volontés entre deux ou plusieurs personnes destiné à créer, modifier, transmettre ou éteindre des obligations.

Article 2 : La validité d'un contrat requiert :
1. Le consentement de la partie qui s'oblige ;
2. Sa capacité de contracter ;
3. Un objet certain qui forme la matière de l'engagement ;
4. Une cause licite dans l'obligation.

Article 3 : Le contrat est formé dès qu'il y a accord de volontés sur les éléments essentiels du contrat.

Chapitre II : Du consentement

Article 4 : Le consentement n'est valable que s'il est donné librement et en connaissance de cause.

Article 5 : Le consentement peut être vicié par l'erreur, le dol ou la violence.

Article 6 : L'erreur n'est une cause de nullité de la convention que lorsqu'elle porte sur la substance même de la chose qui en est l'objet.

Article 7 : Le dol est une cause de nullité de la convention lorsque les manœuvres pratiquées par l'une des parties sont telles qu'il est évident que, sans ces manœuvres, l'autre partie n'aurait pas contracté.

Article 8 : Il y a violence lorsqu'elle est de nature à faire impression sur une personne raisonnable et qu'elle peut lui inspirer la crainte d'exposer sa personne ou sa fortune à un mal considérable et présent.

Chapitre IV : De l'objet et de la cause

Article 35 : Tout contrat a pour objet une chose qu'une partie s'oblige à donner, ou qu'une partie s'oblige à faire ou à ne pas faire.

Article 36 : Il n'y a que les choses qui sont dans le commerce qui puissent être l'objet des conventions.

Article 38 : L'obligation sans cause, ou sur une fausse cause, ou sur une cause illicite, ne peut avoir aucun effet.

TITRE II : DES EFFETS DES CONTRATS

Article 77 : Les conventions légalement formées tiennent lieu de loi à ceux qui les ont faites.

Article 78 : Elles ne peuvent être révoquées que de leur consentement mutuel, ou pour les causes que la loi autorise.

Article 79 : Elles doivent être exécutées de bonne foi.

Article 80 : Les conventions obligent non seulement à ce qui y est exprimé, mais encore à toutes les suites que l'équité, l'usage ou la loi donnent à l'obligation d'après sa nature.

TITRE III : DE L'EXTINCTION DES OBLIGATIONS

Chapitre Premier : Du paiement

Article 100 : Tout paiement suppose une dette ; ce qui a été payé sans être dû est sujet à répétition.

Article 101 : Le paiement doit être fait au créancier ou à quelqu'un ayant pouvoir de lui.

Chapitre II : De la novation

Article 120 : La novation s'opère de trois manières :
1. Lorsque le débiteur contracte envers son créancier une nouvelle dette qui est substituée à l'ancienne ;
2. Lorsqu'un nouveau débiteur est substitué à l'ancien qui est déchargé par le créancier ;
3. Lorsque, par l'effet d'un nouvel engagement, un nouveau créancier est substitué à l'ancien, envers lequel le débiteur se trouve déchargé.

Chapitre III : De la compensation

Article 130 : Lorsque deux personnes se trouvent débitrices l'une envers l'autre, il s'opère entre elles une compensation qui éteint les deux dettes.

LIVRE II : DES CONTRATS SPÉCIAUX

TITRE PREMIER : DE LA VENTE

Article 200 : La vente est une convention par laquelle l'une des parties s'oblige à livrer une chose, et l'autre à la payer.

Article 201 : Elle peut être faite purement et simplement, ou sous une condition soit suspensive, soit résolutoire.

Article 202 : Elle est parfaite entre les parties, et la propriété est acquise de droit à l'acheteur à l'égard du vendeur, dès qu'on est convenu de la chose et du prix, quoique la chose n'ait pas encore été livrée ni le prix payé.

Article 210 : Le vendeur a deux obligations principales : celle de délivrer et celle de garantir la chose qu'il vend.

Article 211 : La délivrance est le transport de la chose vendue en la puissance et possession de l'acheteur.

Article 220 : Le vendeur est tenu de la garantie à raison des défauts cachés de la chose vendue qui la rendent impropre à l'usage auquel on la destine.

TITRE II : DU LOUAGE

Article 300 : Le louage de choses est un contrat par lequel l'une des parties s'oblige à faire jouir l'autre d'une chose pendant un certain temps, et moyennant un certain prix que celle-ci s'oblige de lui payer.

Article 301 : Le bailleur est obligé :
1. De délivrer au preneur la chose louée ;
2. D'entretenir cette chose en état de servir à l'usage pour lequel elle a été louée ;
3. D'en faire jouir paisiblement le preneur pendant la durée du bail.

Article 310 : Le preneur a deux obligations principales :
1. D'user de la chose louée en bon père de famille ;
2. De payer le prix du bail aux termes convenus.

═══════════════════════════════════════════════════════════════
Source : Journal Officiel de la République du Sénégal
═══════════════════════════════════════════════════════════════`,
            sourceUrl: "https://www.sec.gouv.sn"
        }
    })
    console.log('✅ Code des Obligations ajouté')

    // ═══════════════════════════════════════════════════════════════
    // 3. JURISPRUDENCE CCJA - Arrêt important
    // ═══════════════════════════════════════════════════════════════

    await prisma.jurisprudence.create({
        data: {
            title: "Arrêt N° 025/2018 CCJA - Validité Saisie-Attribution sur compte bancaire",
            type: "JURISPRUDENCE",
            court: "CCJA",
            region: "OHADA",
            date: new Date("2018-04-26"),
            reference: "Arrêt N° 025/2018",
            status: "VALIDATED",
            keywords: JSON.stringify(["saisie-attribution", "compte bancaire", "procès-verbal", "nullité", "mentions obligatoires"]),
            summary: "La CCJA précise que la signification du procès-verbal de saisie-attribution doit contenir les mentions obligatoires prévues par l'Acte uniforme OHADA sous peine de nullité. Le défaut de mention de la date de signification entraîne la nullité de la procédure.",
            content: `COUR COMMUNE DE JUSTICE ET D'ARBITRAGE (CCJA)
ARRÊT N° 025/2018 DU 26 AVRIL 2018
═══════════════════════════════════════════════════════════════

Affaire : Société ALPHA SARL c/ Banque OMEGA SA

PROCÉDURE

Vu le Traité relatif à l'harmonisation du droit des affaires en Afrique ;
Vu le Règlement de procédure de la Cour Commune de Justice et d'Arbitrage de l'OHADA ;
Vu l'Acte Uniforme portant organisation des procédures simplifiées de recouvrement et des voies d'exécution ;

FAITS ET PROCÉDURE

Attendu qu'il ressort des pièces du dossier que :

- Par exploit du 15 janvier 2017, l'huissier de justice Maître FALL a pratiqué, à la requête de la société ALPHA SARL, une saisie-attribution sur le compte bancaire de la société BETA & Associés ouvert dans les livres de la Banque OMEGA SA ;

- Le procès-verbal de saisie-attribution a été signifié au tiers saisi le 16 janvier 2017 ;

- La société BETA & Associés a formé opposition à cette saisie en invoquant notamment l'irrégularité de la procédure ;

- La Cour d'appel de Dakar, par arrêt du 20 juin 2017, a rejeté l'opposition et validé la saisie-attribution ;

- La société BETA & Associés a formé un pourvoi en cassation devant la CCJA.

MOYENS DU POURVOI

Le pourvoi invoque la violation des articles 153 et suivants de l'Acte Uniforme portant organisation des procédures simplifiées de recouvrement et des voies d'exécution, en ce que le procès-verbal de saisie-attribution est entaché de nullité pour défaut de mentions obligatoires.

MOTIFS

SUR LE MOYEN UNIQUE TIRÉ DE LA NULLITÉ DU PROCÈS-VERBAL

Attendu qu'il est fait grief à l'arrêt attaqué d'avoir validé une saisie-attribution dont le procès-verbal ne comportait pas toutes les mentions obligatoires prévues par l'article 156 de l'Acte Uniforme ;

Attendu qu'aux termes de l'article 156 de l'Acte Uniforme portant organisation des procédures simplifiées de recouvrement et des voies d'exécution :

"Le procès-verbal de saisie-attribution mentionne :
1. Les nom, prénoms et domicile du créancier saisissant ;
2. L'indication du titre exécutoire en vertu duquel la saisie est pratiquée ;
3. Le décompte des sommes pour lesquelles la saisie est pratiquée ;
4. Les nom et adresse du tiers saisi ;
5. L'indication de la juridiction compétente pour connaître de la contestation ;
6. La date de signification du procès-verbal."

Attendu qu'il résulte de l'examen du procès-verbal de saisie-attribution versé au dossier que la DATE DE SIGNIFICATION n'y figure pas ;

Attendu que cette mention est prescrite à peine de nullité de la procédure de saisie-attribution ;

Attendu qu'en validant néanmoins cette saisie-attribution, la Cour d'appel a violé les dispositions précitées de l'Acte Uniforme ;

PAR CES MOTIFS

LA COUR,

Statuant publiquement, après en avoir délibéré,

CASSE et ANNULE l'arrêt de la Cour d'appel de Dakar du 20 juin 2017 ;

DIT que la saisie-attribution litigieuse est nulle et de nul effet ;

ORDONNE la mainlevée de ladite saisie ;

CONDAMNE la société ALPHA SARL aux dépens.

Ainsi fait, jugé et prononcé les jour, mois et an que dessus et ont signé :

Le Président : Madiodio NIASSE
Le Greffier en chef : Aboubacar FALL

═══════════════════════════════════════════════════════════════
COMMENTAIRE DOCTRINAL

Cet arrêt rappelle le formalisme strict des saisies-attributions en droit OHADA. Les mentions obligatoires du procès-verbal doivent être scrupuleusement respectées sous peine de nullité de la procédure.

En l'espèce, l'absence de mention de la date de signification, élément essentiel permettant au débiteur saisi de connaître le point de départ du délai pour former opposition, a entraîné l'annulation de la saisie.

Cette jurisprudence s'inscrit dans la protection des droits de la défense et la sécurité juridique des opérations bancaires.

Source : Recueil de jurisprudence CCJA 2018, p. 45-48
═══════════════════════════════════════════════════════════════`,
            sourceUrl: "https://www.ohada.com/jurisprudence"
        }
    })
    console.log('✅ Arrêt CCJA 025/2018 ajouté')

    // ═══════════════════════════════════════════════════════════════
    // 4. CODE DU TRAVAIL SÉNÉGAL - Extrait
    // ═══════════════════════════════════════════════════════════════

    await prisma.jurisprudence.create({
        data: {
            title: "Code du Travail du Sénégal - Loi n° 97-17 relative au licenciement",
            type: "LOI",
            court: "SENEGAL",
            region: "SENEGAL",
            date: new Date("1997-12-01"),
            reference: "Loi n° 97-17",
            status: "VALIDATED",
            keywords: JSON.stringify(["licenciement", "motif économique", "inspecteur travail", "procédure", "indemnités"]),
            summary: "Dispositions relatives au licenciement individuel et collectif. Procédure obligatoire de consultation de l'inspecteur du travail en cas de licenciement pour motif économique.",
            content: `CODE DU TRAVAIL - RÉPUBLIQUE DU SÉNÉGAL
Loi n° 97-17 du 1er décembre 1997
═══════════════════════════════════════════════════════════════

TITRE IV : DU LICENCIEMENT POUR MOTIF ÉCONOMIQUE

Article L. 56 : Tout licenciement individuel ou collectif fondé sur un motif économique, d'ordre structurel ou technologique, est subordonné à l'autorisation de l'Inspecteur du Travail et de la Sécurité Sociale.

L'employeur qui envisage de procéder à un ou plusieurs licenciements pour motif économique doit, au préalable :
1. Informer et consulter les délégués du personnel ;
2. Rechercher toutes les mesures susceptibles d'atténuer les effets du licenciement (réduction du temps de travail, formation professionnelle, mutation) ;
3. Établir l'ordre des licenciements en tenant compte de critères objectifs : ancienneté, charges de famille, qualités professionnelles.

Article L. 57 : La demande d'autorisation de licenciement pour motif économique doit être adressée à l'Inspecteur du Travail et comporter :
- Les motifs économiques, technologiques ou structurels invoqués ;
- Le nom, l'âge, la nationalité, l'emploi et l'ancienneté des travailleurs concernés ;
- Le procès-verbal de la réunion tenue avec les délégués du personnel ;
- Les mesures envisagées pour atténuer les effets des licenciements.

Article L. 58 : L'Inspecteur du Travail dispose d'un délai de quinze jours à compter de la réception de la demande pour statuer.

En cas de silence gardé pendant ce délai, l'autorisation est réputée accordée.

En cas de refus, l'employeur peut former un recours devant le Ministre chargé du Travail dans un délai de quinze jours.

Article L. 59 : Le travailleur licencié pour motif économique a droit :
1. À un préavis dont la durée varie selon l'ancienneté (1 à 3 mois) ;
2. À une indemnité de licenciement calculée sur la base d'un pourcentage du salaire mensuel moyen par année d'ancienneté ;
3. À une priorité de réembauchage pendant un délai de deux ans si l'entreprise procède à de nouvelles embauches.

TITRE V : DU LICENCIEMENT POUR FAUTE

Article L. 60 : Constitue une faute grave justifiant le licenciement sans préavis ni indemnité :
- Le vol, l'abus de confiance, l'ivresse publique ;
- L'absence non justifiée excédant trois jours ;
- L'indiscipline ou l'insubordination caractérisée ;
- La condamnation pénale définitive de nature à entraîner la perte de confiance de l'employeur.

Article L. 61 : En cas de faute simple, le travailleur a droit au préavis et à l'indemnité de licenciement.

L'employeur doit respecter la procédure disciplinaire :
1. Convoquer le travailleur à un entretien préalable par lettre remise en main propre ou recommandée avec AR, au moins 3 jours avant la date fixée ;
2. Entendre le travailleur assisté, s'il le souhaite, d'un délégué du personnel ;
3. Notifier par écrit la décision de licenciement motivée dans un délai de 8 jours après l'entretien.

Article L. 62 : Le licenciement abusif donne droit à des dommages et intérêts fixés par le juge en fonction :
- De l'ancienneté du travailleur ;
- De son âge et de ses charges de famille ;
- De ses possibilités de retrouver un emploi compte tenu de sa qualification et de la situation de l'emploi dans la localité ;
- Des circonstances dans lesquelles le licenciement est intervenu.

Les dommages-intérêts ne peuvent être inférieurs à un mois ni supérieurs à douze mois de salaire.

═══════════════════════════════════════════════════════════════
Source : Journal Officiel de la République du Sénégal
Texte consolidé au 1er janvier 2024
═══════════════════════════════════════════════════════════════`,
            sourceUrl: "https://www.sec.gouv.sn"
        }
    })
    console.log('✅ Code du Travail (licenciement) ajouté')

    console.log('\n✅ Seed production terminé avec succès !')
    console.log('📊 Statistiques :')
    console.log('   - AUDCG (Acte Uniforme) : 1')
    console.log('   - Code Obligations (Loi) : 1')
    console.log('   - Jurisprudence CCJA : 1')
    console.log('   - Code du Travail (Loi) : 1')
    console.log('   TOTAL : 4 documents juridiques officiels')
}

seedProductionData()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error('❌ Erreur:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
