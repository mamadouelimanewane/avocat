
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Internal Mail & Admin Files...')

    // 1. Ensure Internal Client "CABINET" exists
    let cabinet = await prisma.client.findFirst({ where: { name: "CABINET_INTERNE" } })
    if (!cabinet) {
        cabinet = await prisma.client.create({
            data: {
                name: "CABINET_INTERNE",
                type: "ENTREPRISE",
                address: "Siege Social",
                email: "contact@cabinet.com"
            }
        })
    }

    // 2. Ensure Admin Dossier exists
    let adminDossier = await prisma.dossier.findFirst({ where: { reference: "ADM-2024-001" } })
    if (!adminDossier) {
        adminDossier = await prisma.dossier.create({
            data: {
                title: "GESTION ADMINISTRATIVE 2024",
                reference: "ADM-2024-001",
                clientId: cabinet.id,
                status: "OUVERT",
                description: "Dossier regroupant toute la gestion administrative, RH et factures fournisseurs."
            }
        })
    }

    // 3. Seed Correspondence (Courrier Arrivée/Départ) as Logs or Documents? 
    // We'll use Documents with type 'CORRESPONDANCE' for the GED aspect.
    const mails = [
        {
            name: "Lettre Recommandée - Ordre des Avocats",
            category: "CORRESPONDANCE",
            type: "PDF",
            tags: JSON.stringify(["ARRIVEE", "ORDRE", "URGENT"]),
            status: "RECEIVED",
            dossierId: adminDossier.id,
            createdAt: new Date('2024-05-10')
        },
        {
            name: "Facture SENELEC - Mai 2024",
            category: "FACTURE_FOURNISSEUR",
            type: "PDF",
            tags: JSON.stringify(["ARRIVEE", "CHARGES", "A_PAYER"]),
            status: "RECEIVED",
            dossierId: adminDossier.id,
            createdAt: new Date('2024-05-12')
        },
        {
            name: "Courrier Départ - Réponse Barreau",
            category: "CORRESPONDANCE",
            type: "PDF",
            tags: JSON.stringify(["DEPART", "ORDRE"]),
            status: "SENT",
            dossierId: adminDossier.id,
            createdAt: new Date('2024-05-14')
        },
        {
            name: "Contrat de Travail - Secrétaire",
            category: "RH",
            type: "DOCX",
            tags: JSON.stringify(["RH", "CONTRAT"]),
            status: "SIGNED",
            dossierId: adminDossier.id,
            createdAt: new Date('2024-01-15')
        }
    ]

    for (const mail of mails) {
        await prisma.document.create({
            data: mail
        })
    }

    console.log('Internal GED Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
