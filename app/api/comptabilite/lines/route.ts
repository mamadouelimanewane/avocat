
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const nonLettered = searchParams.get('nonLettered') === 'true'

    if (!accountId) {
        return NextResponse.json({ error: 'accountId is required' }, { status: 400 })
    }

    const where: any = { accountId }
    if (nonLettered) {
        where.letter = null
    }

    try {
        const lines = await prisma.transactionLine.findMany({
            where,
            include: {
                transaction: true
            },
            orderBy: {
                transaction: { date: 'asc' }
            }
        })
        return NextResponse.json(lines)
    } catch (e) {
        return NextResponse.json({ error: 'Error fetching lines' }, { status: 500 })
    }
}
