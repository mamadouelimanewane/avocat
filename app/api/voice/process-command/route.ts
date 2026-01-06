import { NextResponse } from 'next/server'
import { interpretVoiceCommand } from '@/lib/openai'

export async function POST(request: Request) {
    try {
        const { text } = await request.json()

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 })
        }

        const command = await interpretVoiceCommand(text)

        return NextResponse.json(command)
    } catch (error: any) {
        console.error('Voice Command Processing Error:', error)
        return NextResponse.json({ error: 'Failed to process command' }, { status: 500 })
    }
}
