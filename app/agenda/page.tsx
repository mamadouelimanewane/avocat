"use client"

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

const locales = {
    'fr': fr,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const messages = {
    allDay: 'Journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette période.',
}

// Mock events for now, will replace with real data
const myEventsList = [
    {
        title: 'Audience TGI - Affaire Dupont',
        start: new Date(2025, 11, 10, 10, 0), // Dec 10, 2025 10:00 AM
        end: new Date(2025, 11, 10, 12, 0),
        allDay: false,
        resource: 'Salle 3'
    },
    {
        title: 'RDV Client - TechCorp',
        start: new Date(2025, 11, 12, 14, 0),
        end: new Date(2025, 11, 12, 15, 30),
        allDay: false,
    },
    {
        title: 'Clôture Dossier Diallo',
        start: new Date(2025, 11, 15),
        end: new Date(2025, 11, 15),
        allDay: true,
    }
]

export default function AgendaPage() {
    const [view, setView] = useState(Views.MONTH as any)
    const [date, setDate] = useState(new Date(2025, 11, 1))

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda</h1>
                    <p className="text-slate-500 mt-1">Gérez vos audiences et rendez-vous.</p>
                </div>
            </div>

            <Card className="h-[700px]">
                <CardContent className="p-4 h-full">
                    <Calendar
                        localizer={localizer}
                        events={myEventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        culture='fr'
                        messages={messages}
                        defaultView={Views.MONTH}
                        views={['month', 'week', 'day', 'agenda']}
                        onView={(newView) => setView(newView)}
                        onNavigate={(newDate) => setDate(newDate)}
                        date={date}
                        view={view}
                        eventPropGetter={(event) => {
                            let newStyle = {
                                backgroundColor: "#0f172a", // Slate 900
                                color: 'white',
                                borderRadius: "4px",
                                border: "none"
                            };

                            if (event.title.includes('Audience')) {
                                newStyle.backgroundColor = "#dc2626" // Red 600
                            } else if (event.title.includes('RDV')) {
                                newStyle.backgroundColor = "#2563eb" // Blue 600
                            }

                            return {
                                className: "",
                                style: newStyle
                            };
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
