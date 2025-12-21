
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Check if columns exist
    const count = await prisma.kanbanColumn.count()
    if (count === 0) {
        await prisma.kanbanColumn.createMany({
            data: [
                { title: 'Prospect / Lead', order: 0, color: '#94a3b8' }, // Slate
                { title: 'Nouveau Dossier', order: 1, color: '#3b82f6' }, // Blue
                { title: 'Instruction en Cours', order: 2, color: '#eab308' }, // Yellow
                { title: 'En Attente Audience', order: 3, color: '#f97316' }, // Orange
                { title: 'En Délibéré', order: 4, color: '#8b5cf6' }, // Purple
                { title: 'Clôturé / Facturé', order: 5, color: '#10b981' }, // Emerald
                { title: 'Archivé', order: 6, color: '#64748b' } // Slate Dark
            ]
        })
        console.log("Kanban columns seeded.")
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
