
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Démarrage de l\'injection des données de démo PRO...')

    // 2. Création de Prospects (CRM)
    console.log('Creating Prospects...')
    const prospects = [
        {
            name: 'Société Générale de BTP',
            type: 'ENTREPRISE',
            email: 'contact@sgbtp.sn',
            phone: '77 654 32 10',
            status: 'NEGOTIATION',
            city: 'Dakar'
        },
        {
            name: 'Clinique des Mamelles',
            type: 'ENTREPRISE',
            email: 'direction@cliniquemamelles.com',
            phone: '33 820 00 00',
            status: 'PROSPECT',
            city: 'Dakar'
        },
        {
            name: 'M. Ibrahim Diallo (Immobilier)',
            type: 'PARTICULIER',
            email: 'ibou.diallo@gmail.com',
            phone: '70 123 45 67',
            status: 'TO_CONVERT',
            city: 'Saly'
        },
        {
            name: 'TechSolutions Senegal SA',
            type: 'ENTREPRISE',
            email: 'ceo@techsolutions.sn',
            phone: '78 987 65 43',
            status: 'NEGOTIATION',
            city: 'Diamniadio'
        },
        {
            name: 'Groupement des Maraîchers de Mboro',
            type: 'ORGANISATION',
            email: 'gmm@asso.sn',
            phone: '76 555 44 33',
            status: 'PROSPECT',
            city: 'Mboro'
        }
    ]

    for (const p of prospects) {
        // Check existence manually (email is not unique in schema so no upsert)
        const existing = await prisma.client.findFirst({
            where: { email: p.email }
        })

        if (!existing) {
            await prisma.client.create({
                data: {
                    name: p.name,
                    type: p.type,
                    email: p.email,
                    phone: p.phone,
                    status: p.status,
                    address: `${p.city}, Sénégal`,
                    city: p.city,
                    country: 'Sénégal',
                    accessCode: Math.floor(100000 + Math.random() * 900000).toString()
                }
            })
        }
    }

    // 3. Création de Clients Actifs & Dossiers
    console.log('Creating Active Clients & Dossiers...')

    // Client 1 : Banque
    let bankClient = await prisma.client.findFirst({ where: { email: 'juridique@banque-atlantique.sn' } })
    if (!bankClient) {
        bankClient = await prisma.client.create({
            data: {
                name: 'Banque Atlantique Sénégal',
                type: 'ENTREPRISE',
                email: 'juridique@banque-atlantique.sn',
                phone: '33 849 10 00',
                status: 'CLIENT',
                address: 'Plateau, Dakar',
                city: 'Dakar',
                country: 'Sénégal',
                accessCode: '882910'
            }
        })
    }

    // Check if dossier exists to avoid duplicates
    const existingDossier1 = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-042' } })
    if (!existingDossier1 && bankClient) {
        await prisma.dossier.create({
            data: {
                title: 'Recouvrement Créance - SOCIM SA',
                reference: 'DOS-2024-042',
                clientId: bankClient.id,
                status: 'CONTENTIEUX',
                opposingParty: 'SOCIM SA',
                opposingCounsel: 'Me Ndiaye'
            }
        })
    }

    // Client 2 : Particulier Divorce
    let divorceClient = await prisma.client.findFirst({ where: { email: 'a.fall@orange.sn' } })
    if (!divorceClient) {
        divorceClient = await prisma.client.create({
            data: {
                name: 'Mme Aminata Fall',
                type: 'PARTICULIER',
                email: 'a.fall@orange.sn',
                phone: '77 333 22 11',
                status: 'CLIENT',
                address: 'Mermoz, Dakar',
                city: 'Dakar',
                accessCode: '112233'
            }
        })
    }

    const existingDossier2 = await prisma.dossier.findFirst({ where: { reference: 'DOS-2024-015' } })
    if (!existingDossier2 && divorceClient) {
        await prisma.dossier.create({
            data: {
                title: 'Divorce Contentieux Fall c. Diop',
                reference: 'DOS-2024-015',
                clientId: divorceClient.id,
                status: 'INSTRUCTION',
                opposingParty: 'M. Oumar Diop',
                opposingCounsel: 'Me Sall'
            }
        })
    }

    console.log('✅ Injection terminée avec succès !')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
