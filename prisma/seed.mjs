
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clean DB
    try {
        await prisma.payment.deleteMany()
        await prisma.invoiceItem.deleteMany()
        await prisma.facture.deleteMany()
        await prisma.document.deleteMany()
        await prisma.event.deleteMany()
        await prisma.task.deleteMany()
        await prisma.timeEntry.deleteMany()
        await prisma.dossier.deleteMany()
        await prisma.client.deleteMany()
        await prisma.user.deleteMany()
    } catch (e) {
        console.log('Error cleaning DB (tables might not exist yet):', e)
    }

    // Create User
    const user = await prisma.user.create({
        data: {
            email: 'maitre@cabinet-avocat.com',
            name: 'Maître Dupont',
            role: 'ASSOCIE',
        },
    })

    // Create Clients
    const clientsData = [
        { type: 'ENTREPRISE', name: 'TechCorp SA', email: 'contact@techcorp.sn', phone: '+221 77 000 00 01', city: 'Dakar', address: 'Plateau, 15 avenue Roume' },
        { type: 'PARTICULIER', name: 'Moussa Diallo', email: 'moussa.diallo@email.com', phone: '+221 77 000 00 02', city: 'Dakar', address: 'Mermoz' },
        { type: 'ENTREPRISE', name: 'Banque Atlantique', email: 'juridique@banque.sn', phone: '+221 33 800 00 00', city: 'Dakar', address: 'Place de l\'Indépendance' },
        { type: 'PARTICULIER', name: 'Famille Ndiaye', email: null, phone: '+221 76 000 00 03', city: 'Saint-Louis', address: 'Nord' },
        { type: 'ENTREPRISE', name: 'Construction Experts', email: 'direction@const-ex.com', phone: '+221 70 100 00 00', city: 'Diamniadio', address: 'Zone Industrielle' },
    ]

    const clients = []
    for (const c of clientsData) {
        const client = await prisma.client.create({ data: c })
        clients.push(client)
    }

    // Create Dossiers
    const dossiersData = [
        { title: 'Audit Contrat TechCorp', reference: 'DOS-2024-001', status: 'CLOTURE', clientId: clients[0].id, description: 'Audit des contrats de travail.' },
        { title: 'Affaire Diallo c. Construction SA', reference: 'DOS-2024-002', status: 'OUVERT', clientId: clients[1].id, opposingParty: 'Construction SA', description: 'Litige licenciement abusif.' },
        { title: 'Recouvrement Créance BA', reference: 'DOS-2024-003', status: 'EN_ATTENTE', clientId: clients[2].id, opposingParty: 'Société X', description: 'Recouvrement de 50M FCFA.' },
        { title: 'Succession Famille Ndiaye', reference: 'DOS-2024-004', status: 'OUVERT', clientId: clients[3].id, description: 'Partage successoral immeuble Saint-Louis.' },
    ]

    for (const d of dossiersData) {
        await prisma.dossier.create({ data: d })
    }

    // Create Events
    await prisma.event.create({
        data: {
            title: 'Audience au Tribunal - Aff. Diallo',
            startDate: new Date(new Date().setHours(10, 0, 0, 0)),
            endDate: new Date(new Date().setHours(12, 0, 0, 0)),
            type: 'AUDIENCE',
            location: 'Tribunal de Grande Instance',
            dossierId: (await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-002' } }))?.id
        }
    })

    console.log('Seeding finished.')
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
