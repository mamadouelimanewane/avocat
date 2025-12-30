import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting migration to dynamic roles...')

    const defaultRoles = [
        { name: 'ADMIN', description: 'Administrateur avec accès complet' },
        { name: 'AVOCAT', description: 'Avocat du cabinet' },
        { name: 'COLLABORATEUR', description: 'Collaborateur externe ou interne' },
        { name: 'SECRETAIRE', description: 'Secrétariat et accueil' },
        { name: 'STAGIAIRE', description: 'Stagiaire en droit' },
        { name: 'JURISTE', description: 'Juriste conseil' },
    ]

    for (const roleData of defaultRoles) {
        await prisma.role.upsert({
            where: { name: roleData.name },
            update: { description: roleData.description },
            create: {
                name: roleData.name,
                description: roleData.description,
                permissions: '[]'
            },
        })
    }

    const allRoles = await prisma.role.findMany()
    const users = await prisma.user.findMany()

    for (const user of users) {
        const matchingRole = allRoles.find(r => r.name === user.role)
        if (matchingRole) {
            await prisma.user.update({
                where: { id: user.id },
                data: { roleId: matchingRole.id }
            })
            console.log(`Updated user ${user.email} with role ${matchingRole.name}`)
        }
    }

    console.log('Migration finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
