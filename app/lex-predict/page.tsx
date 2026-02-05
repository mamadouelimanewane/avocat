"use client"

import { useState } from "react"
import {
    BarChart3,
    TrendingUp,
    Gavel,
    Target,
    AlertTriangle,
    CheckCircle2,
    Search,
    Filter,
    ArrowRight,
    Zap,
    Briefcase,
    History,
    Info,
    Scale
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for Predictive Justice
const PREDICTION_STATS = {
    successProb: 72,
    avgDamages: "15.000.000 FCFA",
    durationEst: "14 mois",
    riskLevel: "MODÉRÉ",
}

const COMPARABLE_CASES = [
    { id: 1, name: "SARL X vs Etat du Sénégal", outcome: "VICTOIRE", damages: "12.5M", court: "TGI Dakar", date: "2024" },
    { id: 2, name: "Consultants SA vs Port Dakar", outcome: "TRANSACTION", damages: "8M", court: "CCJA", date: "2023" },
    { id: 3, name: "Telecom Ltd vs ARTP", outcome: "DÉFAITE", damages: "0", court: "Cour Suprême", date: "2025" },
]

export default function LexPredictPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const runAnalysis = () => {
        setIsAnalyzing(true)
        setTimeout(() => {
            setIsAnalyzing(false)
            setShowResult(true)
        }, 3000)
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* LexPredict Header: Data & Justice vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white">
                        <Scale className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexPredict Intelligence</h1>
                        <p className="text-slate-500 font-medium italic">Analyse prédictive de succès & Quantum de dommages (Inspiré Lex Machina).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white font-bold rounded-xl shadow-sm">
                        <History className="h-4 w-4 mr-2" /> Analyses Antérieures
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl font-bold rounded-xl">
                        <Zap className="h-4 w-4 mr-2" /> Analyser Nouveau Dossier
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Input Pane */}
                <div className="xl:col-span-1 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Paramètres du Dossier</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de Litige</label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold">
                                        <option>Social / Droit du Travail</option>
                                        <option>Commercial / OHADA</option>
                                        <option>Immobilier</option>
                                        <option>Fiscalité</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Juridiction</label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold">
                                        <option>Tribunal de Grande Instance Dakar</option>
                                        <option>CCJA (Abidjan)</option>
                                        <option>Cour d&apos;Appel</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partie Adverse</label>
                                    <input className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold" placeholder="Rechercher entité..." />
                                </div>
                            </div>
                            <Button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="w-full h-14 bg-indigo-900 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex gap-2"
                            >
                                {isAnalyzing ? (
                                    <><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyse en cours...</>
                                ) : (
                                    <><Target className="h-5 w-5 text-indigo-400" /> Prédire l&apos;Issue</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-indigo-100 bg-indigo-50/30 p-8 border-2 border-dashed">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="h-5 w-5 text-indigo-600" />
                            <h4 className="font-bold text-slate-900">À propos de LexPredict</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Notre algorithme croise 15 ans de jurisprudence OHADA avec les données de profilage des magistrats pour extraire des tendances statistiques fiables.
                        </p>
                    </Card>
                </div>

                {/* Prediction Results */}
                <div className="xl:col-span-2 space-y-8">
                    {showResult ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="rounded-[3rem] border-slate-100 shadow-xl bg-white p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <TrendingUp className="h-24 w-24" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Probabilité de succès</p>
                                    <div className="relative h-40 w-40 mb-6 font-black text-4xl flex items-center justify-center">
                                        <svg className="h-full w-full rotate-[-90deg]">
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * PREDICTION_STATS.successProb) / 100} className="text-indigo-600 transition-all duration-1000" />
                                        </svg>
                                        <span className="absolute">{PREDICTION_STATS.successProb}%</span>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-1.5 uppercase text-[10px]">FORT POTENTIEL</Badge>
                                </Card>

                                <div className="space-y-6">
                                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-8">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Estimation de Valeur</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500">Moyenne Jurisprudence</p>
                                                    <p className="text-2xl font-black text-slate-900">{PREDICTION_STATS.avgDamages}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-500">Durée Moyenne</p>
                                                    <p className="text-lg font-black text-indigo-600">{PREDICTION_STATS.durationEst}</p>
                                                </div>
                                            </div>
                                            <Progress value={65} className="h-1.5 bg-slate-100" />
                                        </div>
                                    </Card>

                                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-indigo-900 text-white p-8 relative overflow-hidden">
                                        <AlertTriangle className="absolute top-4 right-4 h-6 w-6 text-amber-400" />
                                        <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-indigo-300">Point Critique Détecté</h4>
                                        <p className="text-sm font-medium leading-relaxed italic">
                                            "La partie adverse a gagné 85% de ses recours devant le TGI Dakar sur ce motif précis. Une transaction est recommandée à hauteur de 10M FCFA."
                                        </p>
                                    </Card>
                                </div>
                            </div>

                            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="px-8 py-6 border-b border-slate-50">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Gavel className="h-5 w-5 text-slate-400" />
                                        Précédents Similaires (Benchmark)
                                    </CardTitle>
                                </CardHeader>
                                <div className="divide-y divide-slate-50">
                                    {COMPARABLE_CASES.map((c) => (
                                        <div key={c.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.outcome === 'VICTOIRE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-900">{c.name}</h5>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{c.court} • {c.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-700">{c.damages} FCFA</p>
                                                <Badge variant="outline" className="text-[9px] font-black border-slate-200">{c.outcome}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
                                <BarChart3 className="h-12 w-12" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-400">Prêt pour l&apos;analyse</h2>
                            <p className="text-xs text-slate-300 mt-2 font-medium">Configurez les paramètres à gauche pour lancer la prédiction IA.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}
