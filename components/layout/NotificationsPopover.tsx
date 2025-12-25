
"use client"

import {
    Bell,
    Check,
    Clock,
    FileText,
    User,
    Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
    {
        id: 1,
        title: "Nouvelle audience",
        description: "Affaire Diallo c/ Construction SA - Demain à 09:00",
        time: "Il y a 2 heures",
        icon: Bell,
        color: "text-red-500 bg-red-50",
        unread: true,
    },
    {
        id: 2,
        title: "Document signé",
        description: "Contrat de Travail - Me Wade a signé le document.",
        time: "Il y a 4 heures",
        icon: FileText,
        color: "text-emerald-500 bg-emerald-50",
        unread: true,
    },
    {
        id: 3,
        title: "Nouveau message",
        description: "Le client M. Sarr a envoyé une nouvelle pièce.",
        time: "Hier",
        icon: User,
        color: "text-blue-500 bg-blue-50",
        unread: false,
    },
    {
        id: 4,
        title: "Rappel tâche",
        description: "Finaliser les conclusions pour le dossier ABC.",
        time: "Hier",
        icon: Clock,
        color: "text-amber-500 bg-amber-50",
        unread: false,
    }
]

export function NotificationsPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-50">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-[10px] h-7">Tout marquer comme lu</Button>
                </div>
                <ScrollArea className="h-[350px]">
                    <div className="flex flex-col">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`flex gap-3 p-4 hover:bg-slate-50 transition-colors border-b last:border-0 cursor-pointer ${notif.unread ? "bg-indigo-50/30" : ""}`}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                                    <notif.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs font-semibold ${notif.unread ? "text-slate-900" : "text-slate-500"}`}>
                                            {notif.title}
                                        </p>
                                        {notif.unread && <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />}
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-tight">
                                        {notif.description}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {notif.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-indigo-600 font-medium">
                        Voir toutes les notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
