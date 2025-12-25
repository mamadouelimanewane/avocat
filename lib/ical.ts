
/**
 * iCal Generator - Generate .ics files for calendar events
 * Compatible with Outlook, Google Calendar, Apple Calendar
 */

export interface ICalEvent {
    uid: string
    title: string
    description?: string
    location?: string
    startDate: Date
    endDate: Date
    organizer?: { name: string, email: string }
}

function formatICalDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function generateICalEvent(event: ICalEvent): string {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//LexPremium//Cabinet Avocats//FR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.uid}@lexpremium.app`,
        `DTSTAMP:${formatICalDate(new Date())}`,
        `DTSTART:${formatICalDate(event.startDate)}`,
        `DTEND:${formatICalDate(event.endDate)}`,
        `SUMMARY:${event.title}`,
    ]

    if (event.description) {
        lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`)
    }

    if (event.location) {
        lines.push(`LOCATION:${event.location}`)
    }

    if (event.organizer) {
        lines.push(`ORGANIZER;CN=${event.organizer.name}:mailto:${event.organizer.email}`)
    }

    lines.push('END:VEVENT', 'END:VCALENDAR')

    return lines.join('\r\n')
}

export function generateICalFeed(events: ICalEvent[]): string {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//LexPremium//Cabinet Avocats//FR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:LexPremium Agenda',
    ]

    for (const event of events) {
        lines.push(
            'BEGIN:VEVENT',
            `UID:${event.uid}@lexpremium.app`,
            `DTSTAMP:${formatICalDate(new Date())}`,
            `DTSTART:${formatICalDate(event.startDate)}`,
            `DTEND:${formatICalDate(event.endDate)}`,
            `SUMMARY:${event.title}`,
        )

        if (event.description) {
            lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`)
        }
        if (event.location) {
            lines.push(`LOCATION:${event.location}`)
        }

        lines.push('END:VEVENT')
    }

    lines.push('END:VCALENDAR')
    return lines.join('\r\n')
}
