"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, Briefcase, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DossierFinance {
    id: string
    title: string
    client: string
    revenue: number
    hoursUser: number
    hourlyRateTarget: number
    expenses: number
}

const MOCK_DATA: DossierFinance[] = [
    { id: '1', title: 'Succession Famille Diop', client: 'M. Diop', revenue: 500000, hoursUser: 42, hourlyRateTarget: 25000, expenses: 50000 },
    { id: '2', title: 'Contentieux Commercial Orange', client: 'TechSolutions', revenue: 2500000, hoursUser: 15, hourlyRateTarget: 50000, expenses: 120000 },
    { id: '3', title: 'Divorce Mme Faye', client: 'Mme Faye', revenue: 300000, hoursUser: 8, hourlyRateTarget: 30000, expenses: 10000 },
]

export function FinancialXRay() {
    const [selectedPeriod, setSelectedPeriod] = useState('MONTH')

    return (
        <Card className="border-none shadow-xl bg-slate-900 text-white">
            <CardHeader className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <DollarSign className="h-6 w-6 text-emerald-400" />
                            Financial X-Ray™
                        </CardTitle>
                        <CardDescription className="text-slate-400">Analyse de rentabilité en temps réel par dossier.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">Janvier 2026</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Taux Horaire Moyen</p>
                        <h3 className="text-2xl font-black text-white">42.500 FCFA</h3>
                        <p className="text-[10px] text-emerald-300 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +12% vs mois dernier
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <p className="text-xs text-rose-400 font-bold uppercase mb-1">Heures Non-Facturables</p>
                        <h3 className="text-2xl font-black text-white">18h 30m</h3>
                        <p className="text-[10px] text-rose-300 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> 15% du temps total
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Rentabilité Globale</p>
                        <h3 className="text-2xl font-black text-white">84%</h3>
                        <p className="text-[10px] text-indigo-300 mt-1">Sur objectif cabinet</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Top Dossiers (Analyse de Performance)</h4>

                    {MOCK_DATA.map((dossier) => {
                        const realHourlyRate = (dossier.revenue - dossier.expenses) / dossier.hoursUser
                        const isProfitable = realHourlyRate >= dossier.hourlyRateTarget
                        const profitabilityScore = Math.min(100, (realHourlyRate / dossier.hourlyRateTarget) * 100)

                        return (
                            <div key={dossier.id} className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-600">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-slate-700 text-slate-300">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{dossier.title}</h5>
                                            <p className="text-xs text-slate-400">{dossier.client}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-lg font-bold text-white">{realHourlyRate.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} <span className="text-xs font-normal text-slate-500">FCFA/h</span></p>
                                        <p className={`text-[10px] font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {isProfitable ? 'RENTABLE' : 'CRITIQUE'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                                        <span>Indice de Rentabilité</span>
                                        <span>{profitabilityScore.toFixed(0)} / 100</span>
                                    </div>
                                    <Progress value={profitabilityScore} className={`h-1.5 ${isProfitable ? 'text-emerald-500' : 'text-rose-500'}`} />

                                    {!isProfitable && (
                                        <div className="mt-2 text-xs text-rose-300 bg-rose-500/10 p-2 rounded flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />
                                            Conseil IA : Ce forfait est dépassé. Envisagez une facturation au temps passé pour les prochaines diligences.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
