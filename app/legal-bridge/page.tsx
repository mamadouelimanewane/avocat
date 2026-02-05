"use client"

import { useState } from "react"
import {
    Languages,
    ArrowLeftRight,
    Zap,
    Scale,
    Gavel,
    BookOpen,
    Globe,
    FileText,
    CheckCircle2,
    Copy,
    Sparkles,
    Settings,
    MoreHorizontal,
    Wand2,
    Send,
    Briefcase,
    Bot,
    History,
    Search,
    Brain
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const CONCEPTS = [
    { source: "Trust", target: "Fiducie / Séquestre", context: "Common Law to OHADA", impact: "Équivalent contractuel de gestion d'actifs." },
    { source: "Estoppel", target: "Principe de Non-Contradiction", context: "Common Law to Civil Law", impact: "Interdiction de se contredire au détriment d'autrui." },
    { source: "Due Diligence", target: "Audits de Conformité / Raisonnable Diligence", context: "Business Law", impact: "Obligation de moyens et de vérification." },
]

export default function LegalBridgePage() {
    const [isTranslating, setIsTranslating] = useState(false)
    const [translationDone, setTranslationDone] = useState(false)

    const handleTranslate = () => {
        setIsTranslating(true)
        setTranslationDone(false)
        setTimeout(() => {
            setIsTranslating(false)
            setTranslationDone(true)
        }, 2500)
    }

    return (
        <div className="p-8 space-y-8 bg-white min-h-screen text-slate-900">

            {/* Header: Linguistic High-Tech Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200 ring-4 ring-white">
                        <Languages className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Trans<span className="text-indigo-600">Legal</span> Bridge</h1>
                        <p className="text-slate-500 font-medium italic">Traduction Conceptuelle Contextuelle : Common Law ↔ Droit OHADA.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 rounded-xl px-6 font-black text-xs tracking-widest uppercase">
                        <History className="h-4 w-4 mr-2" /> MÉMOIRE DE TRADUCTION
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left: Input Selection & Source (5 columns) */}
                <div className="xl:col-span-12 lg:col-span-5 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Source Side */}
                        <Card className="bg-slate-50 border-slate-200 shadow-xl rounded-[3rem] p-10 space-y-8 relative overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <Badge className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-lg border-none uppercase text-[8px] tracking-[0.2em]">Source System: Common Law</Badge>
                                <Globe className="h-5 w-5 text-slate-300" />
                            </div>

                            <div className="space-y-4 flex-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saisir le texte ou concept juridique</label>
                                <textarea
                                    className="w-full h-48 bg-white border border-slate-200 rounded-[2rem] p-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none shadow-inner"
                                    placeholder="Paste contract clause or legal term (e.g. 'The parties agree to the equitable distribution of assets...')"
                                />
                            </div>

                            <Button
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="w-full h-18 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-indigo-200 uppercase tracking-[0.2em] flex gap-4 hover:bg-indigo-700 transition-all border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1"
                            >
                                {isTranslating ? (
                                    <><div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> PONTAGE CONCEPTUEL...</>
                                ) : (
                                    <><Zap className="h-6 w-6 fill-white" /> TRADUIRE LE CONCEPT</>
                                )}
                            </Button>

                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <BookOpen className="h-24 w-24" />
                            </div>
                        </Card>

                        {/* Target Side (Output) */}
                        <Card className="bg-white border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[3rem] p-10 space-y-8 relative overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-4 text-indigo-600">
                                <Badge className="bg-indigo-100 text-indigo-600 font-black px-4 py-1.5 rounded-lg border-none uppercase text-[8px] tracking-[0.2em]">Target System: OHADA / Civil Law</Badge>
                                <Sparkles className="h-5 w-5" />
                            </div>

                            <div className="flex-1 space-y-4">
                                {isTranslating ? (
                                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                                        <Brain className="h-16 w-16 text-indigo-100 animate-pulse" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyse des équivalences textuelles...</p>
                                    </div>
                                ) : translationDone ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-between">
                                        <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 italic font-medium text-slate-800 leading-relaxed text-sm shadow-inner">
                                            "Les parties conviennent du partage équitable des actifs immobiliers conformément aux dispositions de l&apos;Acte Uniforme OHADA portant organisation des sûretés..."
                                        </div>
                                        <div className="flex gap-3 pt-6 border-t border-slate-100">
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"><Copy className="h-4 w-4 mr-2" /> Copier</Button>
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"><FileText className="h-4 w-4 mr-2" /> Exporter Doc</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
                                        <Languages className="h-24 w-24" />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Conceptual Memory & Intelligence (Full width below) */}
                <div className="xl:col-span-12 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Zap className="h-6 w-6 text-amber-500" />
                        Intelligence Contextuelle LexBridge
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CONCEPTS.map((c, i) => (
                            <Card key={i} className="bg-slate-50 border-slate-200 rounded-[2.5rem] p-8 space-y-6 group hover:bg-white hover:shadow-2xl transition-all cursor-pointer">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                                    <div className="text-center flex-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Common Law</p>
                                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">{c.source}</p>
                                    </div>
                                    <ArrowLeftRight className="h-4 w-4 text-slate-300 mx-4" />
                                    <div className="text-center flex-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Civil Law</p>
                                        <p className="font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase italic">{c.target}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.context}</p>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                                        "{c.impact}"
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-white text-slate-400 border-slate-100 font-black text-[8px] uppercase">OHADA</Badge>
                                    <Badge className="bg-white text-slate-400 border-slate-100 font-black text-[8px] uppercase">CONCEPTUAL FIX</Badge>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="p-10 bg-indigo-900 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
                            <div className="md:col-span-3 space-y-6">
                                <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Moteur de Cohérence Conceptuelle 3.0</h4>
                                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                                    Notre IA ne traduit pas des mots, elle traduit des **systèmes juridiques**. Elle garantit que vos contrats internationaux conservent la même force exécutoire dans la zone OHADA qu'en juridiction de Common Law.
                                </p>
                                <div className="flex gap-4">
                                    <Badge className="bg-white/20 text-white border-none font-black px-4 py-1 text-[9px] uppercase tracking-widest italic flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3" /> Audité par Experts CCJA
                                    </Badge>
                                    <Badge className="bg-white/20 text-white border-none font-black px-4 py-1 text-[9px] uppercase tracking-widest italic flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3" /> NLP Juridique Avancé
                                    </Badge>
                                </div>
                            </div>
                            <div className="md:col-span-1 text-center md:text-right">
                                <Button className="h-16 w-16 bg-white text-indigo-900 rounded-full shadow-2xl hover:scale-110 transition-transform">
                                    <ArrowLeftRight className="h-8 w-8" />
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-[-50px] left-[-50px] h-64 w-64 bg-white/5 rounded-full blur-[100px]" />
                        <Bot className="absolute bottom-[-30px] right-[-30px] h-48 w-48 text-white/5 rotate-12" />
                    </Card>
                </div>

            </div>
        </div>
    )
}
