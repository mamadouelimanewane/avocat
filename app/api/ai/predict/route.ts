import { NextResponse } from 'next/server'
import { predictCaseOutcome } from '@/lib/ai-predictive'

export async function POST(request: Request) {
    try {
        const { dossierId } = await request.json()

        if (!dossierId) {
            return NextResponse.json({ error: 'Dossier ID is required' }, { status: 400 })
        }

        // Deep analysis via LexAI Predictive Engine
        const prediction = await predictCaseOutcome(dossierId)

        return NextResponse.json({ success: true, prediction })
    } catch (error: any) {
        console.error('Predictive AI Error:', error)
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }
}
