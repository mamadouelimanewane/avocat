
import { PrismaClient } from '@prisma/client'
import { extractSearchFilters } from '../lib/openai'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function testSmartSearch() {
    const query = "Je veux voir les arrêts de la CCJA sur la rupture de bail en 2024"
    console.log(`\n🔎 QUERY TEST: "${query}"`)

    // 1. NLP Extraction
    console.log("... Analyse IA en cours ...")
    const filters = await extractSearchFilters(query)
    console.log("🤖 IA FILTRES:", filters)

    // 2. DB Query Construction (Simulating smartSearchJurisprudence logic)
    const whereClause: any = { status: 'VALIDATED' }
    if (filters.type) whereClause.type = filters.type
    if (filters.region) whereClause.region = filters.region
    if (filters.year) {
        whereClause.date = {
            gte: new Date(`${filters.year}-01-01`),
            lt: new Date(`${filters.year + 1}-01-01`)
        }
    }
    // Note: keywords logic is complex, approximating here
    let searchTerms = filters.keywords
    if (Array.isArray(searchTerms)) searchTerms = searchTerms.join(' ')

    if (searchTerms) {
        whereClause.OR = [
            { title: { contains: searchTerms, mode: 'insensitive' } }, // SQLite is case insensitive by default for ASCII, but let's be sure
            { content: { contains: searchTerms, mode: 'insensitive' } }
        ]
    }

    // 3. Execution
    const results = await prisma.jurisprudence.findMany({
        where: whereClause,
        select: { title: true, reference: true, date: true }
    })

    console.log(`\n📚 RÉSULTATS DB (${results.length}):`)
    results.forEach(r => console.log(`   - [${r.reference}] ${r.title} (${r.date.toISOString().split('T')[0]})`))

    if (results.length > 0 && results[0].title.includes("028/2024")) {
        console.log("\n✅ SUCCESS: L'arrêt injecté a été retrouvé via la recherche NLP !")
    } else {
        console.log("\n❌ FAIL: L'arrêt n'a pas été retrouvé.")
    }
}

testSmartSearch()
    .then(async () => await prisma.$disconnect())
