
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Mise à jour des Audiences (A venir et Passées) ---')

    // 1. Get a client and some dossiers
    const client = await prisma.client.findFirst()
    const dossiers = await prisma.dossier.findMany({ take: 3 })

    if (dossiers.length < 1) {
        console.log("Erreur: Aucun dossier trouvé. Veuillez d'abord créer des dossiers.")
        return
    }

    const today = new Date()

    // 2. Prepare Audiences
    const audiences = [
        // A venir
        {
            title: 'Audience de Mise en État',
            startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // + 2 jours
            endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 3600000),
            type: 'AUDIENCE',
            location: 'TGI Dakar - Salle 4',
            dossierId: dossiers[0].id,
            description: 'Communication de pièces.'
        },
        {
            title: 'Plaidoiries sur le fond',
            startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // + 3 jours
            endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 7200000),
            type: 'AUDIENCE',
            location: 'Tribunal d\'Instance de Pikine',
            dossierId: dossiers[1]?.id || dossiers[0].id,
            description: 'Dernière audience avant délibéré.'
        },
        // Passées (Historique)
        {
            title: 'Audience de Référé',
            startDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000), // - 15 jours
            endDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000 + 3600000),
            type: 'AUDIENCE',
            location: 'TGI Dakar',
            dossierId: dossiers[0].id,
            description: 'RÉSULTAT : Renvoyé au 15/12 pour production de pièces supplémentaires.'
        },
        {
            title: 'Audience de flagrants délits',
            startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // - 30 jours
            endDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000 + 7200000),
            type: 'AUDIENCE',
            location: 'Tribunal de Dakar',
            dossierId: dossiers[2]?.id || dossiers[0].id,
            description: 'RÉSULTAT : Condamnation à 6 mois ferme prononcée par le juge.'
        }
    ]

    for (const a of audiences) {
        const { dossierId, ...eventData } = a

        // Pour éviter l'erreur sur dossierId, on utilise la syntaxe standard "dossier: { connect: { id: ... } }"
        const exists = await prisma.event.findFirst({
            where: {
                title: a.title,
                startDate: a.startDate
            }
        })

        if (!exists) {
            await prisma.event.create({
                data: {
                    ...eventData,
                    dossier: { connect: { id: dossierId } }
                }
            })
        }
    }

    console.log('✅ Les audiences à venir et l\'historique ont été injectés avec succès.')
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
