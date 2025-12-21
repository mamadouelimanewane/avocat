
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding documents...')

    const dossiers = await prisma.dossier.findMany()
    if (dossiers.length === 0) {
        console.log('No dossiers found. Please run seed.mjs first.')
        return
    }

    const docTypes = [
        { name: 'Assignation en divorce.pdf', type: 'PDF', category: 'ACTE' },
        { name: 'Conclusions en réponse.docx', type: 'DOCX', category: 'ACTE' },
        { name: 'Contrat de Bail Commercial.pdf', type: 'PDF', category: 'ACTE' },
        { name: 'Facture Clinique.pdf', type: 'PDF', category: 'PREUVE' },
        { name: 'Echanges Email - Mai 2024.pdf', type: 'PDF', category: 'CORRESPONDANCE' },
        { name: 'Relevé Bancaire - Juin.pdf', type: 'PDF', category: 'PREUVE' },
        { name: 'Statuts de la Société.pdf', type: 'PDF', category: 'ADMINISTRATIF' },
        { name: 'K-Bis Récent.pdf', type: 'PDF', category: 'ADMINISTRATIF' },
        { name: 'Mise en demeure.docx', type: 'DOCX', category: 'CORRESPONDANCE' },
        { name: 'Rapport d\'expertise.pdf', type: 'PDF', category: 'PREUVE' },
        { name: 'Protocole d\'accord transactionnel.docx', type: 'DOCX', category: 'ACTE' },
        { name: 'CNI Client.jpg', type: 'IMAGE', category: 'ADMINISTRATIF' },
    ]

    for (const dossier of dossiers) {
        // Add 2-4 random documents per dossier
        const count = Math.floor(Math.random() * 3) + 2

        for (let i = 0; i < count; i++) {
            const docTemplate = docTypes[Math.floor(Math.random() * docTypes.length)]

            const doc = await prisma.document.create({
                data: {
                    name: docTemplate.name,
                    type: docTemplate.type,
                    category: docTemplate.category,
                    status: 'DRAFT',
                    dossierId: dossier.id,
                    ocrContent: "Contenu simulé pour la recherche... " + docTemplate.name,
                    versions: {
                        create: {
                            version: 1,
                            size: Math.floor(Math.random() * 5000000) + 10000, // Random size
                            path: `/mock/uploads/${dossier.reference}/${docTemplate.name}`,
                            comment: 'Version initiale importée',
                            uploadedById: null // System
                        }
                    }
                }
            })
            console.log(`Created document ${doc.name} for dossier ${dossier.reference}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
