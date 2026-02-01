import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verification du client portail...\n')

    const email = 'a.fall@orange.sn'
    const accessCode = '112233'

    // Verifier si le client existe
    let client = await prisma.client.findFirst({
        where: { email: email }
    })

    if (!client) {
        console.log('❌ Client non trouve. Creation...')

        client = await prisma.client.create({
            data: {
                name: 'Mme Aminata Fall',
                type: 'PARTICULIER',
                email: email,
                phone: '77 333 22 11',
                status: 'CLIENT',
                address: 'Mermoz, Dakar',
                city: 'Dakar',
                accessCode: accessCode
            }
        })

        console.log('✅ Client cree:', client.id)
    } else {
        console.log('✅ Client trouve:', client.id)

        // Mettre a jour le code d'acces si different
        if (client.accessCode !== accessCode) {
            client = await prisma.client.update({
                where: { id: client.id },
                data: { accessCode: accessCode }
            })
            console.log('✅ Code d\'acces mis a jour')
        }
    }

    // Verifier/creer un dossier pour ce client
    let dossier = await prisma.dossier.findFirst({
        where: {
            clientId: client.id,
            reference: 'DOS-2024-015'
        }
    })

    if (!dossier) {
        console.log('❌ Dossier non trouve. Creation...')

        dossier = await prisma.dossier.create({
            data: {
                title: 'Divorce Contentieux Fall c. Diop',
                reference: 'DOS-2024-015',
                clientId: client.id,
                status: 'INSTRUCTION',
                opposingParty: 'M. Oumar Diop',
                opposingCounsel: 'Me Sall',
                stage: 'MISE_EN_ETAT'
            }
        })

        console.log('✅ Dossier cree:', dossier.id)
    } else {
        console.log('✅ Dossier trouve:', dossier.id)
    }

    console.log('\n📊 Resume:')
    console.log('━'.repeat(50))
    console.log(`Email: ${client.email}`)
    console.log(`Code d'acces: ${client.accessCode}`)
    console.log(`Client ID: ${client.id}`)
    console.log(`Dossier: ${dossier.reference} - ${dossier.title}`)
    console.log('━'.repeat(50))
    console.log('\n✅ Le portail client devrait maintenant fonctionner!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
