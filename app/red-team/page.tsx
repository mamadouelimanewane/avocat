"use client"

import { useState } from "react"
import {
    ShieldAlert,
    Swords,
    Zap,
    Scale,
    Gavel,
    Target,
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    History,
    FileText,
    Wand2,
    Search,
    BrainCircuit,
    ArrowUpRight,
    TrendingDown,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const VULNERABILITIES = [
    { id: 1, type: "FAILLE LOGIQUE", severity: "CRITIQUE", label: "Contradiction temporelle Article 12", impact: "Risque d'irrecevabilité immédiate" },
    { id: 2, type: "PREUVE FAIBLE", severity: "MOYEN", label: "Pièce n°4 : Manque d'authentification notariale", impact: "Argumentation susceptible d'être écartée" },
    { id: 3, type: "BRÈCHE JURISPRUDENTIELLE", severity: "CRITIQUE", label: "Revirement CCJA 2024 non intégré", impact: "Défense adverse très probable sur ce point" },
]

export default function RedTeamPage() {
    const [isSimulating, setIsSimulating] = useState(false)
    const [simProgress, setSimProgress] = useState(0)
    const [showDebrief, setShowDebrief] = useState(false)

    const runAttackSimulation = () => {
        setIsSimulating(true)
        setShowDebrief(false)
        setSimProgress(0)
        const interval = setInterval(() => {
            setSimProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsSimulating(false)
                    setShowDebrief(true)
                    return 100
                }
                return prev + 5
            })
        }, 100)
    }

    return (
        <div className="p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-slate-100 italic">

            {/* Header: Tactical Warfare Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-rose-700/80 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(190,18,60,0.5)] ring-4 ring-rose-700/20">
                        <Swords className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Lex<span className="text-rose-600">Red</span> Team</h1>
                        <p className="text-slate-500 font-medium tracking-tight">L&apos;IA Contradictoire : Attaquez votre stratégie avant vos adversaires.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-rose-900/50 bg-rose-900/10 text-rose-500 hover:bg-rose-900/20 rounded-xl px-6 font-black text-xs tracking-widest uppercase">
                        <History className="h-4 w-4 mr-2" /> Rapport d&apos;Assaut Précédents
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Input Area: Upload & Config (4 columns) */}
                <div className="xl:col-span-4 space-y-8">
                    <Card className="bg-slate-900 border-white/5 rounded-[3rem] p-10 space-y-10 relative overflow-hidden">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-rose-600" /> Charger vos Conclusions
                            </h3>
                            <div className="h-48 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group">
                                <Zap className="h-10 w-10 text-slate-700 group-hover:text-rose-500 transition-colors mb-4" />
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Glisser-déposer PDF / Word</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Mode d&apos;Agression IA</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Button variant="outline" className="h-16 justify-start border-rose-600/20 bg-rose-600/5 hover:bg-rose-600/10 rounded-2xl p-6 group transition-all">
                                    <div className="flex gap-4 items-center">
                                        <ShieldAlert className="h-6 w-6 text-rose-600" />
                                        <div className="text-left">
                                            <p className="text-xs font-black text-white uppercase tracking-tight">TOTAL WARFARE</p>
                                            <p className="text-[10px] text-rose-400 font-bold italic">Analyse impitoyable de toutes les failles.</p>
                                        </div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-16 justify-start border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 rounded-2xl p-6 opacity-40">
                                    <Scale className="h-6 w-6" />
                                    <div className="ml-4 text-left">
                                        <p className="text-xs font-black uppercase">Standard Balance</p>
                                        <p className="text-[10px] italic">Vérification de cohérence équilibrée.</p>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <Button
                            onClick={runAttackSimulation}
                            disabled={isSimulating}
                            className="w-full h-18 bg-rose-700 text-white rounded-[1.5rem] font-black text-sm shadow-[0_20px_40px_rgba(190,18,60,0.3)] uppercase tracking-[0.2em] flex gap-4 hover:bg-rose-600 transition-all border-b-4 border-rose-900 active:border-b-0 active:translate-y-1"
                        >
                            {isSimulating ? (
                                <><div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> GÉNÉRATION DE L&apos;ASSAUT...</>
                            ) : (
                                <><Zap className="h-6 w-6 fill-white" /> DÉCHAÎNER LA RED TEAM</>
                            )}
                        </Button>
                    </Card>

                    <Card className="bg-rose-600/10 border-rose-600/20 rounded-[2.5rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="h-5 w-5 text-rose-500" />
                            <h3 className="text-xs font-black uppercase text-rose-400 tracking-widest">Concept LexRedTeam</h3>
                        </div>
                        <p className="text-[10px] text-rose-200/50 font-medium leading-relaxed italic">
                            Le système Nexus inverse son moteur d&apos;argumentation pour simuler la stratégie la plus toxique que pourrait adopter votre adversaire.
                        </p>
                    </Card>
                </div>

                {/* Simulation Output Area (8 columns) */}
                <div className="xl:col-span-8 space-y-8">
                    {isSimulating ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 bg-white/5 rounded-[4rem] border border-white/5 py-40">
                            <div className="relative">
                                <Swords className="h-32 w-32 text-rose-600 animate-bounce" />
                                <div className="absolute inset-0 bg-rose-600 blur-[80px] opacity-20 animate-pulse" />
                            </div>
                            <div className="w-full max-w-md space-y-6">
                                <div className="flex justify-between text-rose-500 font-black text-lg italic tracking-widest">
                                    <span className="uppercase">Injection du Venin Intellectuel</span>
                                    <span>{simProgress}%</span>
                                </div>
                                <Progress value={simProgress} className="h-3 bg-white/5" />
                                <div className="grid grid-cols-2 gap-4">
                                    <p className="text-[9px] font-black uppercase text-slate-600 animate-pulse">Scanning Articles 700 cpc...</p>
                                    <p className="text-[9px] font-black uppercase text-slate-600 animate-pulse delay-150">Analyse de mauvaise foi adverse...</p>
                                </div>
                            </div>
                        </div>
                    ) : showDebrief ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Score Card Hero */}
                            <Card className="bg-rose-700 border-none rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-16 opacity-10">
                                    <ShieldAlert className="h-40 w-40" />
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <Badge className="bg-white/20 text-white font-black px-4 py-1.5 rounded-lg border-none uppercase text-[10px] tracking-widest">RAPPORT D&apos;INCIDENCE : CRITIQUE</Badge>
                                        <h2 className="text-5xl font-black italic tracking-tighter">Vulnérabilité Stratégique : <span className="text-white/60">Élevée</span></h2>
                                        <p className="text-rose-100 font-medium text-lg leading-relaxed">
                                            "Votre argumentation sur le préjudice moral est fragile. L&apos;IA adverse attaquera sur l&apos;absence de certificat médical daté."
                                        </p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-[120px] font-black text-white/20 leading-none">62%</div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-200 mt-[-20px]">Indice de Fragilité</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Vulnerabilities */}
                                <Card className="bg-white rounded-[3rem] p-10 text-slate-950 space-y-8 shadow-2xl">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <AlertTriangle className="h-6 w-6 text-rose-600" />
                                        Points de Brèche détectés
                                    </h3>
                                    <div className="space-y-4">
                                        {VULNERABILITIES.map((v) => (
                                            <div key={v.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3 group hover:bg-rose-50 transition-all cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <Badge className={cn("text-[9px] font-black border-none px-2", v.severity === 'CRITIQUE' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-700')}>{v.type}</Badge>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.severity}</span>
                                                </div>
                                                <p className="font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase text-xs">{v.label}</p>
                                                <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed">{v.impact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Mitigation Recommendations */}
                                <div className="space-y-8">
                                    <Card className="bg-indigo-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden group">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                            <Wand2 className="h-6 w-6 text-indigo-400" />
                                            Nexus Counter-Draft
                                        </h3>
                                        <p className="text-sm text-indigo-100 leading-relaxed font-medium italic">
                                            "L&apos;IA a généré un contre-argumentaire de 3 pages pour 'blinder' votre pièce n°4. Souhaitez-vous l&apos;intégrer ?"
                                        </p>
                                        <Button className="w-full h-14 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-black shadow-xl shadow-indigo-950/50 uppercase tracking-widest text-[10px]">
                                            DÉPLOYER LA CONTRE-MESURE <ArrowUpRight className="h-4 w-4 ml-2" />
                                        </Button>
                                        <div className="absolute bottom-[-20px] left-[-20px] h-32 w-32 bg-white/5 rounded-full blur-3xl" />
                                    </Card>

                                    <Card className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6">
                                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex justify-between">
                                            Simulation Pertinence Adverse
                                            <Target className="h-4 w-4 text-rose-500" />
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                                    <span>Crédibilité Argumentaire</span>
                                                    <span>42%</span>
                                                </div>
                                                <Progress value={42} className="h-2 bg-white/5" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                                    <span>Robustesse des preuves</span>
                                                    <span className="text-rose-500">22%</span>
                                                </div>
                                                <Progress value={22} className="h-2 bg-white/5" />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-[4rem] border border-white/5 py-40 group hover:bg-white/[0.07] transition-all cursor-pointer">
                            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Swords className="h-12 w-12 text-slate-700 group-hover:text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest italic">Charger une stratégie</h2>
                            <p className="text-xs text-slate-600 mt-2 font-medium">Pour lancer la simulation de contradiction.</p>
                        </div>
                    )}
                </div>

            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
            `}</style>
        </div>
    )
}
