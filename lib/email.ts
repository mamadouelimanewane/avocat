
import { Resend } from 'resend'

// Initialize Resend client (API Key from .env)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Default sender (must be verified in Resend dashboard, or use onboarding@resend.dev for testing)
const FROM_EMAIL = process.env.FROM_EMAIL || 'LexPremium <onboarding@resend.dev>'

export interface EmailPayload {
    to: string | string[]
    subject: string
    html: string
    replyTo?: string
}

export async function sendEmail(payload: EmailPayload) {
    if (!resend) {
        console.warn("📧 Email service not configured (RESEND_API_KEY missing). Skipping email.")
        return { success: false, message: "Service email non configuré." }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            replyTo: payload.replyTo
        })

        if (error) {
            console.error("Resend Error:", error)
            return { success: false, message: error.message }
        }

        console.log("📧 Email sent:", data?.id)
        return { success: true, id: data?.id }
    } catch (e: any) {
        console.error("Email Exception:", e)
        return { success: false, message: e.message }
    }
}

// ============ EMAIL TEMPLATES ============

export function invoiceEmailTemplate(clientName: string, invoiceNumber: string, amount: number, dueDate: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .amount { font-size: 32px; font-weight: bold; color: #1e293b; text-align: center; margin: 20px 0; }
            .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .details p { margin: 8px 0; color: #475569; }
            .btn { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚖️ Nouvelle Facture</h1>
            </div>
            <div class="content">
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Une nouvelle facture a été émise par le Cabinet :</p>
                
                <div class="amount">${amount.toLocaleString()} FCFA</div>
                
                <div class="details">
                    <p><strong>Facture N°</strong> ${invoiceNumber}</p>
                    <p><strong>Date d'échéance :</strong> ${dueDate}</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="https://avocatos.app/portal/login" class="btn">Accéder à mon Espace Client</a>
                </p>
                
                <p>Merci de votre confiance.</p>
            </div>
            <div class="footer">
                LexPremium - Cabinet d'Avocats<br>
                Cet email a été envoyé automatiquement.
            </div>
        </div>
    </body>
    </html>
    `
}

export function appointmentEmailTemplate(clientName: string, eventTitle: string, eventDate: string, location?: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .event-card { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
            .event-card h2 { margin: 0 0 10px 0; color: #166534; }
            .event-card p { margin: 5px 0; color: #475569; }
            .btn { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📅 Rendez-vous Confirmé</h1>
            </div>
            <div class="content">
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Votre rendez-vous avec le Cabinet a été confirmé :</p>
                
                <div class="event-card">
                    <h2>${eventTitle}</h2>
                    <p>📆 <strong>${eventDate}</strong></p>
                    ${location ? `<p>📍 ${location}</p>` : ''}
                </div>
                
                <p style="text-align: center;">
                    <a href="https://avocatos.app/portal/login" class="btn">Mon Espace Client</a>
                </p>
                
                <p>À bientôt !</p>
            </div>
            <div class="footer">
                LexPremium - Cabinet d'Avocats
            </div>
        </div>
    </body>
    </html>
    `
}
