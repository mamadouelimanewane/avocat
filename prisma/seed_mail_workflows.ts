import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Seeding High-Level Workflows...\n')

    // 1. Workflow Courrier Entrant
    const inboundWorkflow = await prisma.mailWorkflow.upsert({
        where: { name: 'PROCÉDURE COURRIER ENTRANT' },
        update: {},
        create: {
            name: 'PROCÉDURE COURRIER ENTRANT',
            description: 'Gestion complète du courrier reçu, de la réception à la clôture.',
            category: 'INBOUND',
            steps: {
                create: [
                    { label: 'RÉCEPTION', order: 1, color: 'blue', description: 'Le courrier a été reçu et numérisé.' },
                    { label: 'ATTRIBUTION', order: 2, color: 'indigo', description: 'Désignation de l\'avocat responsable.', requiredRole: 'ADMIN' },
                    { label: 'ANALYSE JURIDIQUE', order: 3, color: 'purple', description: 'Étude du contenu et des pièces jointes.' },
                    { label: 'RÉDACTION RÉPONSE', order: 4, color: 'amber', description: 'Préparation du projet de réponse.' },
                    { label: 'VALIDATION ASSOCIÉ', order: 5, color: 'rose', description: 'Revue finale par l\'associé responsable.', requiredRole: 'ASSOCIE' },
                    { label: 'CLÔTURÉ', order: 6, color: 'emerald', description: 'Action terminée et archivée.' },
                ]
            }
        }
    })
    console.log('✅ Workflow Entrant créé')

    // 2. Workflow Courrier Sortant
    const outboundWorkflow = await prisma.mailWorkflow.upsert({
        where: { name: 'PROCÉDURE COURRIER SORTANT' },
        update: {},
        create: {
            name: 'PROCÉDURE COURRIER SORTANT',
            description: 'Validation en cascade des courriers émis par le cabinet.',
            category: 'OUTBOUND',
            steps: {
                create: [
                    { label: 'BROUILLON', order: 1, color: 'slate', description: 'Rédaction initiale du courrier.' },
                    { label: 'REVUE COLLABORATEUR', order: 2, color: 'sky', description: 'Vérification par un confrère.' },
                    { label: 'APPROBATION FINALE', order: 3, color: 'orange', description: 'Validation avant signature.' },
                    { label: 'SIGNATURE & ENVOI', order: 4, color: 'emerald', description: 'Signature électronique et expédition.' },
                ]
            }
        }
    })
    console.log('✅ Workflow Sortant créé')

    // 3. Create a test mail
    const client = await prisma.client.findFirst()
    const dossier = await prisma.dossier.findFirst()
    const user = await prisma.user.findFirst()

    if (client && user) {
        const firstStep = await prisma.mailStep.findFirst({
            where: { workflowId: inboundWorkflow.id, order: 1 }
        })

        await prisma.mail.create({
            data: {
                reference: 'COUR-2026-001',
                subject: 'Notification de Mise en Demeure - Affaire Fall',
                sender: 'Me Diagne, Cabinet Malick',
                type: 'INBOUND',
                category: 'JUDICIAIRE',
                status: 'NOUVEAU',
                priority: 'HAUTE',
                clientId: client.id,
                dossierId: dossier?.id,
                workflowId: inboundWorkflow.id,
                currentStepId: firstStep?.id,
                activities: {
                    create: {
                        action: 'RECEPTION',
                        userId: user.id,
                        comment: 'Courrier reçu par porteur ce matin.'
                    }
                }
            }
        })
        console.log('✅ Courrier de test créé')
    }

    console.log('\n✨ Seeding terminé avec succès !')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
