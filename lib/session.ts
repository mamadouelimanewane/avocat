import crypto from 'crypto'

const SESSION_SECRET = process.env.SESSION_SECRET || 'AVOCAT-SECURE-KEY-2026-CHANGE-IMMEDIATELY'

export function signSessionToken(userId: string): string {
    try {
        const signature = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex')
        return `${userId}.${signature}`
    } catch (e) {
        console.error("Token signing error:", e)
        return userId // Fallback to plain for safety if crypto fails (temporary)
    }
}

export function verifySessionToken(token: string | undefined): string | null {
    if (!token) return null

    try {
        const parts = token.split('.')
        if (parts.length !== 2) {
            // Check if it's a legacy plain ID (for transition)
            return token.length > 20 ? null : token
        }

        const [userId, signature] = parts
        const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex')

        // Use hex encoding to match the digest output
        const sigBuffer = Buffer.from(signature, 'hex')
        const expectedBuffer = Buffer.from(expectedSignature, 'hex')

        if (sigBuffer.length !== expectedBuffer.length) {
            return null
        }

        if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
            return null
        }

        return userId
    } catch (error) {
        console.error("Session verification error:", error)
        return null
    }
}
