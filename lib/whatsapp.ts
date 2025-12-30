
/**
 * Simulated WhatsApp Service for Legal Alerts
 * In production, you would use Twilio WhatsApp API or Infobip.
 */

export interface WhatsAppPayload {
    phone: string;
    message: string;
}

import { prisma } from '@/lib/prisma'

export async function sendWhatsApp(payload: WhatsAppPayload) {
    // 1. Log to console for development visibility
    console.log(`[WhatsApp Simulation] To: ${payload.phone}`);
    console.log(`[WhatsApp Simulation] Message: ${payload.message}`);

    // Persist to DB
    try {
        // Find client if possible
        const client = await prisma.client.findFirst({
            where: { phone: { contains: payload.phone.replace('+', '').substring(3) } } // Fuzzy match
        })

        await prisma.communicationLog.create({
            data: {
                type: 'WHATSAPP',
                direction: 'OUTBOUND',
                content: payload.message,
                clientId: client?.id,
                date: new Date()
            }
        })
    } catch (e) {
        console.error("Failed to log WhatsApp to DB", e)
    }

    // 2. Here you would add the real fetch call to your WhatsApp provider
    /*
    const res = await fetch('https://api.provider.com/whatsapp/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` },
        body: JSON.stringify({
            from: process.env.WHATSAPP_PHONE_NUMBER,
            to: payload.phone,
            text: payload.message
        })
    });
    */

    return { success: true, message: "WhatsApp envoyé avec succès (Simulé + Loggué)." };
}

export function formatDeadlineWhatsAppMessage(lawyerName: string, dossierTitle: string, type: string, date: string, reason: string) {
    return `🚨 *ALERTE LEXAI* ⚖️ 
    
Maître *${lawyerName}*, une échéance critique a été détectée dans le dossier *${dossierTitle}*.

📌 *Type :* ${type}
📅 *Date :* ${date}
💬 *Détail :* ${reason}

Veuillez consulter votre interface pour plus de détails.`;
}
