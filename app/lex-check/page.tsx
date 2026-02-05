"use client"

import { useState } from "react"
import {
    FileText,
    Search,
    CheckCircle2,
    AlertTriangle,
    Zap,
    ShieldCheck,
    Gavel,
    History,
    ChevronRight,
    Loader2,
    Copy,
    ArrowRight,
    Maximize2,
    ListCheck,
    Languages,
    BadgeCheck,
    XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

// Mock Data for Verification Results
const MOCK_ISSUES = [
    { id: 1, type: 'CRITICAL', title: 'Clause de Juridiction manquante', desc: 'Aucun tribunal compétent n&apos;est spécifié pour le règlement des litiges.', suggestion: 'Ajouter une clause de renvoi au Tribunal de Commerce de Dakar.' },
    { id: 2, type: 'WARNING', title: 'Terminologie inconsistante', desc: 'Le terme "Prestataire" est utilisé à 8 reprises, alors que "Cédant" apparaît soudainement à l&apos;article 6.', suggestion: 'Harmoniser vers "Prestataire".' },
    { id: 3, type: 'INFO', title: 'Optimisation de la clause foncière', desc: 'La nouvelle réforme de 2025 sur le bail commercial n&apos;est pas explicitement citée.', suggestion: 'Mettre à jour la référence légale.' },
]

export default function LexisCreatePlusPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [content, setContent] = useState("")

    const startAnalysis = () => {
        setIsAnalyzing(true)
        setShowResults(false)
        setTimeout(() => {
            setIsAnalyzing(false)
            setShowResults(true)
        }, 2500)
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans">

            {/* Lexis Create Style Header: Functional & High-Tech */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-100 ring-4 ring-white">
                        <BadgeCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexCheck Pro</h1>
                        <p className="text-slate-500 font-medium italic">Audit de rédaction & Conformité IA (Inspiré Lexis Create Plus).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white font-bold rounded-2xl shadow-sm">
                        <History className="h-4 w-4 mr-2" /> Analyses Récentes
                    </Button>
                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-xl font-bold rounded-2xl">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau Document
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Main Editor / Input (8 columns) */}
                <div className="xl:col-span-8 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl bg-white overflow-hidden flex flex-col h-[750px]">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-rose-50 text-rose-600 font-black text-[9px] px-3 py-1 border-none shadow-sm uppercase tracking-widest">MODE RÉDACTION</Badge>
                                <span className="text-xs font-bold text-slate-300">|</span>
                                <span className="text-xs font-bold text-slate-400 italic">"Pacte d&apos;Associés - AfricaTech.docx"</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2 mr-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400"><Maximize2 className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Collez votre projet d&apos;acte ici..."
                            className="flex-1 p-12 bg-[#fafbfc] font-serif text-lg leading-relaxed text-slate-800 focus:outline-none resize-none placeholder:text-slate-300"
                        />

                        <div className="p-8 bg-white border-t border-slate-50 flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Languages className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">FR (OHADA)</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Gavel className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Sénégal / UEMOA</span>
                                </div>
                            </div>
                            <Button
                                onClick={startAnalysis}
                                disabled={isAnalyzing || !content}
                                className="h-14 px-12 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-rose-100 gap-3 text-lg"
                            >
                                {isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
                                Lancer l&apos;Audit IA
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Audit Sidebar (4 columns) */}
                <div className="xl:col-span-4 space-y-6">
                    <Card className="rounded-[3rem] border-slate-100 shadow-xl bg-white overflow-hidden flex flex-col h-[750px]">
                        <CardHeader className="bg-slate-900 text-white p-8">
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-sm font-black flex items-center gap-2 tracking-widest uppercase">
                                    <ListCheck className="h-5 w-5 text-rose-500" />
                                    Rapport de Conformité
                                </CardTitle>
                                {showResults && (
                                    <Badge className="bg-rose-500 text-white border-none font-black text-[10px]">3 POINTS À VOIR</Badge>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">Analyse sémantique et juridique temps réel.</p>
                        </CardHeader>

                        <ScrollArea className="flex-1 bg-white">
                            <div className="p-8 space-y-6">
                                {!showResults && !isAnalyzing && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                                        <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border border-slate-100">
                                            <FileText className="h-10 w-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black text-slate-900">En attente d&apos;analyse</h4>
                                            <p className="text-xs text-slate-500 max-w-[240px]">Collez un texte et cliquez sur "Audit IA" pour vérifier la conformité de votre acte.</p>
                                        </div>
                                    </div>
                                )}

                                {isAnalyzing && (
                                    <div className="space-y-8 py-20">
                                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse" />
                                                <Loader2 className="h-16 w-16 animate-spin text-rose-600 relative z-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Analyse Sémantique</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Moteur LexCheck-V4.2 • GPT-4o-Turbo</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 px-4">
                                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1">
                                                <span>EXTRACTION DES CLAUSES</span>
                                                <span>85%</span>
                                            </div>
                                            <Progress value={85} className="h-1 bg-slate-100" />
                                        </div>
                                    </div>
                                )}

                                {showResults && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                        {MOCK_ISSUES.map((issue) => (
                                            <div key={issue.id} className="group cursor-pointer">
                                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 transition-all space-y-4 shadow-sm group-hover:shadow-md">
                                                    <div className="flex justify-between items-start">
                                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border ${issue.type === 'CRITICAL' ? 'bg-rose-100 text-rose-600 border-rose-200' :
                                                                issue.type === 'WARNING' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                                                    'bg-blue-100 text-blue-600 border-blue-200'
                                                            }`}>
                                                            {issue.type === 'CRITICAL' ? <XCircle className="h-5 w-5" /> :
                                                                issue.type === 'WARNING' ? <AlertTriangle className="h-5 w-5" /> :
                                                                    <CheckCircle2 className="h-5 w-5" />}
                                                        </div>
                                                        <Badge className="bg-white text-slate-400 border border-slate-100 text-[8px] font-black uppercase tracking-tighter">ID: #{issue.id}09</Badge>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-700 transition-colors uppercase leading-tight">{issue.title}</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed">{issue.desc}</p>
                                                    </div>
                                                    <div className="pt-4 mt-4 border-t border-slate-200/50">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <Zap className="h-3 w-3 text-amber-500" /> Proposition IA
                                                        </p>
                                                        <p className="text-xs font-bold text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100 shadow-inner">
                                                            "{issue.suggestion}"
                                                        </p>
                                                        <div className="mt-3 flex gap-2">
                                                            <Button size="sm" className="h-7 px-3 text-[10px] font-black bg-slate-900 text-white rounded-lg">Appliquer</Button>
                                                            <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-black text-slate-400 rounded-lg">Ignorer</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform">
                                    <ShieldCheck className="h-12 w-12" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Score Final
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black">{showResults ? "65" : "0"}</span>
                                        <span className="text-xl font-bold opacity-60">/ 100</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-indigo-100 font-bold leading-tight">
                                        Ce document nécessite des corrections majeures. La validité OHADA est compromise à 35%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
