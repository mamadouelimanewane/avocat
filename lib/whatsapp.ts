
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
    // 1. Log to console for audit trail
    console.log(`[WHATSAPP-OUTBOUND] To: ${payload.phone}`);
    console.log(`[WHATSAPP-OUTBOUND] Msg: ${payload.message}`);

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

    // Provision for Real API (Twilio/Meta)
    // The message is considered sent once logged in this version to allow flow testing.

    return { success: true, message: "WhatsApp envoyé avec succès." };
}

export function formatDeadlineWhatsAppMessage(lawyerName: string, dossierTitle: string, type: string, date: string, reason: string) {
    return `🚨 *ALERTE LEXAI* ⚖️ 
    
Maître *${lawyerName}*, une échéance critique a été détectée dans le dossier *${dossierTitle}*.

📌 *Type :* ${type}
📅 *Date :* ${date}
💬 *Détail :* ${reason}

Veuillez consulter votre interface pour plus de détails.`;
}

export function formatClientAccessWhatsAppMessage(clientName: string, accessCode: string, portalUrl: string) {
    return `🔐 *Votre Espace Client LEXAPP* ⚖️

Bonjour *${clientName}*,

Votre cabinet d'avocats a activé votre espace sécurisé.

📍 *Accès :* ${portalUrl}
🔑 *Code PIN :* ${accessCode}

Utilisez votre adresse email et ce code pour suivre vos dossiers, signer vos documents et régler vos factures en toute sécurité.

À bientôt !`;
}
