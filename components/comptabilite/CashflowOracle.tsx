"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Wallet, ArrowRight, ShieldCheck, Zap } from "lucide-react"

// Mock Data
const PREDICTION_DATA = [
    { month: 'Jan', actual: 4500000, predicted: 4500000, risk: "LOW" },
    { month: 'Fév', actual: 5200000, predicted: 5100000, risk: "LOW" },
    { month: 'Mar', actual: 3800000, predicted: 4000000, risk: "MEDIUM" },
    { month: 'Avr', actual: null, predicted: 6500000, risk: "HIGH_INFLOW" }, // Success Fee expected
    { month: 'Mai', actual: null, predicted: 4200000, risk: "LOW" },
    { month: 'Juin', actual: null, predicted: 2800000, risk: "CRITICAL_LOW" }, // Danger zone
    { month: 'Juil', actual: null, predicted: 4500000, risk: "RECOVERY" },
]

const INCOMING_PAYMENTS = [
    { client: "Sococim", amount: "2.5M", prob: 98, date: "15/04", note: "Historique: Toujours ponctuel" },
    { client: "M. Diouf", amount: "500k", prob: 45, date: "20/04", note: "Retard moyen: 14 jours" },
    { client: "BTP S.A.", amount: "12M", prob: 80, date: "30/04", note: "Lié au jugement 'Victoire'" },
]

export function CashflowOracle() {
    const [selectedMonth, setSelectedMonth] = useState<any>(null)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Oracle Chart */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs animate-pulse">
                            <Zap className="h-3 w-3" />
                            AI PREDICTION ENGINE ACTIVE
                        </div>
                    </div>

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white text-xl">
                            <Wallet className="h-6 w-6 text-purple-500" />
                            Cashflow Oracle™
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Projection de trésorerie à 6 mois basée sur l'IA comportementale.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PREDICTION_DATA}>
                                <defs>
                                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000000}M`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                    formatter={(val: any) => `${val?.toLocaleString()} FCFA`}
                                />
                                {/* Current Performance */}
                                <Area type="monotone" dataKey="actual" stroke="#10b981" fill="transparent" strokeWidth={3} name="Réalisé" />
                                {/* Prediction */}
                                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" fill="url(#colorPred)" strokeDasharray="5 5" strokeWidth={3} name="Prédiction IA" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>

                    {/* Alerts Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                        <div className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-lg flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase">Opportunité (Avril)</p>
                                <p className="text-xs text-slate-300">Entrée massive (+6.5M) détectée (Success Fee probable).</p>
                            </div>
                        </div>
                        <div className="bg-rose-900/30 border border-rose-500/30 p-3 rounded-lg flex items-center gap-3 animate-pulse">
                            <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-rose-400 font-bold uppercase">Alerte Critique (Juin)</p>
                                <p className="text-xs text-slate-300">Risque de trésorerie négative. Action requise avant 45 jours.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Smart Feed Panel */}
            <div className="space-y-6">
                {/* Incoming Payments */}
                <Card className="border-none shadow-lg bg-white h-full relative overflow-hidden">
                    <CardHeader className="bg-indigo-50/50 pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-indigo-800 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" /> Entrées Probables (IA)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {INCOMING_PAYMENTS.map((payment, i) => (
                                <div key={i} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-slate-800">{payment.client}</p>
                                        <Badge className={`${payment.prob > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {payment.prob}% Prob.
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {payment.date}</span>
                                        <span className="font-mono font-bold text-slate-900 text-sm">{payment.amount}</span>
                                    </div>
                                    <p className="text-[10px] text-indigo-500 mt-2 italic opacity-0 group-hover:opacity-100 transition-opacity">
                                        💡 IA: {payment.note}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t text-center">
                            <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold">
                                Voir toutes les prédictions
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Action */}
                <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold opacity-80 uppercase">Santé Financière</p>
                            <p className="text-lg font-black">EXCELLENTE</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
