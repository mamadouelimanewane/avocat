
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
    const users = await prisma.user.findMany()
    console.log('Users in DB:', JSON.stringify(users, null, 2))
}

check()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
