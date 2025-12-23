
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- STARTING ACCOUNTING ERP SEED ---')

    // 1. Create Fiscal Year 2025
    const fiscalYearName = "2025"
    const existingYear = await prisma.fiscalYear.findUnique({ where: { name: fiscalYearName } })

    if (!existingYear) {
        await prisma.fiscalYear.create({
            data: {
                name: fiscalYearName,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                status: 'OPEN',
                isCurrent: true
            }
        })
        console.log(`✅ Fiscal Year ${fiscalYearName} created.`)
    } else {
        console.log(`ℹ️ Fiscal Year ${fiscalYearName} already exists.`)
    }

    // 2. Create Journals (SYSCOHADA Standard)
    const journals = [
        { code: "VE", name: "Journal des Ventes", type: "VENTE" },
        { code: "AC", name: "Journal des Achats", type: "ACHAT" },
        { code: "BQ", name: "Journal de Banque", type: "TRESORERIE" },
        { code: "CA", name: "Journal de Caisse", type: "TRESORERIE" },
        { code: "OD", name: "Opérations Diverses", type: "GENERAL" }
    ]

    for (const j of journals) {
        const exists = await prisma.journal.findUnique({ where: { code: j.code } })
        if (!exists) {
            await prisma.journal.create({ data: j })
            console.log(`✅ Journal ${j.name} (${j.code}) created.`)
        } else {
            console.log(`ℹ️ Journal ${j.code} already exists.`)
        }
    }

    console.log('--- ACCOUNTING ERP SEED COMPLETED ---')
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
