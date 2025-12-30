
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

export function deadlineAlertEmailTemplate(lawyerName: string, docName: string, deadlineType: string, deadlineDate: string, reason: string, dossierTitle: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #fff1f2; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(225,29,72,0.1); border-top: 6px solid #e11d48; }
            .header { padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; color: #e11d48; }
            .content { padding: 30px; }
            .alert-box { background: #fff1f2; border: 1px solid #fecdd3; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .alert-box h2 { margin: 0 0 10px 0; color: #9f1239; font-size: 18px; }
            .alert-box p { margin: 5px 0; color: #475569; }
            .btn { display: inline-block; background: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 ALERTE ÉCHÉANCE DÉTECTÉE</h1>
            </div>
            <div class="content">
                <p>Maître <strong>${lawyerName}</strong>,</p>
                <p>LexAI a détecté une échéance critique lors de l'analyse d'un nouveau document dans le dossier : <strong>${dossierTitle}</strong>.</p>
                
                <div class="alert-box">
                    <h2>${deadlineType} detected</h2>
                    <p>📅 <strong>Date : ${deadlineDate}</strong></p>
                    <p>📄 <strong>Document :</strong> ${docName}</p>
                    <p>💬 <strong>Détail :</strong> ${reason}</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="https://avocatos.app/dossiers" class="btn">Consulter le Dossier</a>
                </p>
            </div>
            <div class="footer">
                LexPremium Intelligence Artificielle<br>
                Service de surveillance automatique du cabinet.
            </div>
        </div>
    </body>
    </html>
    `
}

export function procedureStepEmailTemplate(lawyerName: string, dossierTitle: string, stepTitle: string, stepDescription: string, date: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1); border-top: 6px solid #4f46e5; }
            .header { background: #4f46e5; padding: 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 20px; }
            .content { padding: 30px; }
            .step-card { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #4f46e5; }
            .step-card h2 { margin: 0 0 10px 0; color: #1e293b; font-size: 18px; }
            .step-card p { margin: 5px 0; color: #475569; }
            .date-badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 12px; }
            .btn { display: inline-block; background: #4f46e5; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📝 Nouvelle Étape de Procédure</h1>
            </div>
            <div class="content">
                <p>Maître <strong>${lawyerName}</strong>,</p>
                <p>Une nouvelle étape a été planifiée pour le dossier : <strong>${dossierTitle}</strong>.</p>
                
                <div class="step-card">
                    <div class="date-badge">🗓️ Échéance : ${date}</div>
                    <h2 style="margin-top:15px;">${stepTitle}</h2>
                    <p>${stepDescription}</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="https://avocatos.app/dossiers" class="btn">Voir le Dossier</a>
                </p>
                
                <p style="font-size: 13px; color: #64748b; margin-top: 30px;">
                    Note : Cette étape a été suggérée par LexAI et validée par vous-même.
                </p>
            </div>
            <div class="footer">
                LexPremium - Gestion de Cabinet<br>
                Système de rappel automatisé.
            </div>
        </div>
    </body>
    </html>
    `
}

export function paymentReminderEmailTemplate(clientName: string, invoiceNumber: string, remainingAmount: number, dueDate: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #fef2f2; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1); border-top: 6px solid #dc2626; }
            .header { padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; color: #dc2626; }
            .content { padding: 30px; }
            .reminder-box { background: #fff1f2; border: 1px solid #fecdd3; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .reminder-box h2 { margin: 0 0 10px 0; color: #9f1239; font-size: 20px; }
            .reminder-box p { margin: 5px 0; color: #475569; }
            .amount { font-size: 28px; font-weight: bold; color: #dc2626; margin: 10px 0; }
            .btn { display: inline-block; background: #dc2626; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 RAPPEL DE PAIEMENT</h1>
            </div>
            <div class="content">
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Sauf erreur de notre part, le paiement de la facture suivante n'a pas encore été intégralement reçu par notre cabinet :</p>
                
                <div class="reminder-box">
                    <h2>Facture N° ${invoiceNumber}</h2>
                    <p>Échéance initiale : ${dueDate}</p>
                    <p>Solde restant à régler :</p>
                    <div class="amount">${remainingAmount.toLocaleString()} FCFA</div>
                </div>
                
                <p>Nous vous remercions de bien vouloir régulariser cette situation dans les meilleurs délais.</p>
                
                <p style="text-align: center;">
                    <a href="https://avocatos.app/portal/login" class="btn">Régler en ligne</a>
                </p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
                    Si votre règlement a été envoyé récemment, merci de ne pas tenir compte de ce rappel.
                </p>
            </div>
            <div class="footer">
                LexPremium - Cabinet d'Avocats<br>
                Service de recouvrement amiable.
            </div>
        </div>
    </body>
    </html>
    `
}

export function clientAccessEmailTemplate(clientName: string, accessCode: string, portalUrl: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1); border-top: 6px solid #0f172a; }
            .header { background: #0f172a; padding: 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 20px; }
            .content { padding: 30px; }
            .access-box { background: #f1f5f9; border-radius: 8px; padding: 25px; margin: 20px 0; border: 1px dashed #cbd5e1; text-align: center; }
            .pin-code { font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: 4px; margin: 15px 0; }
            .btn { display: inline-block; background: #0f172a; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Accès à votre Espace Client</h1>
            </div>
            <div class="content">
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Votre cabinet d'avocats a le plaisir de vous informer que votre espace client personnel est désormais activé.</p>
                
                <div class="access-box">
                    <p style="margin:0; font-size: 14px; color: #64748b;">Votre Code de Connexion Unique :</p>
                    <div class="pin-code">${accessCode}</div>
                    <p style="margin:0; font-size: 12px; color: #94a3b8;">Utilisez votre adresse email et ce code pour vous connecter.</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="${portalUrl}" class="btn">Accéder au Portail</a>
                </p>
                
                <p style="font-size: 13px; color: #64748b; margin-top: 30px;">
                    Cet espace vous permet de suivre vos dossiers, télécharger vos documents signés et régler vos factures en toute sécurité.
                </p>
            </div>
            <div class="footer">
                LexPremium - Solution de Gestion Juridique<br>
                Service sécurisé pour les clients du cabinet.
            </div>
        </div>
    </body>
    </html>
    `
}
