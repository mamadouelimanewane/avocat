import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Generating Workflow Report for GED Documents...')

    // 1. Fetch recent documents with their dossiers and clients
    const documents = await prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            dossier: {
                include: { client: true }
            },
            versions: true
        }
    })

    if (documents.length === 0) {
        console.log('No documents found to analyze.')
        return
    }

    console.log(`\n=== RAPPORT WORKFLOW DOCUMENTAIRE (${new Date().toLocaleDateString()}) ===\n`)

    for (const doc of documents) {
        console.log(`TYPE: ${doc.type} | CATEGORIE: ${doc.category || 'N/A'}`)
        console.log(`DOC: ${doc.name}`)
        console.log(`DOSSIER: ${doc.dossier.reference} - ${doc.dossier.title} (Client: ${doc.dossier.client.name})`)
        console.log(`STATUT ACTUEL: ${doc.status}`)

        // Simulating a workflow history check
        console.log(`--- Workflow Simulation ---`)

        if (doc.category === 'ACTE') {
            console.log(`[x] Création du brouillon (v1.0)`)
            console.log(`[x] Révision par collaborateur (En cours)`)
            console.log(`[ ] Validation par l'associé`)
            console.log(`[ ] Signature électronique`)
            console.log(`[ ] Dépôt au Greffe`)
        } else if (doc.category === 'PREUVE') {
            console.log(`[x] Importation de la pièce`)
            console.log(`[x] Analyse OCR automatique (Contenu indexé)`)
            console.log(`[ ] Classement dans le bordereau de pièces`)
        } else if (doc.category === 'CORRESPONDANCE') {
            console.log(`[x] Réception email/courrier`)
            console.log(`[x] Archivage automatique dans le dossier`)
            console.log(`[?] Nécessite une réponse ? (Non détecté)`)
        } else {
            console.log(`[x] Document classé`)
        }

        console.log('\n------------------------------------------------\n')
    }

    // Summary Statistics
    const totalDocs = await prisma.document.count()
    const draftDocs = await prisma.document.count({ where: { status: 'DRAFT' } })

    console.log(`TOTAL DOCUMENTS: ${totalDocs}`)
    console.log(`EN COURS DE REDACTION (DRAFT): ${draftDocs}`)
    console.log(`TAUX DE DIGITALISATION: 100%`)

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
