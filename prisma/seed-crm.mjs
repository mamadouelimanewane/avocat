
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Prospects...')

    const prospects = [
        {
            name: "Entreprise BTP Construction",
            type: "ENTREPRISE",
            status: "PROSPECT",
            email: "contact@btp-sn.com",
            phone: "+221 77 111 22 33",
            address: "Dakar Plateau",
            country: "Senegal"
        },
        {
            name: "M. Ibrahima Diallo",
            type: "PARTICULIER",
            status: "PROSPECT",
            email: "ibou.diallo@email.com",
            phone: "+221 76 222 33 44",
            address: "Mermoz",
            country: "Senegal"
        }
    ]

    for (const p of prospects) {
        const exists = await prisma.client.findFirst({ where: { email: p.email } })
        if (!exists) {
            await prisma.client.create({ data: p })
            console.log(`Created prospect: ${p.name}`)
        }
    }
    console.log('Prospects seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
