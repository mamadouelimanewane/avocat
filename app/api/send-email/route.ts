import { NextRequest, NextResponse } from 'next/server'

// Conditional import to avoid build errors when package is optional
let Resend: any = null
let resend: any = null

try {
    const resendModule = require('resend')
    Resend = resendModule.Resend
    if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY)
    }
} catch (e) {
    // Resend package not installed - fallback mode will be used
}

export async function POST(req: NextRequest) {
    try {
        const { to, subject, html } = await req.json()

        if (!resend || !process.env.RESEND_API_KEY) {
            // Fallback: Return mailto link if no API key configured or package not installed
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
