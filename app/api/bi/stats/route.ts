import { NextResponse } from 'next/server'
import { getFinancialBIStats } from '@/lib/analytics-service'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const months = parseInt(searchParams.get('months') || '12')

        const stats = await getFinancialBIStats(months)

        return NextResponse.json(stats)
    } catch (error) {
        console.error('BI Stats Error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    }
}
