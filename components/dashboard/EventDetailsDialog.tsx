
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, FileText, User, Info } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface EventDetailsDialogProps {
    event: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
    if (!event) return null

    const isAudience = event.type === "AUDIENCE"
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge
                            variant="outline"
                            className={isAudience ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}
                        >
                            {event.type}
                        </Badge>
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 border-b pb-4">
                        {event.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Date and Time */}
                    <div className="flex gap-4">
                        <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {format(startDate, "EEEE dd MMMM yyyy", { locale: fr })}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                        <div className="flex gap-4">
                            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Lieu / Salle</p>
                                <p className="text-sm text-slate-500">{event.location}</p>
                            </div>
                        </div>
                    )}

                    {/* Dossier */}
                    {event.dossier && (
                        <div className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Dossier Associé</p>
                                <p className="text-sm text-blue-600 font-medium">
                                    {event.dossier.reference} - {event.dossier.title}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="flex gap-4">
                            <div className="bg-amber-50 p-3 rounded-xl flex items-center justify-center">
                                <Info className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Détails / Notes</p>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                    "{event.description}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
