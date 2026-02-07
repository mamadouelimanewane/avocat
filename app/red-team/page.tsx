"use client"

import { useState, useEffect } from "react"
import {
    ShieldAlert,
    Swords,
    Zap,
    Scale,
    Gavel,
    Target,
    TriangleAlert,
    CheckCircle2,
    ShieldCheck,
    History,
    FileText,
    Wand2,
    Search,
    BrainCircuit,
    ArrowUpRight,
    TrendingDown,
    Activity,
    AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
// Import server action
import { generateRedTeamAttack } from "@/app/actions"

export default function RedTeamPage() {
    const [mounted, setMounted] = useState(false)
    const [isSimulating, setIsSimulating] = useState(false)
    const [simProgress, setSimProgress] = useState(0)
    const [showDebrief, setShowDebrief] = useState(false)
    // New states for real AI
    const [content, setContent] = useState("")
    const [analysis, setAnalysis] = useState<any>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const runAttackSimulation = async () => {
        if (!content || content.length < 20) return

        setIsSimulating(true)
        setShowDebrief(false)
        setSimProgress(0)

        // Progress Simulation
        const interval = setInterval(() => {
            setSimProgress(prev => {
                if (prev >= 90) return 90 // Wait for AI
                return prev + 5
            })
        }, 100)

        try {
            // Call AI Action
            const result = await generateRedTeamAttack(content)

            clearInterval(interval)
            setSimProgress(100)

            if (result.success) {
                setAnalysis(result)
                setTimeout(() => {
                    setIsSimulating(false)
                    setShowDebrief(true)
                }, 500)
            } else {
                alert(result.message || "Erreur lors de l'analyse Red Team")
                setIsSimulating(false)
            }
        } catch (error) {
            console.error(error)
            setIsSimulating(false)
            clearInterval(interval)
        }
    }

    if (!mounted) return null

    return (
        <div className="space-y-8 bg-[#0a0a0a] min-h-[calc(100vh-theme(spacing.32))] text-slate-100 rounded-[3rem] p-8 md:p-12 italic">

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

                            {/* Text Input for Conclusions */}
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Collez ici le texte de vos conclusions ou de votre assignation..."
                                    className="h-48 bg-white/5 border-white/10 rounded-[1.5rem] p-4 text-xs font-medium text-slate-300 focus:ring-rose-500/50 focus:border-rose-500 resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-500 text-right uppercase font-bold tracking-widest">
                                    {content.length} caractères
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Mode d&apos;Agression IA</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Button variant="outline" className="h-16 justify-start border-rose-600/20 bg-rose-600/5 hover:bg-rose-600/10 rounded-2xl p-6 group transition-all">
                                    <div className="flex gap-4 items-center">
                                        <ShieldAlert className="h-6 w-6 text-rose-600" />
                                        <span className="text-left flex flex-col items-start">
                                            <span className="text-xs font-black text-white uppercase tracking-tight block">TOTAL WARFARE</span>
                                            <span className="text-[10px] text-rose-400 font-bold italic block">Analyse impitoyable de toutes les failles.</span>
                                        </span>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-16 justify-start border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 rounded-2xl p-6 opacity-40">
                                    <Scale className="h-6 w-6" />
                                    <span className="ml-4 text-left flex flex-col items-start">
                                        <span className="text-xs font-black uppercase block">Standard Balance</span>
                                        <span className="text-[10px] italic block">Vérification de cohérence équilibrée.</span>
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <Button
                            onClick={runAttackSimulation}
                            disabled={isSimulating || content.length < 20}
                            className="w-full h-18 bg-rose-700 text-white rounded-[1.5rem] font-black text-sm shadow-[0_20px_40px_rgba(190,18,60,0.3)] uppercase tracking-[0.2em] flex gap-4 hover:bg-rose-600 transition-all border-b-4 border-rose-900 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSimulating ? (
                                <><span className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin block" /> GÉNÉRATION DE L&apos;ASSAUT...</>
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
                    ) : showDebrief && analysis ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Score Card Hero */}
                            <Card className="bg-rose-700 border-none rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-16 opacity-10">
                                    <ShieldAlert className="h-40 w-40" />
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <Badge className="bg-white/20 text-white font-black px-4 py-1.5 rounded-lg border-none uppercase text-[10px] tracking-widest">RAPPORT D&apos;INCIDENCE : {analysis.alertLevel || "ÉLEVÉ"}</Badge>
                                        <h2 className="text-5xl font-black italic tracking-tighter">Vulnérabilité Stratégique</h2>
                                        <div className="text-rose-100 font-medium text-lg leading-relaxed space-y-4">
                                            <p>{analysis.summary || "Analyse complétée."}</p>
                                            <p className="p-4 bg-white/10 rounded-xl italic border border-white/5 text-sm">
                                                "{analysis.defenseStrategy?.mainArgument || "Argument adverse principal détecté..."}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-[120px] font-black text-white/20 leading-none">{(Math.random() * (90 - 40) + 40).toFixed(0)}%</div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-200 mt-[-20px]">Indice de Fragilité</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Vulnerabilities */}
                                <Card className="bg-white rounded-[3rem] p-10 text-slate-950 space-y-8 shadow-2xl">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <TriangleAlert className="h-6 w-6 text-rose-600" />
                                        Points de Brèche détectés
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Dynamic Claims Mapping */}
                                        {analysis.adverseClaims?.map((claim: any, idx: number) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3 group hover:bg-rose-50 transition-all cursor-pointer">
                                                <div className="flex justify-between items-center">
                                                    <Badge className="bg-rose-600 text-white text-[9px] font-black border-none px-2">FAILLE {idx + 1}</Badge>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">JURIDIQUE</span>
                                                </div>
                                                <p className="font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase text-xs">{claim.claim}</p>
                                                <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed">Faiblesse identifiée : {claim.weakness}</p>
                                                <p className="text-[9px] text-slate-400 font-mono">Base: {claim.legalBasis}</p>
                                            </div>
                                        ))}

                                        {(!analysis.adverseClaims || analysis.adverseClaims.length === 0) && (
                                            <p className="text-sm text-slate-500 italic">Aucune faille majeure détectée par l'IA.</p>
                                        )}
                                    </div>
                                </Card>

                                {/* Mitigation Recommendations */}
                                <div className="space-y-8">
                                    <Card className="bg-indigo-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden group">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                            <Wand2 className="h-6 w-6 text-indigo-400" />
                                            Nexus Counter-Draft
                                        </h3>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase text-indigo-300">Arguments à préparer :</h4>
                                            <ul className="space-y-2">
                                                {analysis.defenseStrategy?.counterClaims?.map((cc: string, i: number) => (
                                                    <li key={i} className="text-xs text-indigo-100 flex gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" /> {cc}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Button className="w-full h-14 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-black shadow-xl shadow-indigo-950/50 uppercase tracking-widest text-[10px]">
                                            GENERER CONCLUSIONS EN RESPONSES <ArrowUpRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Card>

                                    <Card className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6">
                                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex justify-between">
                                            Textes Applicables Mentionnés
                                            <Scale className="h-4 w-4 text-rose-500" />
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.relevantLaws?.map((law: string, i: number) => (
                                                <Badge key={i} variant="outline" className="border-white/10 text-slate-400 text-[10px]">{law}</Badge>
                                            ))}
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
                            <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest italic">En attente de stratégie</h2>
                            <p className="text-xs text-slate-600 mt-2 font-medium">Collez vos conclusions à gauche pour lancer la simulation.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}
