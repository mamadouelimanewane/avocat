
import lunr from 'lunr'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()
const INDEX_PATH = path.join(process.cwd(), 'public', 'search-index.json')

export async function rebuildSearchIndex() {
    console.log("Starting index rebuild...")

    // Fetch all searchable content
    const jurisprudence = await prisma.jurisprudence.findMany()
    const documents = await prisma.document.findMany({ include: { dossier: { include: { client: true } } } })

    const idx = lunr(function () {
        this.ref('id')
        this.field('title', { boost: 10 })
        this.field('content', { boost: 5 })
        this.field('reference')
        this.field('summary')
        this.field('keywords')
        this.field('type')

        // Add Jurisprudence
        jurisprudence.forEach(doc => {
            this.add({
                id: `JUR-${doc.id}`,
                title: doc.title,
                content: doc.content || "", // Real content indexation
                summary: doc.summary,
                reference: doc.reference,
                keywords: doc.keywords,
                type: 'JURISPRUDENCE'
            })
        })

        // Add GED Documents
        documents.forEach(doc => {
            this.add({
                id: `DOC-${doc.id}`,
                title: doc.name,
                content: doc.ocrContent || "",
                reference: doc.dossier.reference,
                summary: `Document dossier ${doc.dossier.title} client ${doc.dossier.client.name}`,
                type: 'DOCUMENT'
            })
        })
    })

    await fs.writeFile(INDEX_PATH, JSON.stringify(idx))
    console.log(`Index rebuilt for ${jurisprudence.length + documents.length} documents. Saved to ${INDEX_PATH}`)
    return idx
}

export async function searchIndex(query: string) {
    try {
        const data = await fs.readFile(INDEX_PATH, 'utf-8')
        const idx = lunr.Index.load(JSON.parse(data))

        const results = idx.search(query)

        // Map results back to DB IDs
        const jurisIds = results.filter(r => r.ref.startsWith('JUR-')).map(r => r.ref.replace('JUR-', ''))
        const docIds = results.filter(r => r.ref.startsWith('DOC-')).map(r => r.ref.replace('DOC-', ''))

        return {
            jurisprudenceIds: jurisIds,
            documentIds: docIds,
            total: results.length
        }
    } catch (e) {
        console.warn("Index not found or invalid, rebuilding...", e)
        await rebuildSearchIndex() // Fallback
        return { jurisprudenceIds: [], documentIds: [], total: 0 }
    }
}
