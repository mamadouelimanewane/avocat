
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Audiences...')

    // Get a dossier to attach to
    const dossier = await prisma.dossier.findFirst()
    if (!dossier) return console.log("No dossier found for audiences.")

    const audiences = [
        {
            title: "Plaidoirie sur le fond",
            dossierId: dossier.id,
            startDate: new Date(new Date().setDate(new Date().getDate() + 2)), // J+2
            endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
            type: "AUDIENCE",
            location: "Tribunal de Commerce, Salle 4",
            description: "Audience de plaidoirie. Préparer le dossier de plaidoirie."
        },
        {
            title: "Audience de Renvoi",
            dossierId: dossier.id,
            startDate: new Date(new Date().setDate(new Date().getDate() + 4)), // J+4
            endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
            type: "AUDIENCE",
            location: "TGI Dakar",
            description: "Renvoi pour comparution des parties."
        },
        {
            title: "Délibéré",
            dossierId: dossier.id,
            startDate: new Date(new Date().setDate(new Date().getDate() + 10)), // J+10
            endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            type: "AUDIENCE",
            location: "Cour Suprême",
            description: "Prononcé du jugement."
        }
    ]

    for (const aud of audiences) {
        await prisma.event.create({
            data: aud
        })
    }
    console.log('Audiences seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
