import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
    const hashedPassword = await bcrypt.hash('12345678', 10)

    // 1. Create User (Maitre Diang)
    const user = await prisma.user.upsert({
        where: { email: 'maitre.diang@lexpremium.sn' },
        update: {},
        create: {
            email: 'maitre.diang@lexpremium.sn',
            name: 'Maître Moussa Diang',
            password: hashedPassword,
            role: 'AVOCAT',
        },
    })

    // 2. Create Clients
    const client1 = await prisma.client.create({
        data: {
            name: 'Société Immobilière du Sénégal (SIS)',
            email: 'contact@sis-senegal.sn',
            phone: '+221 33 821 44 55',
            address: 'Avenue Cheikh Anta Diop, Dakar',
        },
    })

    const client2 = await prisma.client.create({
        data: {
            name: 'M. Amadou Sow',
            email: 'amadou.sow@gmail.com',
            phone: '+221 77 555 12 34',
            address: 'Nord Foire, Villa 12, Dakar',
        },
    })

    const clientTest = await prisma.client.create({
        data: {
            name: 'M. Mamadou Elimane Wane',
            email: 'mamadouelimane@gmail.com',
            phone: '+221 77 123 45 67',
            address: 'Mermoz, Dakar',
            accessCode: '777000',
        },
    })

    const dossierTest = await prisma.dossier.create({
        data: {
            title: 'Divorce Contentieux Fall c. Diop',
            reference: 'DOS-2024-015',
            status: 'EN_COURS',
            description: 'Divorce contentieux',
            clientId: clientTest.id,
            userId: user.id,
            documents: {
                create: {
                    name: 'Livret de Famille.pdf',
                    type: 'PIECE',
                    path: '/uploads/livret.pdf',
                    status: 'DRAFT',
                }
            },
            events: {
                create: {
                    title: 'Préparation Plaidoirie',
                    date: new Date(),
                    type: 'AUDIENCE'
                }
            }
        },
    })

    await prisma.facture.create({
        data: {
            number: 'PROV-2024-089',
            amount: 295000,
            status: 'ENVOYE',
            clientId: clientTest.id
        }
    })

    // 3. Create Dossiers
    const dossier1 = await prisma.dossier.create({
        data: {
            title: 'Contentieux Foncier SIS vs État',
            reference: 'SIS-2026-FONC',
            status: 'EN_COURS',
            description: 'Litige relatif à l\'expropriation d\'un terrain à Diamniadio.',
            clientId: client1.id,
            userId: user.id,
        },
    })

    const dossier2 = await prisma.dossier.create({
        data: {
            title: 'Action en recouvrement Sow vs BDE',
            reference: 'SOW-2026-REC',
            status: 'EN_COURS',
            description: 'Recouvrement de créances commerciales impayées.',
            clientId: client2.id,
            userId: user.id,
        },
    })

    // 4. Create Events (Audiences & Delays)
    await prisma.event.createMany({
        data: [
            {
                title: 'Audience de plaidoirie - SIS',
                date: new Date('2026-01-20T09:00:00Z'),
                type: 'AUDIENCE',
                description: 'Plaidoirie sur le fond au Tribunal de Grande Instance de Dakar.',
                dossierId: dossier1.id,
            },
            {
                title: 'Délai de dépôt des conclusions - Sow',
                date: new Date('2026-01-18T16:00:00Z'),
                type: 'DELAI',
                description: 'Dernier délai pour le dépôt des écritures en défense.',
                dossierId: dossier2.id,
            },
        ],
    })

    // 5. Create Factures
    await prisma.facture.createMany({
        data: [
            {
                number: 'FAC-2026-001',
                amount: 1500000,
                status: 'ENVOYE',
                clientId: client1.id,
                date: new Date('2026-01-10'),
            },
            {
                number: 'FAC-2026-002',
                amount: 500000,
                status: 'BROUILLON',
                clientId: client2.id,
                date: new Date('2026-01-15'),
            },
        ],
    })

    console.log('Demo data seeded successfully for LexPremium Lite.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
