"use client"

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, MapPin, Briefcase } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getEvents, createEvent, deleteEvent, getDossiersList } from '@/app/actions'
import { useToast } from "@/components/ui/use-toast"
import { DeadlinePro } from '@/components/ai/DeadlinePro'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

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

export default function AgendaPage() {
    const { toast } = useToast()
    const [view, setView] = useState(Views.MONTH as any)
    const [date, setDate] = useState(new Date())
    const [events, setEvents] = useState<any[]>([])
    const [dossiers, setDossiers] = useState<any[]>([])

    // New Event Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        type: 'AUDIENCE',
        location: '',
        description: '',
        dossierId: ''
    })

    const fetchEvents = async () => {
        const start = subMonths(date, 3)
        const end = addMonths(date, 3)
        const res = await getEvents(start, end)
        if (res.success && res.events) {
            const formattedEvents = res.events.map((e: any) => ({
                id: e.id,
                title: e.title,
                start: new Date(e.startDate),
                end: new Date(e.endDate),
                allDay: false,
                resource: e
            }))
            setEvents(formattedEvents)
        }
    }

    const loadDossiers = async () => {
        const list = await getDossiersList()
        setDossiers(list)
    }

    useEffect(() => {
        fetchEvents()
        loadDossiers()
    }, [date, view])

    const handleCreate = async () => {
        if (!newEvent.title || !newEvent.date) {
            toast({ title: "Erreur", description: "Le titre et la date sont requis.", variant: "destructive" })
            return
        }

        const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}`)
        const endDateTime = new Date(`${newEvent.date}T${newEvent.endTime}`)

        const res = await createEvent({
            title: newEvent.title,
            startDate: startDateTime,
            endDate: endDateTime,
            type: newEvent.type,
            location: newEvent.location,
            description: newEvent.description,
            dossierId: newEvent.dossierId
        })

        if (res.success) {
            toast({ title: "Succès", description: "Événement créé avec succès." })
            setIsDialogOpen(false)
            fetchEvents()
            setNewEvent({
                title: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                startTime: '09:00',
                endTime: '10:00',
                type: 'AUDIENCE',
                location: '',
                description: '',
                dossierId: ''
            })
        } else {
            toast({ title: "Erreur", description: "Impossible de créer l'événement.", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            await deleteEvent(id)
            fetchEvents()
            toast({ title: "Supprimé", description: "L'événement a été supprimé." })
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
                <div className="flex items-center justify-between shrink-0 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda & Échéances</h1>
                        <p className="text-slate-500 mt-1">Gérez vos rendez-vous et surveillez vos délais procéduraux.</p>
                    </div>
                    <TabsList className="bg-slate-100 p-1">
                        <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
                        <TabsTrigger value="deadlines" className="flex items-center gap-2">
                            Surveillance Délais <Badge variant="secondary" className="bg-red-100 text-red-600 border-none px-1 h-4 text-[10px]">3</Badge>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="calendar" className="flex-1 flex flex-col space-y-4 outline-none data-[state=active]:flex">
                    <div className="flex items-center justify-end gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <a href="/api/calendar" download="lexpremium-agenda.ics" className="inline-flex items-center px-4 py-2 mr-2 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                📅 Exporter iCal
                            </a>
                            <DialogTrigger asChild>
                                <Button className="bg-slate-900 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Nouvel Événement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                                <DialogHeader>
                                    <DialogTitle>Ajouter un événement</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder="Ex: Audience Affaire X..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="date"
                                                value={newEvent.date}
                                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={newEvent.type}
                                                onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AUDIENCE">Audience</SelectItem>
                                                    <SelectItem value="RDV">Rendez-vous Client</SelectItem>
                                                    <SelectItem value="DEADLINE">Échéance / Délai</SelectItem>
                                                    <SelectItem value="AUTRE">Autre</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Début</Label>
                                            <Input
                                                type="time"
                                                value={newEvent.startTime}
                                                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Fin</Label>
                                            <Input
                                                type="time"
                                                value={newEvent.endTime}
                                                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Lier à un Dossier (Optionnel)</Label>
                                        <Select
                                            value={newEvent.dossierId}
                                            onValueChange={(v) => setNewEvent({ ...newEvent, dossierId: v })}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Sélectionner un dossier..." /></SelectTrigger>
                                            <SelectContent>
                                                {dossiers.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>
                                                        {d.reference} - {d.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Lieu</Label>
                                        <Input
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                            placeholder="Ex: Salle 4, Palais de Justice..."
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Description / Notes</Label>
                                        <Textarea
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreate}>Enregistrer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card className="flex-1 overflow-hidden flex flex-col">
                        <CardContent className="p-4 flex-1 h-[600px]">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%' }}
                                culture="fr"
                                messages={messages}
                                defaultView={Views.MONTH}
                                views={['month', 'week', 'day', 'agenda']}
                                onView={(newView) => setView(newView)}
                                onNavigate={(newDate) => setDate(newDate)}
                                date={date}
                                view={view}
                                onSelectEvent={(event) => {
                                    if (confirm(`Supprimer "${event.title}" ?`)) {
                                        handleDelete(event.id)
                                    }
                                }}
                                eventPropGetter={(event) => {
                                    let newStyle = {
                                        backgroundColor: "#0f172a",
                                        color: 'white',
                                        borderRadius: "4px",
                                        border: "none"
                                    };
                                    if (event.resource.type === 'AUDIENCE') {
                                        newStyle.backgroundColor = "#dc2626"
                                    } else if (event.resource.type === 'RDV') {
                                        newStyle.backgroundColor = "#2563eb"
                                    } else if (event.resource.type === 'DEADLINE') {
                                        newStyle.backgroundColor = "#d97706"
                                    }
                                    return { style: newStyle };
                                }}
                                components={{
                                    event: ({ event }) => (
                                        <div className="text-xs p-1">
                                            <div className="font-semibold">{event.title}</div>
                                            {event.resource.location && <div className="flex items-center gap-1 opacity-75"><MapPin size={10} /> {event.resource.location}</div>}
                                            {event.resource.dossier && <div className="flex items-center gap-1 opacity-75"><Briefcase size={10} /> {event.resource.dossier.reference}</div>}
                                        </div>
                                    )
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="deadlines" className="flex-1 outline-none">
                    <DeadlinePro />
                </TabsContent>
            </Tabs>
        </div>
    )
}
