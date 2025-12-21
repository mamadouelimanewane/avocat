
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Directory...')

    const contacts = [
        { name: "Maître Amadou Sall (Huissier)", category: "HUISSIER", speciality: "Recouvrement Rapide", phone: "77 000 00 01", city: "Dakar", notes: "Très efficace pour les constats urgents." },
        { name: "Étude Notariale Ndiaye", category: "NOTAIRE", speciality: "Immobilier", phone: "33 800 00 00", city: "Plateau", notes: "Partenaire historique du cabinet." },
        { name: "Cabinet Expert Diop (Chiffres)", category: "EXPERT", speciality: "Expertise Comptable", phone: "77 123 45 67", city: "Mermoz" },
        { name: "Greffe du Tribunal de Commerce", category: "GREFFE", speciality: "Enrôlement", phone: "33 889 00 99", city: "Dakar", notes: "Ouvre à 8h00 pile." },
        { name: "Maître Jean Gomis (Confrère)", category: "AVOCAT", speciality: "Droit Pénal", phone: "77 555 66 77", city: "Saint-Louis" },
        { name: "Cour Suprême du Sénégal", category: "JURIDICTION", speciality: "Cassation", phone: "33 823 44 55", city: "Dakar" },
    ]

    for (const c of contacts) {
        await prisma.directoryContact.create({ data: c })
    }
    console.log('Directory seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
