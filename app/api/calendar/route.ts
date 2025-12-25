
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateICalFeed, ICalEvent } from '@/lib/ical'

export async function GET(request: NextRequest) {
    try {
        // Optional: Add authentication/token check here for security
        // const token = request.nextUrl.searchParams.get('token')

        // Fetch upcoming events (Next 90 days)
        const now = new Date()
        const future = new Date(now)
        future.setDate(future.getDate() + 90)

        const events = await prisma.event.findMany({
            where: {
                startDate: { gte: now, lte: future }
            },
            include: { dossier: true },
            orderBy: { startDate: 'asc' }
        })

        // Transform to iCal format
        const icalEvents: ICalEvent[] = events.map(evt => ({
            uid: evt.id,
            title: `${evt.type === 'AUDIENCE' ? '⚖️' : '📅'} ${evt.title}`,
            description: evt.dossier ? `Dossier: ${evt.dossier.title} (${evt.dossier.reference})` : undefined,
            location: evt.location || undefined,
            startDate: new Date(evt.startDate),
            endDate: new Date(evt.endDate)
        }))

        const icalContent = generateICalFeed(icalEvents)

        // Return as downloadable .ics file
        return new NextResponse(icalContent, {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': 'attachment; filename="lexpremium-agenda.ics"'
            }
        })

    } catch (e) {
        console.error("Calendar Export Error:", e)
        return NextResponse.json({ error: "Erreur export calendrier" }, { status: 500 })
    }
}
