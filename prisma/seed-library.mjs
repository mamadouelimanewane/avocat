
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Library (Lois, Actes, Jurisprudence)...')

    const data = [
        // --- ACTES UNIFORMES OHADA ---
        {
            type: "ACTE_UNIFORME",
            title: "Acte Uniforme portant Droit Commercial Général (AUDCG)",
            court: "OHADA",
            reference: "AUDCG-2010",
            date: new Date('2010-12-15'),
            summary: "Texte révisé encadrant le statut du commerçant, le registre du commerce (RCCM), le bail à usage professionnel et le fonds de commerce.",
            category: "COMMERCIAL",
            keywords: JSON.stringify(["commerçant", "rccm", "bail", "fonds de commerce"]),
            sourceUrl: "https://www.ohada.org/index.php/fr/actes-uniformes-sp-1786576829/droit-commercial-general"
        },
        {
            type: "ACTE_UNIFORME",
            title: "Acte Uniforme relatif au Droit des Sociétés Commerciales (AUSCGIE)",
            court: "OHADA",
            reference: "AUSCGIE-2014",
            date: new Date('2014-01-30'),
            summary: "Régit la constitution, le fonctionnement et la dissolution des sociétés commerciales (SA, SARL, SAS) dans l'espace OHADA.",
            category: "SOCIETES",
            keywords: JSON.stringify(["société", "sa", "sarl", "sas", "dirigeants"]),
            sourceUrl: "https://www.ohada.org"
        },
        {
            type: "ACTE_UNIFORME",
            title: "Acte Uniforme portant organisation des Procédures Simplifiées (AUPSRVE)",
            court: "OHADA",
            reference: "AUPSRVE-1998",
            date: new Date('1998-04-10'),
            summary: "Texte fondamental sur le recouvrement de créances (injonction de payer) et les voies d'exécution (saisies).",
            category: "PROCEDURE",
            keywords: JSON.stringify(["recouvrement", "saisie", "injonction de payer"]),
            sourceUrl: "https://www.ohada.org"
        },

        // --- LOIS NATIONALES (SENEGAL) ---
        {
            type: "LOI",
            title: "Code des Obligations Civiles et Commerciales (COCC)",
            court: "SENEGAL",
            reference: "LOI-63-62",
            date: new Date('1963-07-10'),
            summary: "Le texte de référence en matière contractuelle et de responsabilité civile au Sénégal.",
            category: "CIVIL",
            keywords: JSON.stringify(["contrat", "responsabilité", "obligation"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },
        {
            type: "LOI",
            title: "Code de la Famille",
            court: "SENEGAL",
            reference: "LOI-72-61",
            date: new Date('1972-06-12'),
            summary: "Régissant le mariage, la filiation, les successions et les libéralités.",
            category: "FAMILLE",
            keywords: JSON.stringify(["mariage", "divorce", "succession", "héritage"]),
            sourceUrl: "http://www.jo.gouv.sn"
        },

        // --- ARRETES / DECRETS ---
        {
            type: "ARRETE",
            title: "Arrêté portant fixation du barème des droits de greffe",
            court: "MINISTERE_JUSTICE",
            reference: "ARR-2023-001",
            date: new Date('2023-01-15'),
            summary: "Nouveau barème applicable devant les juridictions commerciales.",
            category: "ADMINISTRATIF",
            keywords: JSON.stringify(["greffe", "frais", "tarif"]),
            sourceUrl: ""
        }
    ]

    for (const item of data) {
        const exists = await prisma.jurisprudence.findFirst({ where: { reference: item.reference } })
        if (!exists) {
            await prisma.jurisprudence.create({ data: item })
            console.log(`Created: ${item.title}`)
        } else {
            // Update type if simplified previous seed didn't have it (though finding by reference might miss if reference changed, but assuming consistent)
            await prisma.jurisprudence.update({
                where: { id: exists.id },
                data: { type: item.type }
            })
            console.log(`Updated type for: ${item.title}`)
        }
    }

    // Also update existing Jurisprudence items to have type="JURISPRUDENCE" if not set? 
    // The schema default handles new ones. But old fields might be null? No, required with default.
    // We are good.

    console.log('Library seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
