
import { PrismaClient } from '@prisma/client'
import { Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getDailyBriefing() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999))

    const [events, tasks] = await Promise.all([
        prisma.event.findMany({
            where: {
                startDate: {
                    gte: startOfDay,
                    lte: endOfTomorrow
                }
            },
            take: 3,
            orderBy: { startDate: 'asc' },
            include: { dossier: { select: { title: true, reference: true } } }
        }),
        prisma.task.findMany({
            where: {
                completed: false,
                dueDate: {
                    lte: endOfTomorrow // Tasks due today or tomorrow or overdue
                }
            },
            take: 3,
            orderBy: { dueDate: 'asc' },
            include: { dossier: { select: { reference: true } } }
        })
    ])

    return { events, tasks }
}

export async function DailyWidgets() {
    const { events, tasks } = await getDailyBriefing()

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Agenda Widget */}
            <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Agenda (48h)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Rien de prévu pour les prochaines 48h.</p>
                    ) : (
                        <div className="space-y-4">
                            {events.map(event => (
                                <div key={event.id} className="flex gap-3 items-start p-2 rounded hover:bg-accent transition-colors">
                                    <div className="flex-col flex items-center min-w-[3.5rem] text-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded p-1">
                                        <span className="text-sm font-bold uppercase">{new Date(event.startDate).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3)}</span>
                                        <span className="text-xl font-bold leading-none">{new Date(event.startDate).getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-base text-foreground">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            {event.dossier && <span className="ml-1">• {event.dossier.reference}</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link href="/agenda" className="text-xs text-blue-600 hover:underline mt-4 block">
                        Voir tout l'agenda &rarr;
                    </Link>
                </CardContent>
            </Card>

            {/* Priorities Widget */}
            <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Priorités & Tâches
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            Toutes les tâches urgentes sont terminées.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${task.priority === 'URGENT' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                        <span className={`text-base ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-400">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link href="/dossiers" className="text-xs text-amber-600 hover:underline mt-4 block">
                        Gérer les tâches &rarr;
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
