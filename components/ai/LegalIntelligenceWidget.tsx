"use client"

import { useState } from "react"
import {
    Zap,
    Newspaper,
    ArrowRight,
    ExternalLink,
    Info,
    Sparkles,
    FileWarning,
    CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ALERTS = [
    {
        id: "1",
        title: "Nouvelle Directive OHADA - Baux Commerciaux",
        date: "Aujourd'hui, 09:42",
        relevance: "Impact Élevé",
        dossiers: ["2026/TF/MBAO-042", "2025/COMM/012"],
        summary: "Modification des conditions de renouvellement du bail commercial pour les entreprises étrangères.",
        type: "Directives"
    },
    {
        id: "2",
        title: "Arrêt Cour Suprême (Sénégal) : Propriété Foncière",
        date: "Hier, 15:30",
        relevance: "Action Requise",
        dossiers: ["2026/TF/MBAO-042"],
        summary: "Nouvelles exigences de preuve pour les Titres Fonciers issus de décrets d'expropriation.",
        type: "Jurisprudence"
    },
    {
        id: "3",
        title: "Loi de Finance 2026 : Réforme de la TVA",
        date: "02 Jan 2026",
        relevance: "Audit Conseillé",
        dossiers: ["Toutes les fiches Clients"],
        summary: "Changement des taux de TVA pour les prestations de services juridiques à l'export.",
        type: "Législation"
    }
]

export function LegalIntelligenceWidget() {
    const [dismissed, setDismissed] = useState<string[]>([])

    const activeAlerts = ALERTS.filter(a => !dismissed.includes(a.id))

    return (
        <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="h-24 w-24 text-amber-500" />
            </div>

            <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-500">
                        <Zap className="h-5 w-5 fill-current" />
                        Veille Légale Prédictive LexAI
                    </CardTitle>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5">
                        {activeAlerts.length} nouvelles alertes
                    </Badge>
                </div>
                <CardDescription className="text-slate-400 text-xs">
                    L'IA surveille les sources officielles (OHADA, JO, Cour Suprême) en temps réel.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 relative z-10">
                {activeAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-800/50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                        <p className="text-sm font-medium">Votre veille est à jour.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeAlerts.map(alert => (
                            <div
                                key={alert.id}
                                className="group p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer relative"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-[10px] font-bold px-1.5 py-0 h-4 border-none uppercase",
                                                alert.type === 'Jurisprudence' ? 'bg-blue-500/20 text-blue-400' :
                                                    alert.type === 'Législation' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-amber-500/20 text-amber-400'
                                            )}
                                        >
                                            {alert.type}
                                        </Badge>
                                        <span className="text-[10px] text-slate-500 font-medium">{alert.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
                                        <Info className="h-3 w-3 text-slate-500" />
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors leading-tight">
                                    {alert.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic">
                                    "{alert.summary}"
                                </p>

                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                    <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase">
                                        <FileWarning className="h-3 w-3" />
                                        Dossier impacté :
                                    </div>
                                    <div className="flex gap-1">
                                        {alert.dossiers.map(d => (
                                            <Badge key={d} className="bg-slate-700 hover:bg-slate-600 text-[9px] h-4 px-1.5 border-none">
                                                {d}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/[0.02] rounded-lg transition-colors pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-2 flex gap-2">
                    <Button variant="outline" className="flex-1 h-8 text-xs border-slate-700 hover:bg-slate-800 text-slate-300">
                        Veille Complète
                    </Button>
                    <Button className="flex-1 h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold group">
                        Actions IA <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
