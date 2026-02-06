
"use client"

import { useState } from "react"
import {
    LineChart,
    TrendingUp,
    Target,
    MapPin,
    Calculator,
    Info,
    ArrowRight,
    BarChart3,
    Scale,
    Gavel,
    Search,
    AlertTriangle,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface LexPredictorProps {
    dossierId: string
    onClose?: () => void
}

export function LexPredictor({ dossierId, onClose }: LexPredictorProps) {
    const [selectedJurisdiction, setSelectedJurisdiction] = useState("paris")
    const [isScanning, setIsScanning] = useState(false)

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Predictice Style (Clean, Data-Focused) */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-teal-500 p-2 rounded-lg shadow-md shadow-teal-200">
                        <LineChart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-teal-500">Predictor</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Justice Prédictive & Quantum</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <Target className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden bg-[#f1f5f9]">
                <ScrollArea className="h-full">
                    <div className="p-6 max-w-2xl mx-auto space-y-6">

                        {/* 1. Success Probability Gauge */}
                        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-teal-500" />
                                    Probabilité de Succès
                                </CardTitle>
                                <CardDescription className="font-medium text-slate-400">Basé sur 2,450 décisions similaires (Licenciement sans cause réelle)</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-8">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    {/* Mock Circular Chart */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                                        <circle cx="64" cy="64" r="56" stroke="#14b8a6" strokeWidth="12" fill="none" strokeDasharray="351" strokeDashoffset="70" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-slate-900">82%</span>
                                        <span className="text-[10px] font-bold text-teal-600 uppercase">FAVORABLE</span>
                                    </div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-600">
                                            <span>Cour d'Appel (Actuelle)</span>
                                            <span>82%</span>
                                        </div>
                                        <Progress value={82} className="h-2 bg-slate-100" indicatorClassName="bg-teal-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-600">
                                            <span>Moyenne Nationale</span>
                                            <span>64%</span>
                                        </div>
                                        <Progress value={64} className="h-2 bg-slate-100" indicatorClassName="bg-slate-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Quantum Estimation (Indemnities) */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Calculator className="h-5 w-5 text-teal-500" />
                                        Estimation des Indemnités
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-teal-50 text-teal-700 font-bold">Quantum</Badge>
                                </div>
                                <CardDescription>Montants accordés par la juridiction pour ce type de préjudice.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Distribution Bar Chart Mock */}
                                <div className="h-48 flex items-end justify-between gap-2 mb-4 px-2">
                                    <Bar height="h-8" opacity="opacity-30" amount="5k" />
                                    <Bar height="h-16" opacity="opacity-40" amount="10k" />
                                    <Bar height="h-24" opacity="opacity-60" amount="15k" />
                                    <Bar height="h-40" opacity="opacity-100" active amount="24k (Moy)" />
                                    <Bar height="h-32" opacity="opacity-70" amount="30k" />
                                    <Bar height="h-12" opacity="opacity-40" amount="45k" />
                                    <Bar height="h-6" opacity="opacity-20" amount="80k" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                                    <StatBox label="Minimum" value="5,000 €" color="text-slate-400" />
                                    <StatBox label="Médiane" value="24,500 €" color="text-teal-600" active />
                                    <StatBox label="Maximum" value="82,000 €" color="text-slate-900" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. Jurisdiction Analysis */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-teal-500" />
                                    Analyse Juridictionnelle
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                                        <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 font-bold">
                                            <SelectValue placeholder="Choisir une juridiction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paris">CA Paris</SelectItem>
                                            <SelectItem value="versailles">CA Versailles</SelectItem>
                                            <SelectItem value="lyon">CA Lyon</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-600">Tendance aux prud'hommes</span>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Favorable Salarié</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-600">Durée moyenne procédure</span>
                                        <span className="text-sm font-mono font-bold text-slate-900">14.5 mois</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-600">Taux d'infirmation</span>
                                        <span className="text-sm font-mono font-bold text-rose-500">18%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Document Scan CTA */}
                        <Card className="border border-dashed border-teal-200 bg-teal-50/50 rounded-2xl">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-3 rounded-full shadow-sm text-teal-500">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800">Scanner mes conclusions</h4>
                                        <p className="text-xs text-slate-500 font-medium">L'IA analyse vos chances de succès basées sur vos arguments.</p>
                                    </div>
                                </div>
                                <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold shadow-lg shadow-teal-100">
                                    LANCER L'ANALYSE
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

function Bar({ height, opacity, amount, active }: { height: string, opacity: string, amount: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1 group cursor-pointer flex-1">
            <div className={cn(
                "w-full rounded-t-sm transition-all duration-300 relative",
                height,
                opacity,
                active ? "bg-teal-500 opacity-100" : "bg-slate-800 hover:bg-teal-400 hover:opacity-100"
            )}>
                {active && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">
                        VOTRE CAS
                    </div>
                )}
            </div>
            <span className={cn("text-[9px] font-mono font-bold", active ? "text-teal-600" : "text-slate-400")}>{amount}</span>
        </div>
    )
}

function StatBox({ label, value, color, active }: { label: string, value: string, color: string, active?: boolean }) {
    return (
        <div className={cn("text-center p-2 rounded-lg", active && "bg-teal-50 border border-teal-100")}>
            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{label}</p>
            <p className={cn("text-lg font-black tracking-tight", color)}>{value}</p>
        </div>
    )
}
