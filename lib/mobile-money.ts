// Mobile Money Payment Integration for Senegal
// Supports: Orange Money, Wave, Free Money

export type MobileMoneyProvider = 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY'

export interface MobileMoneyPayment {
    provider: MobileMoneyProvider
    phoneNumber: string
    amount: number
    currency: string
    reference: string
    factureId?: string
}

export interface PaymentResult {
    success: boolean
    transactionId?: string
    message: string
    status: 'PENDING' | 'SUCCESS' | 'FAILED'
}

/**
 * Initialize Orange Money payment
 * Official API: https://developer.orange.com/apis/orange-money-senegal/
 */
export async function initiateOrangeMoneyPayment(
    payment: MobileMoneyPayment
): Promise<PaymentResult> {
    try {
        // In production, use Orange Money API
        const apiKey = process.env.ORANGE_MONEY_API_KEY
        const merchantId = process.env.ORANGE_MONEY_MERCHANT_ID

        if (!apiKey || !merchantId) {
            // SIMULATION MODE for development
            console.log('[ORANGE MONEY SIMULATION]', payment)

            // Simulate 3-second processing
            await new Promise(resolve => setTimeout(resolve, 3000))

            return {
                success: true,
                transactionId: `OM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: `Paiement Orange Money de ${payment.amount} ${payment.currency} initié. Le client recevra une notification #144# pour confirmer.`,
                status: 'PENDING'
            }
        }

        // Production API call (implement when credentials available)
        const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                merchant_key: merchantId,
                currency: payment.currency,
                order_id: payment.reference,
                amount: payment.amount,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/callback`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/cancel`,
                notif_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
                lang: 'fr',
                reference: payment.reference
            })
        })

        const data = await response.json()

        return {
            success: response.ok,
            transactionId: data.payment_token,
            message: data.payment_url ? 'Redirection vers Orange Money' : 'Erreur de paiement',
            status: 'PENDING'
        }

    } catch (error) {
        console.error('[Orange Money Error]', error)
        return {
            success: false,
            message: `Erreur Orange Money: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            status: 'FAILED'
        }
    }
}

/**
 * Initialize Wave payment
 * Official API: https://developer.wave.com/
 */
export async function initiateWavePayment(
    payment: MobileMoneyPayment
): Promise<PaymentResult> {
    try {
        const apiKey = process.env.WAVE_API_KEY

        if (!apiKey) {
            // SIMULATION MODE
            console.log('[WAVE SIMULATION]', payment)

            await new Promise(resolve => setTimeout(resolve, 2500))

            return {
                success: true,
                transactionId: `WAVE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: `Paiement Wave de ${payment.amount} ${payment.currency} initié. Notification envoyée au ${payment.phoneNumber}.`,
                status: 'PENDING'
            }
        }

        // Production Wave API call
        const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: payment.amount,
                currency: payment.currency,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/cancel`,
                error_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/payment/error`,
                client_reference: payment.reference
            })
        })

        const data = await response.json()

        return {
            success: response.ok,
            transactionId: data.id,
            message: data.wave_launch_url ? 'Redirection vers Wave' : 'Erreur de paiement',
            status: 'PENDING'
        }

    } catch (error) {
        console.error('[Wave Error]', error)
        return {
            success: false,
            message: `Erreur Wave: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            status: 'FAILED'
        }
    }
}

/**
 * Initialize Free Money payment (Senegal)
 */
export async function initiateFreeMoneyPayment(
    payment: MobileMoneyPayment
): Promise<PaymentResult> {
    try {
        // Free Money API (if available)
        console.log('[FREE MONEY SIMULATION]', payment)

        await new Promise(resolve => setTimeout(resolve, 2000))

        return {
            success: true,
            transactionId: `FREE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: `Paiement Free Money de ${payment.amount} ${payment.currency} initié.`,
            status: 'PENDING'
        }

    } catch (error) {
        console.error('[Free Money Error]', error)
        return {
            success: false,
            message: `Erreur Free Money: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            status: 'FAILED'
        }
    }
}

/**
 * Main payment router
 */
export async function processMobileMoneyPayment(
    payment: MobileMoneyPayment
): Promise<PaymentResult> {
    // Validate phone number (Senegal format)
    const phoneRegex = /^(?:\+221|00221|221)?[0-9]{9}$/
    if (!phoneRegex.test(payment.phoneNumber.replace(/\s/g, ''))) {
        return {
            success: false,
            message: 'Numéro de téléphone invalide. Format: +221 XX XXX XX XX',
            status: 'FAILED'
        }
    }

    // Validate amount
    if (payment.amount <= 0) {
        return {
            success: false,
            message: 'Montant invalide',
            status: 'FAILED'
        }
    }

    switch (payment.provider) {
        case 'ORANGE_MONEY':
            return initiateOrangeMoneyPayment(payment)

        case 'WAVE':
            return initiateWavePayment(payment)

        case 'FREE_MONEY':
            return initiateFreeMoneyPayment(payment)

        default:
            return {
                success: false,
                message: 'Opérateur non supporté',
                status: 'FAILED'
            }
    }
}

/**
 * Verify payment status (webhook callback)
 */
export async function verifyPaymentStatus(
    transactionId: string,
    provider: MobileMoneyProvider
): Promise<PaymentResult> {
    // In production, query the provider's API to get transaction status

    // SIMULATION: Random success/failure after delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const isSuccess = Math.random() > 0.1 // 90% success rate in simulation

    return {
        success: isSuccess,
        transactionId,
        message: isSuccess ? 'Paiement confirmé' : 'Paiement échoué ou annulé',
        status: isSuccess ? 'SUCCESS' : 'FAILED'
    }
}
