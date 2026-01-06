import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: Request) {
    if (!openai) {
        return NextResponse.json({ error: 'OpenAI client not initialized' }, { status: 500 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
        }

        // Whisper API call
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'whisper-1',
            language: 'fr',
        })

        return NextResponse.json({ text: transcription.text })
    } catch (error: any) {
        console.error('Whisper Transcription Error:', error)
        return NextResponse.json({ error: error.message || 'Transcription failed' }, { status: 500 })
    }
}
