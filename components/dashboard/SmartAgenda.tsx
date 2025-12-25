
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { EventDetailsDialog } from './EventDetailsDialog'

export function SmartAgenda({ events }: { events: any[] }) {
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleEventClick = (event: any) => {
        setSelectedEvent(event)
        setIsDialogOpen(true)
    }

    return (
        <>
            <Card className="h-full border-none shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        Prochains RDV
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {events.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Aucun événement prévu (48h).</p>
                        ) : (
                            events.map((evt) => (
                                <div
                                    key={evt.id}
                                    onClick={() => handleEventClick(evt)}
                                    className={`rounded-lg p-3 border cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${evt.type === 'AUDIENCE'
                                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                        : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-semibold text-slate-800">{evt.title}</h4>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${evt.type === 'AUDIENCE'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {new Date(evt.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {evt.dossier && (
                                        <p className="text-xs text-slate-600 mb-1">{evt.dossier.title}</p>
                                    )}

                                    {evt.location && (
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin className="h-3 w-3" /> {evt.location}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <EventDetailsDialog
                event={selectedEvent}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    )
}
