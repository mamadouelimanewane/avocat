"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BrainCircuit,
    TrendingUp,
    AlertTriangle,
    Gavel,
    Target,
    Zap,
    Scale,
    ShieldCheck,
    ArrowRight,
    Loader2,
    Sparkles,
    BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

interface PredictionData {
    winProbability: number
    confidenceScore: number
    keyFactors: Array<{ factor: string, impact: 'POSITIVE' | 'NEGATIVE', weight: number }>
    strategicRisks: string[]
    suggestedPrecedents: string[]
    estimatedDuration: string
}

export function PredictiveDashboard({ dossierId }: { dossierId: string }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [prediction, setPrediction] = useState<PredictionData | null>(null)
    const { toast } = useToast()

    const runAnalysis = async () => {
        setIsAnalyzing(true)
        try {
            const response = await fetch('/api/ai/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dossierId })
            })
            const data = await response.json()
            if (data.success) {
                setPrediction(data.prediction)
            } else {
                toast({
                    title: "Erreur d'analyse",
                    description: data.error || "Impossible de générer l'audit.",
                    variant: "destructive"
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="space-y-6">
            {!prediction && !isAnalyzing && (
                <Card className="border-2 border-dashed border-indigo-100 bg-indigo-50/30 p-12 text-center group cursor-pointer hover:border-indigo-300 transition-all" onClick={runAnalysis}>
                    <div className="h-20 w-20 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BrainCircuit className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Lancer l'Analyse Prédictive LexAI</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                        Notre IA va analyser les pièces du dossier, la jurisprudence CCJA/Sénégal et les tendances de la juridiction pour calculer vos chances de succès.
                    </p>
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 px-8">
                        Démarrer l'audit stratégique
                    </Button>
                </Card>
            )}

            {isAnalyzing && (
                <Card className="p-20 text-center space-y-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="relative z-10 mx-auto h-24 w-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full flex items-center justify-center"
                    >
                        <Zap className="h-8 w-8 text-indigo-600 animate-pulse" />
                    </motion.div>
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Analyse Neuronale en cours...</h3>
                        <div className="flex justify-center gap-1">
                            {["Vérification pièces", "Scan jurisprudence", "Calcul probabilités", "Stratégie adverse"].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.5 }}
                                    className="px-2 py-1 bg-white rounded-md text-[10px] font-bold text-slate-400 border border-slate-100 uppercase"
                                >
                                    {text}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}

            <AnimatePresence>
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Main Score Card */}
                        <Card className="lg:col-span-2 border-none shadow-2xl overflow-hidden bg-slate-900 text-white">
                            <CardHeader className="border-b border-white/10 pb-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <Badge className="bg-indigo-500 hover:bg-indigo-500">AUDIT STRATÉGIQUE RÉALISÉ</Badge>
                                        <CardTitle className="text-3xl font-black">Indice de Succès LexAI</CardTitle>
                                    </div>
                                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <TrendingUp className="h-8 w-8 text-emerald-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex flex-col md:flex-row items-center gap-12">
                                    <div className="relative h-48 w-48 shrink-0">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <motion.circle
                                                cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10"
                                                strokeDasharray="283"
                                                initial={{ strokeDashoffset: 283 }}
                                                animate={{ strokeDashoffset: 283 - (283 * prediction.winProbability) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black">{prediction.winProbability}%</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Probabilité</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                                        <PredictionStat label="Confiance IA" value={`${prediction.confidenceScore}%`} icon={ShieldCheck} />
                                        <PredictionStat label="Durée Estimée" value={prediction.estimatedDuration} icon={Scale} />
                                        <PredictionStat label="Précédents" value={prediction.suggestedPrecedents.length} icon={Gavel} />
                                        <PredictionStat label="Niveau Risque" value="Modéré" icon={AlertTriangle} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-400" /> Facteurs d'Influence
                                    </h4>
                                    <div className="space-y-3">
                                        {prediction.keyFactors.map((f, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className={`h-2 w-2 rounded-full ${f.impact === 'POSITIVE' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-400'}`} />
                                                <span className="text-sm font-medium flex-1">{f.factor}</span>
                                                <span className={`text-xs font-black ${f.impact === 'POSITIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {f.impact === 'POSITIVE' ? '+' : '-'}{f.weight}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Side Panel: Risks & Jurisprudence */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl bg-white overflow-hidden">
                                <CardHeader className="bg-rose-50 border-b border-rose-100">
                                    <CardTitle className="text-sm font-black text-rose-900 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> VULNÉRABILITÉS DÉTECTÉES
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    {prediction.strategicRisks.map((risk, i) => (
                                        <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <AlertTriangle className="h-4 w-4 text-rose-500 mt-1 shrink-0" />
                                            <p className="text-xs font-bold text-slate-700 lowercase first-letter:uppercase">{risk}</p>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full text-xs font-black text-rose-600 border-rose-200 hover:bg-rose-50">
                                        Générer contre-arguments
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl bg-white overflow-hidden">
                                <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                                    <CardTitle className="text-sm font-black text-indigo-900 flex items-center gap-2">
                                        <Gavel className="h-4 w-4" /> JURISPRUDENCE MATCH
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {prediction.suggestedPrecedents.map((prec, i) => (
                                        <div key={i} className="group p-3 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">CCJA / SUPRÊME</span>
                                                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                            </div>
                                            <p className="text-xs font-black text-slate-900">{prec}</p>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-[10px] font-black text-indigo-600 hover:bg-indigo-50">
                                        Explorer la base RAG ++
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function PredictionStat({ label, value, icon: Icon }: { label: string, value: any, icon: any }) {
    return (
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-black text-white">{value}</p>
            </div>
        </div>
    )
}
