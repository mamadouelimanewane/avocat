import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
    const roles = await prisma.role.findMany()
    console.log('--- ROLES ---')
    console.log(JSON.stringify(roles, null, 2))

    const users = await prisma.user.findMany({
        where: { name: { contains: 'Invité' } }
    })
    console.log('\n--- INVITE USERS ---')
    console.log(JSON.stringify(users, null, 2))

    await prisma.$disconnect()
}

check()
