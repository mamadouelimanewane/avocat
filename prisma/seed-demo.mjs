
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    console.log('Seeding Demo Data...')

    // On nettoie un peu pour avoir une démo propre (Optionnel mais recommandé pour les démos)
    // await prisma.client.deleteMany({ where: { email: { in: ['diagne.associates@example.sn', 'mariam.fall@example.sn'] } } })

    // 1. Clients
    const client1 = await prisma.client.create({
        data: {
            name: 'Société Diagne & Associés',
            email: 'diagne.associates@example.sn',
            phone: '+221 33 800 00 01',
            type: 'ENTREPRISE'
        }
    })

    const client2 = await prisma.client.create({
        data: {
            name: 'Mme Mariam Fall',
            email: 'mariam.fall@example.sn',
            phone: '+221 77 123 45 67',
            type: 'PARTICULIER'
        }
    })

    // 2. Dossiers "Wow"
    await prisma.dossier.create({
        data: {
            title: 'Contentieux Immobilier - Résidence Almadies',
            status: 'OUVERT',
            clientId: client1.id,
            description: 'Litige relatif à la construction d\'un complexe résidentiel de haut standing. Contestation de clauses contractuelles et retard de livraison.',
            jurisdiction: 'Tribunal de Grande Instance de Dakar',
            reference: '2024-CIV-089',
            procedureType: 'CIVIL',
            opposingParty: 'Promoteur Immobilier X'
        }
    })

    await prisma.dossier.create({
        data: {
            title: 'Fusion-Acquisition : Groupe Sunu & Teranga',
            status: 'OUVERT',
            clientId: client1.id,
            description: 'Accompagnement juridique pour la fusion de deux leaders de l\'agro-industrie. Audit des contrats et restructuration sociale.',
            jurisdiction: 'Cour d\'Appel - Chambre Commerciale',
            reference: '2025-COM-012',
            procedureType: 'COMMERCIAL',
            opposingParty: 'État du Sénégal (Observation)'
        }
    })

    await prisma.dossier.create({
        data: {
            title: 'Défense Pénale Affaires - Affaire Port Autonome',
            status: 'OUVERT',
            clientId: client2.id,
            description: 'Assistance dans le cadre d\'une enquête pour présomption de détournement de deniers publics. Expertise financière requise.',
            jurisdiction: 'Tribunal Criminel de Dakar',
            reference: '2025-PEN-002',
            procedureType: 'PENAL',
            opposingParty: 'Parquet de Dakar'
        }
    })

    console.log('Demo Data Seeded Successfully!')
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
