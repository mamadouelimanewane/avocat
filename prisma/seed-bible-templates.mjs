
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TEMPLATES = [
    // === AFFAIRES (OHADA) ===
    {
        name: "Statuts SARL (OHADA)",
        category: "AFFAIRES",
        content: "<h1>Statuts de la Société À Responsabilité Limitée [NOM_SOCIETE]</h1><p>Entre les soussignés : [LISTE_ASSOCIES]</p><p>Il a été établi les statuts de la société suivante...</p>",
        variables: JSON.stringify(["NOM_SOCIETE", "LISTE_ASSOCIES", "CAPITAL", "SIEGE_SOCIAL", "GERANT"])
    },
    {
        name: "Procès-Verbal d'Assemblée Générale Ordinaire",
        category: "AFFAIRES",
        content: "<h1>Procès-Verbal des Délibérations de l'AGO du [DATE_AG]</h1><p>L'an [ANNEE], le [DATE] à [HEURE], les associés de la société [NOM_SOCIETE] se sont réunis...</p>",
        variables: JSON.stringify(["DATE_AG", "ANNEE", "DATE", "HEURE", "NOM_SOCIETE", "ORDRE_DU_JOUR", "RESOLUTIONS"])
    },
    {
        name: "Contrat de Cession de Parts Sociales",
        category: "AFFAIRES",
        content: "<h1>Cession de Parts Sociales</h1><p>Entre [CEDANT] et [CESSIONNAIRE], il a été convenu ce qui suit...</p>",
        variables: JSON.stringify(["CEDANT", "CESSIONNAIRE", "NOM_SOCIETE", "NOMBRE_PARTS", "PRIX_CESSION"])
    },
    {
        name: "Pacte d'Actionnaires / Associés",
        category: "AFFAIRES",
        content: "<h1>Pacte d'Associés</h1><p>En présence de [LISTE_PARTIES], règlementant les relations au sein de [NOM_SOCIETE]...</p>",
        variables: JSON.stringify(["LISTE_PARTIES", "NOM_SOCIETE", "MODALITES_SORTIE", "DROIT_PREEMPTION"])
    },
    {
        name: "Bail Commercial (OHADA)",
        category: "AFFAIRES",
        content: "<h1>Contrat de Bail Commercial</h1><p>Entre [BAILLEUR] et [PRENEUR], concernant les locaux situés à [ADRESSE_LOCAUX]...</p>",
        variables: JSON.stringify(["BAILLEUR", "PRENEUR", "ADRESSE_LOCAUX", "LOYER_MENSUEL", "DUREE_BAIL", "ACTIVITE"])
    },

    // === TRAVAIL ===
    {
        name: "Contrat de Travail à Durée Indéterminée (CDI)",
        category: "TRAVAIL",
        content: "<h1>Contrat de Travail (CDI)</h1><p>Entre [EMPLOYEUR] et [EMPLOYE]. Il est engagé en qualité de [POSTE]...</p>",
        variables: JSON.stringify(["EMPLOYEUR", "EMPLOYE", "POSTE", "SALAIRE", "DATE_DEBUT", "LIEU_TRAVAIL"])
    },
    {
        name: "Contrat de Travail à Durée Déterminée (CDD)",
        category: "TRAVAIL",
        content: "<h1>Contrat de Travail (CDD)</h1><p>Motif du recours : [MOTIF_RECOURS]. Durée : du [DATE_DEBUT] au [DATE_FIN]...</p>",
        variables: JSON.stringify(["EMPLOYEUR", "EMPLOYE", "MOTIF_RECOURS", "DATE_DEBUT", "DATE_FIN", "SALAIRE"])
    },
    {
        name: "Lettre de Licenciement pour Motif Personnel",
        category: "TRAVAIL",
        content: "<h1>Notification de Licenciement</h1><p>Monsieur/Madame [NOM_EMPLOYE], suite à notre entretien du [DATE_ENTRETIEN]...</p>",
        variables: JSON.stringify(["NOM_EMPLOYE", "DATE_ENTRETIEN", "MOTIFS_LICENCIEMENT", "PREAVIS"])
    },
    {
        name: "Règlement Intérieur (Conformité Sénégal)",
        category: "TRAVAIL",
        content: "<h1>Règlement Intérieur</h1><p>Ce règlement s'applique à tous les salariés de [NOM_ENTREPRISE]...</p>",
        variables: JSON.stringify(["NOM_ENTREPRISE", "DATE_VIGUEUR"])
    },
    {
        name: "Accord de Rupture Conventionnelle",
        category: "TRAVAIL",
        content: "<h1>Convention de Rupture</h1><p>Entre [EMPLOYEUR] et [EMPLOYE], il est convenu de rompre le contrat d'un commun accord...</p>",
        variables: JSON.stringify(["EMPLOYEUR", "EMPLOYE", "DATE_RUPTURE", "INDEMNITE_RUPTURE"])
    },

    // === FONCIER ===
    {
        name: "Promesse Synallagmatique de Vente (Compromis)",
        category: "FONCIER",
        content: "<h1>Compromis de Vente</h1><p>Entre [VENDEUR] et [ACQUEREUR]. Objet du contrat : [DESCRIPTION_BIEN]...</p>",
        variables: JSON.stringify(["VENDEUR", "ACQUEREUR", "DESCRIPTION_BIEN", "PRIX_VENTE", "CONDITIONS_SUSPENSIVES"])
    },
    {
        name: "Contrat de Bail à Usage d'Habitation",
        category: "FONCIER",
        content: "<h1>Bail d'Habitation</h1><p>Locaux situés à [ADRESSE]. Durée : [DUREE]. Loyer : [MONTANT_LOYER]...</p>",
        variables: JSON.stringify(["BAILLEUR", "LOCATAIRE", "ADRESSE", "DUREE", "MONTANT_LOYER", "CHARGES"])
    },
    {
        name: "Acte de Vente Immobilière",
        category: "FONCIER",
        content: "<h1>Acte de Vente</h1><p>Par devant Maître [NOTAIRE], [VENDEUR] vend à [ACQUEREUR] le bien immatriculé [TITRE_FONCIER]...</p>",
        variables: JSON.stringify(["NOTAIRE", "VENDEUR", "ACQUEREUR", "TITRE_FONCIER", "PRIX", "MODALITES_PAIEMENT"])
    },

    // === CIVIL & FAMILLE ===
    {
        name: "Convention de Divorce par Consentement Mutuel",
        category: "CIVIL",
        content: "<h1>Convention de Divorce</h1><p>Entre M. [EPOUX] et Mme [EPOUSE]. Ils conviennent des effets de leur divorce comme suit...</p>",
        variables: JSON.stringify(["EPOUX", "EPOUSE", "GARDE_ENFANTS", "PENSION_ALIMENTAIRE", "PARTAGE_BIENS"])
    },
    {
        name: "Testament Olographe",
        category: "CIVIL",
        content: "<h1>Testament</h1><p>Ceci est mon testament. Je soussigné(e) [TESTATEUR], sain(e) de corps et d'esprit...</p>",
        variables: JSON.stringify(["TESTATEUR", "DATE", "NOM_LEGATAIRES", "DETAIL_LEGS"])
    },
    {
        name: "Reconnaissance de Dette",
        category: "CIVIL",
        content: "<h1>Reconnaissance de Dette</h1><p>Je soussigné [DEBITEUR] reconnais devoir à [CREANCIER] la somme de [MONTANT]...</p>",
        variables: JSON.stringify(["DEBITEUR", "CREANCIER", "MONTANT", "ECHEANCE_REMBOURSEMENT"])
    },

    // === PROCEDURE & PENAL ===
    {
        name: "Assignation en Paiement",
        category: "PROCEDURE",
        content: "<h1>Assignation devant le Tribunal</h1><p>A la requête de [DEMANDEUR], assigne [DEFENDEUR] à comparaître...</p>",
        variables: JSON.stringify(["DEMANDEUR", "DEFENDEUR", "TRIBUNAL_COMPETENT", "DATE_AUDIENCE", "MONTANT_RECLAME"])
    },
    {
        name: "Plainte avec Constitution de Partie Civile",
        category: "PENAL",
        content: "<h1>Plainte avec CPC</h1><p>A Monsieur le Doyen des Juges d'Instruction. Plainte contre X ou [NOM_SUSPECT] pour [INFRACTION]...</p>",
        variables: JSON.stringify(["PLAIGNANT", "NOM_SUSPECT", "INFRACTION", "LIEU_FAITS", "DATE_FAITS"])
    },
    {
        name: "Mise en Demeure de Payer",
        category: "LITIGE",
        content: "<h1>Mise en Demeure</h1><p>Madame, Monsieur, Sauf erreur ou omission, nous n'avons pas reçu le paiement de la facture [NUMERO_FACTURE]...</p>",
        variables: JSON.stringify(["DESTINATAIRE", "NUMERO_FACTURE", "MONTANT_DU", "DELAI_PAIEMENT"])
    },
    {
        name: "Conclusions en Défense",
        category: "PROCEDURE",
        content: "<h1>Conclusions</h1><p>Pour : [DEFENDEUR] / Contre : [DEMANDEUR]. PLAISE AU TRIBUNAL...</p>",
        variables: JSON.stringify(["DEFENDEUR", "DEMANDEUR", "ARGUMENTS_FAIT", "ARGUMENTS_DROIT"])
    },

    // === ADMINISTRATIF ===
    {
        name: "Recours Gracieux (Administration)",
        category: "ADMINISTRATIF",
        content: "<h1>Recours Gracieux</h1><p>A l'attention de Monsieur le [AUTORITE]. Objet : Contestation de la décision du [DATE_DECISION]...</p>",
        variables: JSON.stringify(["AUTORITE", "DATE_DECISION", "ARGUMENTS", "DEMANDE"])
    },
    {
        name: "Réponse à Appel d'Offres (Lettre de Soumission)",
        category: "ADMINISTRATIF",
        content: "<h1>Lettre de Soumission</h1><p>Nous soussignés, [NOM_SOUISSIONNAIRE], après avoir pris connaissance du dossier d'appel d'offres...</p>",
        variables: JSON.stringify(["NOM_SOUISSIONNAIRE", "OBJET_MARCHE", "PRIX_OFFRE", "DELAI_EXECUTION"])
    },

    // === TECH & IP ===
    {
        name: "Contrat de Développement Logiciel",
        category: "TECH",
        content: "<h1>Contrat de Développement</h1><p>Entre [CLIENT] et [PRESTATAIRE]. Le Prestataire s'engage à développer la solution suivante...</p>",
        variables: JSON.stringify(["CLIENT", "PRESTATAIRE", "SPECIFICATIONS", "PRIX", "CALENDRIER", "PROPRIETE_INTEL"])
    },
    {
        name: "Conditions Générales de Vente (E-commerce)",
        category: "TECH",
        content: "<h1>CGV</h1><p>Les présentes conditions régissent les ventes par la société [NOM_SOCIETE] sur le site [URL_SITE]...</p>",
        variables: JSON.stringify(["NOM_SOCIETE", "URL_SITE", "CONTACT_SERVICE_CLIENT", "DROIT_APPLICABLE"])
    },
    {
        name: "Accord de Confidentialité (NDA)",
        category: "TECH",
        content: "<h1>Accord de Confidentialité</h1><p>Entre [PARTIE_A] et [PARTIE_B], qui s'apprêtent à échanger des informations confidentielles...</p>",
        variables: JSON.stringify(["PARTIE_A", "PARTIE_B", "OBJET_ECHANGE", "DUREE_CONFIDENTIALITE"])
    },

    // === INTERNATIONAL ===
    {
        name: "Contrat de Vente International (ICC)",
        category: "INTERNATIONAL",
        content: "<h1>International Sale Contract</h1><p>Between [SELLER] (Seller) and [BUYER] (Buyer). Goods: [GOODS_DESC]...</p>",
        variables: JSON.stringify(["SELLER", "BUYER", "GOODS_DESC", "INCOTERM", "PRICE", "ARBITRATION_CLAUSE"])
    }
]

async function main() {
    console.log(`Start seeding ${TEMPLATES.length} templates...`)

    for (const t of TEMPLATES) {
        // Check if exists to avoid duplicates (optional, based on name)
        const existing = await prisma.template.findFirst({
            where: { name: t.name }
        })

        if (!existing) {
            await prisma.template.create({
                data: t
            })
            console.log(`Created template: ${t.name}`)
        } else {
            console.log(`Skipped existing: ${t.name}`)
        }
    }

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
