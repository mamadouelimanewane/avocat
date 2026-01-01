
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
    console.log('🚀 Création du Dossier Client Sénégalais "Haut de Gamme"...')

    // 1. Création du Client (SCI Sénégalaise)
    const client = await prisma.client.create({
        data: {
            name: 'SCI Horizon Dakar',
            email: 'contact@horizon-dakar.sn',
            phone: '+221 33 821 45 90',
            type: 'ENTREPRISE',
            status: 'CLIENT',
            address: 'Immeuble Kébé, Avenue Cheikh Anta Diop, Dakar',
            city: 'Dakar',
            country: 'Sénégal',
            accountingCode: '411H001'
        }
    })

    // 2. Création du Dossier Stratégique
    const dossier = await prisma.dossier.create({
        data: {
            title: 'Expulsion & Démolition - Litige Foncier ZAC Mbao',
            reference: '2026/TF/MBAO-042',
            status: 'OUVERT',
            procedureType: 'CIVIL',
            jurisdiction: 'Tribunal de Grande Instance de Rufisque',
            clientId: client.id,
            description: 'Litige opposant la SCI Horizon Dakar à un collectif d\'occupants sans titre sur le Titre Foncier n°14.782/R. Procédure d\'expulsion et demande de démolition des constructions irrégulières.',
            opposingParty: 'Collectif des Habitants de Mbao-Extension',
            opposingCounsel: 'Maître Abdoulaye Seck',
            stage: 'PLAIDOIRIE',
            nextHearingDate: new Date('2026-02-15T09:00:00Z'),
        }
    })

    // 3. Ajout de Transactions Financières (Pour la démo "Wow")
    await prisma.carpaTransaction.create({
        data: {
            dossierId: dossier.id,
            amount: 2500000,
            type: 'DEPOT',
            description: 'Consignation de sûreté pour frais d\'exécution (Huissier)',
            reference: 'CHQ-BOA-00921',
            date: new Date()
        }
    })

    await prisma.expense.create({
        data: {
            dossierId: dossier.id,
            amount: 75000,
            description: 'Droits d\'enregistrement et timbres fiscaux',
            category: 'DEBOURS',
            status: 'TO_BILL',
            type: 'DEBOURS',
            date: new Date()
        }
    })

    // 4. Ajout d'Evénements dans l'Agenda
    await prisma.event.create({
        data: {
            title: 'Audience de Plaidoirie - TGI Rufisque (Affaire Horizon)',
            description: 'Dépôt des dernières conclusions et plaidoirie au fond.',
            startDate: new Date('2026-02-15T09:00:00Z'),
            endDate: new Date('2026-02-15T12:00:00Z'),
            type: 'AUDIENCE',
            dossierId: dossier.id
        }
    })

    console.log('✅ Dossier créé avec succès !')
    console.log('ID Dossier pour la GED :', dossier.id)
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
