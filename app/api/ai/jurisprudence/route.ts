import { NextResponse } from 'next/server'
import { findSimilarCases } from '@/lib/ai-predictive'

export async function POST(request: Request) {
    try {
        const { query } = await request.json()

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
        }

        // Semantic search via LexAI RAG ++
        const results = await findSimilarCases(query)

        return NextResponse.json({ success: true, results })
    } catch (error: any) {
        console.error('Jurisprudence RAG Error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}
