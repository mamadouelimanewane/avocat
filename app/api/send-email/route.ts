import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const { to, subject, html } = await req.json()

        if (!process.env.RESEND_API_KEY) {
            // Fallback: Return mailto link if no API key configured
            return NextResponse.json({
                success: false,
                fallback: true,
                mailtoLink: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(html.replace(/<[^>]*>/g, ''))}`
            })
        }

        const data = await resend.emails.send({
            from: 'LexPremium Pro <onboarding@resend.dev>',
            to: [to],
            subject,
            html
        })

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Email send error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
