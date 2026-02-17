import crypto from 'crypto'

const SESSION_SECRET = process.env.SESSION_SECRET || 'AVOCAT-SECURE-KEY-2026-CHANGE-IMMEDIATELY'

export function signSessionToken(userId: string): string {
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex')
    return `${userId}.${signature}`
}

export function verifySessionToken(token: string | undefined): string | null {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 2) return null // Reject legacy plain tokens

    const [userId, signature] = parts
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(userId).digest('hex')

    // Constant time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return null
    }

    return userId
}
