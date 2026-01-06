import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { documentId, boxCode, location, retentionYears = 10 } = await request.json()

        if (!documentId || !boxCode) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        // 1. Find or Create Box
        let box = await prisma.archiveBox.findUnique({
            where: { code: boxCode }
        })

        if (!box) {
            box = await prisma.archiveBox.create({
                data: {
                    code: boxCode,
                    location: location || 'DEPOT-PRINCIPAL',
                    status: 'ACTIVE',
                    retentionDate: new Date(new Date().setFullYear(new Date().getFullYear() + retentionYears))
                }
            })
        }

        // 2. Archive Document
        const updatedDoc = await prisma.document.update({
            where: { id: documentId },
            data: {
                status: 'ARCHIVED',
                archivedAt: new Date(),
                archiveBoxId: box.id,
                retention: retentionYears
            }
        })

        return NextResponse.json({ success: true, box, document: updatedDoc })
    } catch (error: any) {
        console.error('Archive API Error:', error)
        return NextResponse.json({ error: 'Archiving failed' }, { status: 500 })
    }
}
