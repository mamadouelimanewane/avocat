"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Clock,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Bell,
    ShieldAlert,
    Plus,
    Flame
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Deadline {
    id: string
    title: string
    dossierRef: string
    dueDate: string
    remainingDays: number
    priority: 'URGENT' | 'HIGH' | 'NORMAL'
    type: 'CONCLUSIONS' | 'PROCEDURE' | 'APPEL' | 'AUDIENCE'
}

export function DeadlinePro() {
    const [deadlines] = useState<Deadline[]>([
        {
            id: '1',
            title: 'Dépôt des conclusions en défense',
            dossierRef: 'DOS-2024-001',
            dueDate: '2024-12-30',
            remainingDays: 5,
            priority: 'URGENT',
            type: 'CONCLUSIONS'
        },
        {
            id: '2',
            title: 'Délai d\'appel - Jugement Tribunal de Grande Instance',
            dossierRef: 'DOS-2023-452',
            dueDate: '2025-01-15',
            remainingDays: 21,
            priority: 'HIGH',
            type: 'APPEL'
        },
        {
            id: '3',
            title: 'Signification d\'acte par Huissier',
            dossierRef: 'DOS-2024-112',
            dueDate: '2024-12-28',
            remainingDays: 3,
            priority: 'URGENT',
            type: 'PROCEDURE'
        }
    ])

    const { toast } = useToast()

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'URGENT': return <Badge className="bg-red-500 hover:bg-red-600 animate-pulse"><Flame className="h-3 w-3 mr-1" /> URGENT</Badge>
            case 'HIGH': return <Badge className="bg-orange-500 hover:bg-orange-600">Critique</Badge>
            default: return <Badge variant="secondary">Normal</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-indigo-600" />
                        Surveillance des Délais & Échéances
                    </h1>
                    <p className="text-sm text-slate-500">Alertes intelligentes basées sur la procédure civile sénégalaise et OHADA.</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    <Bell className="h-4 w-4" /> Configurer Notifications
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-red-50 border-red-100 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <ShieldAlert className="h-8 w-8 text-red-600 opacity-20" />
                            <span className="text-3xl font-bold text-red-700">2</span>
                        </div>
                        <p className="text-sm font-medium text-red-900 mt-2">Délais expirant à J-3</p>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-50 border-indigo-100 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <Calendar className="h-8 w-8 text-indigo-600 opacity-20" />
                            <span className="text-3xl font-bold text-indigo-700">12</span>
                        </div>
                        <p className="text-sm font-medium text-indigo-900 mt-2">Échéances ce mois</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 opacity-20" />
                            <span className="text-3xl font-bold text-emerald-700">45</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-900 mt-2">Dossiers conformes</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-lg">Registre des Délais Critiques</CardTitle>
                    <CardDescription>Liste triée par urgence selon les règles de procédure.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {deadlines.map((deadline) => (
                            <div key={deadline.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${deadline.remainingDays <= 5 ? 'bg-red-100 text-red-600' :
                                            deadline.remainingDays <= 15 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900">{deadline.title}</h4>
                                            {getPriorityBadge(deadline.priority)}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{deadline.dossierRef}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Échéance : {deadline.dueDate}</span>
                                            <span className="font-bold text-slate-700">Type : {deadline.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-sm font-bold text-slate-900">J-{deadline.remainingDays}</p>
                                    <Progress value={Math.max(0, 100 - (deadline.remainingDays * 3))} className="w-24 h-1.5" />
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-indigo-600">
                                        Traiter <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 space-y-1">
                    <p className="font-bold uppercase tracking-tight">Note de procédure IA :</p>
                    <p>En procédure d'appel civile (Sénégal), vous disposez d'un délai de 15 jours pour répondre aux conclusions de l'intimé à compter de leur signification. Ne laissez pas passer ce délai de rigueur.</p>
                </div>
            </div>
        </div>
    )
}
