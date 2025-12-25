
/**
 * LEGAL PATROL AGENT 👮‍♂️⚖️
 * 
 * Cet agent autonome parcourt une liste de sites juridiques "Graines" (Seeds).
 * Il utilise DeepSeek pour identifier de nouveaux textes (Lois, Codes, Jurisprudence).
 * Il les extrait, les structure et les place en file d'attente pour validation humaine.
 * 
 * Usage: npx tsx scripts/legal-patrol.ts
 */

import { PrismaClient } from '@prisma/client'
import { discoverLinks, processUrl } from '../lib/crawler' // Framework agnostic import
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

// LISTE DES "GRAINES" À SURVEILLER (Sites à fort potentiel juridique)
const SEED_URLS = [
    { url: "https://www.sec.gouv.sn/lois-et-reglements", region: "SENEGAL", type: "LOIS" },
    { url: "https://www.ohada.com/actes-uniformes/", region: "OHADA", type: "ACTES" },
    { url: "https://coursupreme.gouv.sn/arrets/", region: "SENEGAL", type: "JURISPRUDENCE" },
    // Ajouter d'autres sites ici (Barreau, Journal Officiel...)
]

async function runPatrol() {
    console.log("👮‍♂️ LEGAL PATROL: Démarrage de la ronde...")

    let totalFound = 0
    let totalImported = 0

    for (const seed of SEED_URLS) {
        console.log(`\n🔍 Scanning Hub: ${seed.url} (${seed.region})...`)

        // 1. SCANNER LE HUB (DeepSeek Scout)
        const scanResult = await discoverLinks(seed.url)

        if (!scanResult.success || !scanResult.links) {
            console.log(`   ❌ Échec du scan pour ${seed.url}`)
            continue
        }

        const candidates = scanResult.links
        console.log(`   👉 ${candidates.length} liens candidats trouvés.`)

        // 2. FILTRER ET IMPORTER LES NOUVEAUX
        for (const candidate of candidates) {
            // Check if URL already exists in DB (SourceUrl)
            const exists = await prisma.jurisprudence.findFirst({
                where: { sourceUrl: candidate.href }
            })

            if (exists) {
                console.log(`      ⏭️ Déjà connu: ${candidate.text.substring(0, 30)}...`)
                continue
            }

            console.log(`      📥 Importation et Analyse IA: ${candidate.text}...`)

            // 3. CRAWL & STRUCTURE (DeepSeek Cleaner)
            const crawlResult = await processUrl(candidate.href, seed.region)

            if (crawlResult.success) {
                console.log(`         ✅ Succès! Mis en file d'attente.`)
                totalImported++
            } else {
                console.log(`         ⚠️ Échec crawl.`)
            }

            // Be nice to servers
            await new Promise(r => setTimeout(r, 2000))
        }

        totalFound += candidates.length
    }

    console.log("\n========================================")
    console.log(`🏁 RAPPORT DE PATROUILLE`)
    console.log(`- Sites scannés: ${SEED_URLS.length}`)
    console.log(`- Liens candidats: ${totalFound}`)
    console.log(`- Nouveaux documents importés: ${totalImported}`)
    console.log("========================================")
}

// Execution Self-Contained
runPatrol()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
