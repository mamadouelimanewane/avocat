"use client"

import { useState, useEffect } from "react"
import {
    Clock,
    Play,
    Pause,
    CheckCircle2,
    Calendar,
    User,
    Briefcase,
    DollarSign,
    BarChart3,
    Plus,
    History,
    TrendingUp,
    Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

// Mock Data for demonstration
const MOCK_TIME_ENTRIES = [
    { id: 1, dossier: "Divorce Fall c. Diop", task: "Rédaction conclusions", duration: "2h 30m", date: "aujourd'hui", billable: true, amount: 75000 },
    { id: 2, dossier: "Contentieux Foncier SIS", task: "Audience TGI", duration: "1h 45m", date: "aujourd'hui", billable: true, amount: 52500 },
    { id: 3, dossier: "Formation Interne", task: "Mise à jour LexAI", duration: "45m", date: "hier", billable: false, amount: 0 },
]

const PERFORMANCE_DATA = [
    { day: 'Lun', hours: 6.5 },
    { day: 'Mar', hours: 8.2 },
    { day: 'Mer', hours: 7.0 },
    { day: 'Jeu', hours: 9.5 },
    { day: 'Ven', hours: 5.8 },
]

export default function TimeTrackingPage() {
    const [isRunning, setIsRunning] = useState(false)
    const [time, setTime] = useState(0) // in seconds
    const [activeDossier, setActiveDossier] = useState("Sélectionner un dossier...")

    useEffect(() => {
        let interval: any
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 1)
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen font-sans">

            {/* Header mimicking Jarvis/LegalProd professionalism */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Clock className="h-8 w-8 text-indigo-600" />
                        Time Tracking Pro
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Capturer chaque minute de votre expertise pour une facturation juste.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Calendar className="h-4 w-4" /> Semaine en cours
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                        <Plus className="h-4 w-4 mr-2" /> Saisie manuelle
                    </Button>
                </div>
            </div>

            {/* Active Timer Card - Inspired by 'la capture du temps qui passe' in zLawyer */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-indigo-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-8 md:p-12 lg:col-span-2 flex flex-col justify-center border-r border-slate-100">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-1">TRAVAIL EN COURS</Badge>
                                <span className="text-slate-400 font-medium">• {activeDossier}</span>
                            </div>
                            <div className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter tabular-nums">
                                {formatTime(time)}
                            </div>
                            <div className="flex items-center gap-4">
                                {!isRunning ? (
                                    <Button
                                        onClick={() => setIsRunning(true)}
                                        className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-emerald-200"
                                    >
                                        <Play className="h-6 w-6 mr-3 fill-current" /> Démarrer
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setIsRunning(false)}
                                        className="h-16 px-10 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-rose-200"
                                    >
                                        <Pause className="h-6 w-6 mr-3 fill-current" /> Suspendre
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="h-16 px-8 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 text-slate-600"
                                    onClick={() => {
                                        setIsRunning(false)
                                        setTime(0)
                                    }}
                                >
                                    Valider & Enregistrer
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-8 md:p-12 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">Objectif Journalier</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">6.5h facturables</span>
                                    <span className="text-indigo-600 font-bold">85%</span>
                                </div>
                                <Progress value={85} className="h-2 bg-slate-200" />
                                <p className="text-xs text-slate-400">Plus que 45 minutes pour atteindre votre quota.</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-slate-700">Estimation Honoraires</span>
                                <span className="text-2xl font-black text-emerald-600 tracking-tight">
                                    {new Intl.NumberFormat('fr-FR').format(Math.floor(time / 3600 * 30000))} FCFA
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">Basé sur votre taux horaire moyen (30,000 FCFA/h)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Entries */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between px-8 py-6">
                            <div>
                                <CardTitle className="text-lg">Dernières Activités</CardTitle>
                                <CardDescription>Vos 24 dernières heures d'expertise.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {MOCK_TIME_ENTRIES.map((entry) => (
                                    <div key={entry.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${entry.billable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {entry.billable ? <DollarSign className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{entry.dossier}</h4>
                                                <p className="text-slate-500 font-medium">{entry.task}</p>
                                                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold uppercase tracking-wider">
                                                    <span className="text-slate-400">{entry.date}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className={entry.billable ? 'text-indigo-600' : 'text-slate-400'}>{entry.billable ? 'Facturable' : 'Non-facturable'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-slate-900">{entry.duration}</div>
                                            <div className="text-xs font-bold text-emerald-600">{entry.amount > 0 ? `+ ${entry.amount.toLocaleString()} FCFA` : '—'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Weekly Productivity Charts */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-[#0f172a] text-white">
                        <CardHeader className="border-b border-white/10">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-indigo-400" />
                                Diligences Hebdomadaires
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8 flex flex-col items-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={PERFORMANCE_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            tickFormatter={(v) => `${v}h`}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                                            {PERFORMANCE_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.hours > 7 ? '#6366f1' : '#475569'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total Facturé Semaine</p>
                                    <h4 className="text-2xl font-black mt-1">452,000 <span className="text-xs font-medium opacity-40">FCFA</span></h4>
                                </div>
                                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-emerald-100 bg-emerald-50/20 p-8">
                        <h4 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Auto-Facturation active
                        </h4>
                        <p className="text-xs text-emerald-700 leading-relaxed mb-6">
                            Vos saisies de temps sont automatiquement consolidées en factures mensuelles pour les dossiers au forfait.
                        </p>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-6">
                            Générer factures (Q1)
                        </Button>
                    </Card>
                </div>
            </div>

        </div>
    )
}
