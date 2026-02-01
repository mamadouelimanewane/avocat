import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkClient() {
    console.log('🔍 Vérification du client dans la base de données...\n')

    const email = 'mamadouelimane@gmail.com'

    // Recherche par email
    const client = await prisma.client.findFirst({
        where: { email }
    })

    if (client) {
        console.log('✅ Client trouvé !')
        console.log('📧 Email:', client.email)
        console.log('👤 Nom:', client.name)
        console.log('🔑 Code d\'accès:', client.accessCode)
        console.log('📱 Téléphone:', client.phone)
        console.log('📍 Statut:', client.status)
        console.log('\n')

        // Test de connexion
        const testCode = '777000'
        console.log(`🧪 Test de connexion avec le code: ${testCode}`)

        const match = await prisma.client.findFirst({
            where: {
                email: { equals: email },
                accessCode: testCode
            }
        })

        if (match) {
            console.log('✅ CONNEXION RÉUSSIE ! Le code correspond.')
        } else {
            console.log('❌ ÉCHEC ! Le code ne correspond pas.')
            console.log(`   Code attendu: ${testCode}`)
            console.log(`   Code en base: ${client.accessCode}`)
        }
    } else {
        console.log('❌ Aucun client trouvé avec cet email')

        // Lister tous les clients
        const allClients = await prisma.client.findMany({
            select: { email: true, name: true, accessCode: true }
        })

        console.log('\n📋 Liste de tous les clients:')
        allClients.forEach(c => {
            console.log(`  - ${c.name} (${c.email}) - Code: ${c.accessCode}`)
        })
    }

    await prisma.$disconnect()
}

checkClient().catch(console.error)
