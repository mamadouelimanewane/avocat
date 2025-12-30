import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const roleName = 'RESPONSABLE FINANCIER'
    const existing = await prisma.role.findUnique({ where: { name: roleName } })

    if (existing) {
        console.log('Role already exists:', roleName)
        return
    }

    const role = await prisma.role.create({
        data: {
            name: roleName,
            description: 'Gère l\'intégralité des finances, de la facturation et de la CARPA.',
            permissions: JSON.stringify(['VIEW_FINANCE', 'MANAGE_FINANCE', 'EXPORT_DATA'])
        }
    })
    console.log('Role created successfully:', role.name)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
