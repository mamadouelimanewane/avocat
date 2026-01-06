/**
 * LexAI Signature Service
 * Gère la validation et le scellement numérique des documents.
 */

import crypto from 'crypto'

export interface SignatureProof {
    documentId: string
    signerName: string
    signerId: string
    timestamp: string
    hash: string
    integrityKey: string
}

/**
 * Génère un sceau numérique unique pour un document basé sur son contenu (Buffer)
 */
export function generateDigitalSeal(documentBuffer: Buffer, signerId: string): string {
    const hash = crypto.createHash('sha256')
    hash.update(documentBuffer)
    hash.update(signerId)
    hash.update(process.env.APP_SECRET || 'LEX_PREMIUM_SECURE_TOKEN')
    return hash.digest('hex')
}

/**
 * Simule la vérification de l'intégrité d'un document signé
 */
export function verifySignatureIntegrity(documentBuffer: Buffer, storedSeal: string, signerId: string): boolean {
    const currentSeal = generateDigitalSeal(documentBuffer, signerId)
    return currentSeal === storedSeal
}

/**
 * Prépare les métadonnées de signature pour le stockage Prisma
 */
export function createSignatureProof(documentId: string, signer: any): SignatureProof {
    return {
        documentId,
        signerName: signer.name,
        signerId: signer.id,
        timestamp: new Date().toISOString(),
        hash: crypto.randomBytes(16).toString('hex'), // Simulation d'empreinte unique
        integrityKey: `LEXSIG-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    }
}
