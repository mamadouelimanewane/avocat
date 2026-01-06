import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSignatureProof, generateDigitalSeal } from '@/lib/signature'
import { join } from 'path'
import { readFile } from 'fs/promises'

export async function POST(request: Request) {
    try {
        const { documentId, signatureDataUrl, signerId } = await request.json()

        if (!documentId || !signatureDataUrl) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // 1. Fetch Document
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { versions: { orderBy: { version: 'desc' }, take: 1 } }
        })

        if (!document || !document.versions[0]) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // 2. Mock Signer (In a real app, use auth session)
        const signer = { id: signerId || 'LEX-AVOCAT-001', name: 'Maître LexAI' }

        // 3. Generate Proof & Seal
        // In a real scenario, we would read the file buffer
        let fileBuffer = Buffer.from("mock-content")
        try {
            const absolutePath = join(process.cwd(), 'public', document.versions[0].path)
            fileBuffer = await readFile(absolutePath)
        } catch (e) {
            console.warn("Could not read physical file for sealing, using mock buffer")
        }

        const proof = createSignatureProof(documentId, signer)
        const seal = generateDigitalSeal(fileBuffer, signer.id)

        // 4. Update Database
        const updatedDoc = await prisma.document.update({
            where: { id: documentId },
            data: {
                status: 'SIGNED',
                signatureAt: new Date(),
                signatureHash: seal,
                signatureProof: JSON.stringify(proof),
                metadata: JSON.stringify({
                    signatureImage: signatureDataUrl.substring(0, 100) + '...' // Storage optimized
                })
            } as any
        })

        return NextResponse.json({ success: true, document: updatedDoc, proof })
    } catch (error: any) {
        console.error('Signature API Error:', error)
        return NextResponse.json({ error: 'Signature failed' }, { status: 500 })
    }
}
