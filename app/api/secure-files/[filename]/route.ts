import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { promises as fs } from 'fs'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get('auth_token')?.value
        const userId = verifySessionToken(token)

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const filename = params.filename

        // Security: Prevent path traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return new NextResponse('Invalid filename', { status: 400 })
        }

        // Check permissions (Optional: verify if user has access to this specific file in DB)
        // For now, we assume authenticated users (staff/clients) can access files they know the name of
        // To improve: Fetch document by filename -> check dossier -> check user permission
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { userRole: true } })

        // If client, restrict to own files? 
        // Logic: Find document version where path ends with filename
        // const docVersion = await prisma.documentVersion.findFirst({ where: { path: { endsWith: filename } }, include: { document: true } }) 
        // if (!docVersion) return 404...
        // if user.role !== 'ADMIN' && docVersion.document.dossier.clientId !== user.clientId ... return 403

        const filePath = join(process.cwd(), 'private', 'uploads', filename)

        try {
            await fs.access(filePath)
        } catch {
            return new NextResponse('File not found', { status: 404 })
        }

        const fileBuffer = await fs.readFile(filePath)
        const ext = filename.split('.').pop()?.toLowerCase()

        let contentType = 'application/octet-stream'
        if (ext === 'pdf') contentType = 'application/pdf'
        if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
        if (ext === 'png') contentType = 'image/png'
        if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`
            }
        })

    } catch (e) {
        console.error('File serve error:', e)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
