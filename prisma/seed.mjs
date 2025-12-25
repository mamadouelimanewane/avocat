
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clean DB
    try {
        await prisma.invoiceItem.deleteMany()
        await prisma.facture.deleteMany()
        await prisma.document.deleteMany()
        await prisma.event.deleteMany()
        await prisma.task.deleteMany()
        await prisma.dossier.deleteMany()
        await prisma.client.deleteMany()
        await prisma.user.deleteMany()
        await prisma.template.deleteMany()
        await prisma.account.deleteMany()
        await prisma.journal.deleteMany()
    } catch (e) {
        console.log('Error cleaning DB (tables might not exist yet):', e)
    }

    // 1. Create Users (Staff)
    const admin = await prisma.user.create({
        data: {
            email: 'admin@lexpremium.sn',
            name: 'Maître Principal',
            role: 'ADMIN',
            password: 'demo123', // In real app: hashed
            hourlyRate: 300.0,
            active: true
        }
    })

    const avocat = await prisma.user.create({
        data: {
            email: 'avocat@lexpremium.sn',
            name: 'Maître Diop',
            role: 'AVOCAT',
            password: 'demo123',
            hourlyRate: 200.0,
            active: true
        }
    })

    const assistant = await prisma.user.create({
        data: {
            email: 'assistant@lexpremium.sn',
            name: 'Assistant Ndiaye',
            role: 'ASSISTANT',
            password: 'demo123',
            hourlyRate: 0.0,
            active: true
        }
    })

    console.log('Users created')

    // 2. Create Clients
    const clientsData = [
        { type: 'ENTREPRISE', name: 'TechCorp SA', email: 'contact@techcorp.sn', phone: '+221 77 000 00 01', city: 'Dakar', address: 'Plateau, 15 avenue Roume' },
        { type: 'PARTICULIER', name: 'Moussa Diallo', email: 'client@exemple.com', phone: '+221 77 000 00 02', city: 'Dakar', address: 'Mermoz' }, // Demo login email
        { type: 'ENTREPRISE', name: 'Banque Atlantique', email: 'juridique@banque.sn', phone: '+221 33 800 00 00', city: 'Dakar', address: 'Place de l\'Indépendance' },
        { type: 'PARTICULIER', name: 'Famille Ndiaye', email: 'ndiaye@gmail.com', phone: '+221 76 000 00 03', city: 'Saint-Louis', address: 'Nord' },
        { type: 'ENTREPRISE', name: 'Immobilier Plus', email: 'direction@immo-plus.sn', phone: '+221 70 100 00 00', city: 'Saly', address: 'Route de la Plage' },
    ]

    const clients = []
    for (const c of clientsData) {
        const client = await prisma.client.create({ data: c })
        clients.push(client)
    }
    console.log('Clients created')

    // 3. Create Dossiers
    const dossiersData = [
        { title: 'Audit Contrat TechCorp', reference: 'DOS-2024-001', status: 'CLOTURE', clientId: clients[0].id, description: 'Audit complet des contrats de travail.' },
        { title: 'Affaire Diallo c. Construction SA', reference: 'DOS-2024-002', status: 'OUVERT', clientId: clients[1].id, opposingParty: 'Construction SA', description: 'Litige pour licenciement abusif.' },
        { title: 'Recouvrement Créance BA', reference: 'DOS-2024-003', status: 'EN_ATTENTE', clientId: clients[2].id, opposingParty: 'Société Import-Export', description: 'Recouvrement de 50M FCFA.' },
        { title: 'Succession Famille Ndiaye', reference: 'DOS-2024-004', status: 'OUVERT', clientId: clients[3].id, description: 'Partage successoral immeuble Saint-Louis.' },
        { title: 'Vente Villa Saly', reference: 'DOS-2024-005', status: 'EN_COURS', clientId: clients[4].id, description: 'Transaction immobilière villa R+1.' },
    ]

    const dossiers = []
    for (const d of dossiersData) {
        const dossier = await prisma.dossier.create({ data: d })
        dossiers.push(dossier)
    }
    console.log('Dossiers created')

    // 4. Create Events (Agenda)
    const today = new Date()
    await prisma.event.createMany({
        data: [
            {
                title: 'Audience TGI - Aff. Diallo',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
                type: 'AUDIENCE',
                location: 'Palais de Justice, Salle 3',
                dossierId: dossiers[1].id,
                description: 'Plaidoirie sur le fond.'
            },
            {
                title: 'RDV Signature TechCorp',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
                type: 'RDV',
                location: 'Cabinet',
                dossierId: dossiers[0].id,
                description: 'Signature de la convention.'
            },
            {
                title: 'Échéance Conclusions',
                startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0),
                endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0),
                type: 'DEADLINE',
                dossierId: dossiers[2].id,
                description: 'Dépôt des conclusions en défense.'
            }
        ]
    })
    console.log('Events created')

    // 5. Create Factures (Invoices)
    const f1 = await prisma.facture.create({
        data: {
            number: 'FACT-2024-001',
            status: 'PAYEE',
            amountHT: 500000,
            amountTVA: 90000,
            amountTTC: 590000,
            clientId: clients[0].id,
            dossierId: dossiers[0].id,
            dueDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            items: {
                create: [
                    { description: 'Honoraires Audit', quantity: 10, unitPrice: 50000, totalPrice: 500000 }
                ]
            }
        }
    })

    const f2 = await prisma.facture.create({
        data: {
            number: 'FACT-2024-002',
            status: 'EMISE', // Unpaid
            amountHT: 1200000,
            amountTVA: 216000,
            amountTTC: 1416000,
            clientId: clients[1].id,
            dossierId: dossiers[1].id,
            dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
            items: {
                create: [
                    { description: 'Provision sur honoraires', quantity: 1, unitPrice: 1000000, totalPrice: 1000000 },
                    { description: 'Frais de dossier', quantity: 1, unitPrice: 200000, totalPrice: 200000 }
                ]
            }
        }
    })
    console.log('Factures created')



    // 6. Create Templates
    await prisma.template.createMany({
        data: [
            { name: 'Lettre de Mise en Demeure', category: 'LETTRE', content: '<p>Objet : Mise en demeure de payer ...</p>' },
            { name: 'Contrat de Travail CDI', category: 'CONTRAT', content: '<p>Entre les soussignés ...</p>' },
            { name: 'Assignation en Paiement', category: 'ACTE', content: '<p>L\'an deux mille vingt-quatre ...</p>' }
        ]
    })
    console.log('Templates created')

    // 7. Create Knowledge Base (RAG Data)
    await prisma.jurisprudence.createMany({
        data: [
            {
                title: "Acte Uniforme portant Droit Commercial Général (AUDCG)",
                type: "LOI",
                court: "OHADA",
                date: new Date("2010-12-15"),
                reference: "AUDCG",
                summary: "Texte fondamental régissant le statut du commerçant, le registre du commerce et du crédit mobilier, et les contrats commerciaux.",
                content: "ARTICLE 1 : Tout commerçant, personne physique ou morale... ARTICLE 101 : Le bailleur est tenu de délivrer les locaux...",
                keywords: JSON.stringify(["bail", "commerçant", "rccm", "fonds de commerce"])
            },
            {
                title: "Arrêt N° 025/2018 CCJA - Validité Saisie-Attribution",
                type: "JURISPRUDENCE",
                court: "CCJA",
                date: new Date("2018-04-26"),
                reference: "J-2018-025",
                summary: "La CCJA précise que la signification du procès-verbal de saisie doit contenir les mentions obligatoires sous peine de nullité.",
                content: "LA COUR, ... Attendu qu'il résulte des pièces du dossier... que la saisie pratiquée ne mentionnait pas le décompte distinct des sommes...",
                keywords: JSON.stringify(["saisie", "nullité", "signification", "banque"])
            },
            {
                title: "Code des Obligations Civiles et Commerciales (Partie 1)",
                type: "LOI",
                court: "SENEGAL",
                date: new Date("1976-10-22"),
                reference: "COCC",
                summary: "Loi régissant les contrats et la responsabilité civile au Sénégal.",
                content: "ARTICLE 42 : Le contrat est la convention par laquelle une ou plusieurs personnes s'obligent...",
                keywords: JSON.stringify(["contrat", "responsabilité", "obligation", "faute"])
            }
        ]
    })
    console.log('Knowledge Base seeded')

    console.log('Seeding finished successfully.')
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
