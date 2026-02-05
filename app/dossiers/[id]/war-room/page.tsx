"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Shield,
    Sword,
    Target,
    Zap,
    TrendingUp,
    AlertTriangle,
    Brain,
    Network,
    ArrowLeft,
    Maximize2,
    Activity,
    Info,
    Gavel,
    MessageSquare,
    FileSearch,
    ChevronRight,
    Play,
    RefreshCw
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// --- Types ---
interface Argument {
    id: string
    title: string
    strength: number // 0 to 100
    side: 'PRO' | 'CONTRA'
    impact: 'HIGH' | 'MEDIUM' | 'LOW'
    jurisprudence?: string
}

interface Connection {
    id: string
    source: string
    target: string
    label: string
}

interface Node {
    id: string
    label: string
    type: 'DOC' | 'LAW' | 'PARTY' | 'EVIDENCE'
    x: number
    y: number
}

// --- Main Page Component ---
export default function LexVisionWarRoom() {
    const params = useParams()
    const id = params.id as string

    const [activeTab, setActiveTab] = useState<'STRATEGY' | 'ORACLE' | 'DOJO'>('STRATEGY')
    const [isScanning, setIsScanning] = useState(false)
    const [successProbability, setSuccessProbability] = useState(68)

    // Simulation of scanning
    useEffect(() => {
        setIsScanning(true)
        const timer = setTimeout(() => setIsScanning(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* --- Top Navigation --- */}
            <header className="min-h-[5rem] md:h-20 border-b border-indigo-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-0 gap-4">
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <Link href={`/dossiers/${id}`}>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <ArrowLeft className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Retour Dossier</span>
                        </Button>
                    </Link>
                    <div className="h-8 w-px bg-slate-800 hidden md:block" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[8px] md:text-[10px] h-4 md:h-5">DOSSIER-{id.substring(0, 6).toUpperCase()}</Badge>
                            <span className="text-[10px] md:text-sm font-bold tracking-tight text-slate-300">LEXVISION WAR ROOM</span>
                        </div>
                        <h1 className="text-sm md:text-xl font-black italic tracking-tighter">STRATÉGIE OFFENSIVE V9.1</h1>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">État du Réseau</span>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] md:text-xs font-mono text-emerald-500">QUANTUM_LINK_ACTIVE</span>
                        </div>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 md:px-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-xs h-9 md:h-10">
                        <Maximize2 className="h-3 w-3 md:h-4 md:w-4 md:mr-2" /> <span className="hidden md:inline">Live Broadcast</span>
                    </Button>
                </div>
            </header>

            {/* --- Main Dashboard --- */}
            <main className="p-4 md:p-8 grid grid-cols-12 gap-6 md:gap-8 pb-20">

                {/* --- Left Sidebar: Navigation & Oracle Stats --- */}
                <aside className="col-span-12 lg:col-span-3 space-y-6">
                    {/* Oracle Mini-Card */}
                    <Card className="bg-slate-900/50 border-indigo-500/20 p-6 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="h-20 w-20 text-indigo-500" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                            <Activity className="h-3 w-3" /> LexOracle Verdict
                        </h3>
                        <div className="text-5xl font-black text-white italic mb-2 tracking-tighter">
                            {successProbability}%
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Probabilité de succès calculée sur 42 arrêts CCJA similaires.
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Solidité des preuves</span>
                                <span className="text-white">82%</span>
                            </div>
                            <Progress value={82} className="h-1.5 bg-slate-800" />

                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Risque de procédure</span>
                                <span className="text-rose-500">18%</span>
                            </div>
                            <Progress value={18} className="h-1.5 bg-slate-800" />
                        </div>
                    </Card>

                    {/* Mode Selector */}
                    <div className="bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                        <button
                            onClick={() => setActiveTab('STRATEGY')}
                            className={`flex items-center gap-3 p-3 md:p-4 rounded-xl text-[10px] md:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${activeTab === 'STRATEGY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <Network className="h-4 w-4" /> <span className="hidden sm:inline">LexDiscovery</span><span className="sm:hidden">Graph</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ORACLE')}
                            className={`flex items-center gap-3 p-3 md:p-4 rounded-xl text-[10px] md:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${activeTab === 'ORACLE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <Target className="h-4 w-4" /> Oracle
                        </button>
                        <button
                            onClick={() => setActiveTab('DOJO')}
                            className={`flex items-center gap-3 p-3 md:p-4 rounded-xl text-[10px] md:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${activeTab === 'DOJO' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <Sword className="h-4 w-4" /> <span className="hidden sm:inline">LexDojo (Sparring)</span><span className="sm:hidden">Dojo</span>
                        </button>
                    </div>

                    {/* Quick Alerts */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Anomalies Détectées (3)</h4>
                        {[
                            { color: 'rose', title: 'Contradiction Témoignage', desc: 'Le témoin A contredit la pièce n°4.', icon: AlertTriangle },
                            { color: 'amber', title: 'Échéance Expertise', desc: 'Rapport attendu dans 48h.', icon: Clock },
                            { color: 'indigo', title: 'Nouvel Arrêt Foncier', desc: 'Jurisprudence CCJA v2025 dispo.', icon: Info },
                        ].map((alert, i) => (
                            <div key={i} className={`p-4 bg-${alert.color}-500/5 border border-${alert.color}-500/10 rounded-2xl flex gap-3 hover:bg-${alert.color}-500/10 transition-colors`}>
                                <div className={`p-2 bg-${alert.color}-500/20 rounded-lg h-fit`}>
                                    <alert.icon className={`h-4 w-4 text-${alert.color}-500`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{alert.title}</p>
                                    <p className="text-[10px] text-slate-400 leading-tight mt-1">{alert.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* --- Center: Visual Workspace --- */}
                <section className="col-span-12 lg:col-span-9 space-y-8">

                    <AnimatePresence mode="wait">
                        {activeTab === 'STRATEGY' && (
                            <motion.div
                                key="strategy"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="min-h-[500px] h-[60vh] lg:h-[750px] relative rounded-3xl overflow-hidden border border-indigo-500/10 bg-slate-900/30 backdrop-blur-xs"
                            >
                                {/* Background Grid Animation */}
                                <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                                <div className="absolute top-6 left-6 z-10">
                                    <h2 className="text-2xl font-black italic">LEXDISCOVERY CANVAS</h2>
                                    <p className="text-xs text-slate-500 font-mono tracking-wider">MAPPING DES SYNERGIES JURIDIQUES</p>
                                </div>

                                <div className="absolute top-6 right-6 z-10 flex gap-2">
                                    <Button size="sm" variant="outline" className="bg-slate-950/50 border-white/5 h-8 text-[10px] font-bold">MODE : ANALYSE DES LIENS</Button>
                                    <Button size="sm" variant="outline" className="bg-indigo-600 border-none h-8 text-[10px] font-bold text-white">GENÉRER GRAPH AUTO</Button>
                                </div>

                                {/* Placeholder for Interactive Graph */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-full relative p-20">
                                        {/* Mock Nodes and Connections */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-32 h-32 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center p-4 text-center group cursor-pointer hover:bg-indigo-500/40 transition-all shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                                                <span className="text-xs font-black uppercase text-white">Objet du Litige</span>
                                                <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-20" />
                                            </div>
                                        </div>

                                        <div className="absolute top-1/4 left-1/4">
                                            <Card className="bg-slate-950/80 border-slate-700 p-4 border-l-4 border-l-rose-600 w-48 shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer">
                                                <Badge className="bg-rose-500/10 text-rose-500 mb-2">EVIDENCE</Badge>
                                                <p className="text-[10px] font-bold text-white">Relevé Bancaire #002</p>
                                            </Card>
                                        </div>

                                        <div className="absolute bottom-1/4 right-1/4">
                                            <Card className="bg-slate-950/80 border-slate-700 p-4 border-l-4 border-l-emerald-600 w-48 shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 mb-2">LOI</Badge>
                                                <p className="text-[10px] font-bold text-white">Art 1134 Code Civil</p>
                                            </Card>
                                        </div>

                                        <div className="absolute top-1/3 right-1/4">
                                            <Card className="bg-slate-950/80 border-slate-700 p-4 border-l-4 border-l-indigo-600 w-48 shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer">
                                                <Badge className="bg-indigo-500/10 text-indigo-500 mb-2">PARTY</Badge>
                                                <p className="text-[10px] font-bold text-white">Mme Aminata Fall</p>
                                            </Card>
                                        </div>

                                        {/* Minimalist SVG lines representing connections */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="rgba(244,63,94,0.3)" strokeWidth="1" strokeDasharray="4" />
                                            <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4" />
                                            <line x1="75%" y1="33%" x2="50%" y2="50%" stroke="rgba(99,102,241,0.3)" strokeWidth="1" strokeDasharray="4" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Bottom Info Bar */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-950/50 backdrop-blur-md flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Documents Critiques</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Points de Droit Validés</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-mono text-indigo-400">SYNC_TIME: 2026-02-05_19:07:22 | HASH: 0x82f...a1</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ORACLE' && (
                            <motion.div
                                key="oracle"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Offensive Arguments */}
                                    <Card className="bg-slate-900/40 border-slate-800 p-8 shadow-2xl relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-black italic flex items-center gap-3">
                                                <Target className="h-5 w-5 text-emerald-500" /> VECTEURS D'ATTAQUE
                                            </h3>
                                            <Badge className="bg-emerald-500 text-slate-950 font-bold">AVANTAGEUX</Badge>
                                        </div>

                                        <div className="space-y-6">
                                            {[
                                                { title: "Défaut de notification préalable", score: 94, law: "AUPSRVE Art. 12" },
                                                { title: "Irrégularité du mandat social", score: 88, law: "AUSGIE Art. 450" },
                                                { title: "Forclusion du délai d'appel", score: 72, law: "Code Proc. Civ." }
                                            ].map((arg, i) => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{arg.title}</span>
                                                        <span className="text-xs font-mono text-emerald-500">{arg.score}%</span>
                                                    </div>
                                                    <Progress value={arg.score} className="h-1 bg-slate-800 h-1.5" indicatorClassName="bg-emerald-500" />
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <FileSearch className="h-3 w-3 text-slate-600" />
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">{arg.law}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Defensive Vulnerabilities */}
                                    <Card className="bg-slate-900/40 border-slate-800 p-8 shadow-2xl relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-black italic flex items-center gap-3">
                                                <Shield className="h-5 w-5 text-rose-500" /> VULNÉRABILITÉS DÉFENSIVES
                                            </h3>
                                            <Badge className="bg-rose-500 text-white font-bold">CRITIQUE</Badge>
                                        </div>

                                        <div className="space-y-6">
                                            {[
                                                { title: "Signature électronique non certifiée", risk: 65, status: "CORRIGER D'URGENCE" },
                                                { title: "Manque de preuve de réception", risk: 42, status: "INVESTIGUER" },
                                                { title: "Divergence de date acte/paiement", risk: 28, status: "RISQUE MODÉRÉ" }
                                            ].map((arg, i) => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{arg.title}</span>
                                                        <span className="text-xs font-mono text-rose-500">INDICE DE RISQUE : {arg.risk}</span>
                                                    </div>
                                                    <Progress value={arg.risk} className="h-1 bg-slate-800 h-1.5" indicatorClassName="bg-rose-500" />
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <AlertTriangle className="h-3 w-3 text-rose-500" />
                                                            <span className="text-[10px] text-rose-400 font-bold uppercase">{arg.status}</span>
                                                        </div>
                                                        <Button variant="link" className="text-[10px] text-slate-500 h-fit p-0">Résoudre AI →</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>

                                {/* AI Recommendation Panel */}
                                <Card className="bg-gradient-to-r from-indigo-900/60 to-slate-900/60 border-indigo-500/30 p-8 flex items-center gap-8 relative overflow-hidden">
                                    <div className="absolute -right-20 -bottom-20 opacity-10">
                                        <Brain className="h-64 w-64 text-white" />
                                    </div>
                                    <div className="h-20 w-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                                        <Brain className="h-10 w-10 text-indigo-400" />
                                    </div>
                                    <div className="space-y-2 relative z-10">
                                        <h4 className="text-lg font-black italic text-white uppercase tracking-tight">Recommandation Stratégique LexAI</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                                            "La partie adverse semble privilégier une tactique de forclusion. Je suggère d'agir par
                                            <span className="text-emerald-400 font-bold"> référé-provision</span> avant le 12 Février pour sécuriser les fonds,
                                            tout en soulevant l'exception de nullité du PV d'assemblée générale."
                                        </p>
                                    </div>
                                    <Button className="ml-auto bg-white text-slate-950 font-black px-8 py-6 rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shrink-0">
                                        MÉMO STRATÉGIQUE PDF
                                    </Button>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'DOJO' && (
                            <motion.div
                                key="dojo"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="min-h-[600px] h-auto lg:h-[700px] grid grid-cols-12 gap-6 md:gap-8"
                            >
                                {/* Dojo Simulation Area */}
                                <Card className="col-span-12 lg:col-span-8 bg-slate-950 border-slate-800 relative flex flex-col overflow-hidden">
                                    <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                                            <div>
                                                <h3 className="text-sm font-black italic uppercase tracking-widest text-white">SIMULATION DE JUGEMENT EN COURS</h3>
                                                <p className="text-[10px] text-slate-500 font-mono">ADVERSAIRE IA : "MÉTHODE_SOOCRATE_v4"</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-slate-400 font-mono text-[10px]">ROUND 1/3</Badge>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white"><RefreshCw className="h-4 w-4" /></Button>
                                        </div>
                                    </div>

                                    {/* Conversation Display */}
                                    <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.05)_0%,_transparent_70%)]">

                                        {/* AI Question (Judge) */}
                                        <div className="flex gap-4 items-start max-w-2xl">
                                            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 shrink-0 shadow-lg">
                                                <Gavel className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <div className="bg-slate-900/60 p-6 rounded-2xl rounded-tl-none border border-indigo-500/20 backdrop-blur-md">
                                                <p className="text-xs font-black text-indigo-400 uppercase mb-2 tracking-widest">Le Juge (Simulation IA)</p>
                                                <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                                                    "Maître, vous invoquez l'article 1134, mais comment répondez-vous à l'argument de la partie adverse concernant la prescription quadriennale déjà entamée lors de votre première mise en demeure ?"
                                                </p>
                                            </div>
                                        </div>

                                        {/* User Response Area (Mockup) */}
                                        <div className="flex gap-4 items-start justify-end max-w-2xl ml-auto">
                                            <div className="bg-indigo-600 p-6 rounded-2xl rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.3)] border border-indigo-400/20">
                                                <p className="text-xs font-black text-indigo-200 uppercase mb-2 tracking-widest text-right">Votre Réponse (Saisie Vocale ou Texte)</p>
                                                <p className="text-sm text-white leading-relaxed font-bold">
                                                    "Monsieur le Président, la prescription a été interrompue par l'acte extrajudiciaire du 14 Mars 2024, qui constitue une reconnaissance non équivoque de dette par correspondance."
                                                </p>
                                            </div>
                                            <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Real-time Analysis */}
                                        <div className="flex justify-center">
                                            <div className="bg-slate-900 border border-emerald-500/30 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Analyse IA : Argument Solide (+14% Impact)</span>
                                                <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Footer */}
                                    <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex gap-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Saisissez votre argument pour tester sa solidité judidique..."
                                                className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                                            />
                                            <div className="absolute right-3 top-3 flex gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-400 rounded-lg"><Activity className="h-4 w-4" /></Button>
                                                <Button size="icon" className="bg-indigo-600 h-8 w-8"><Play className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                        <Button className="bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 px-6 rounded-xl flex gap-2">
                                            <Brain className="h-4 w-4" /> Analyse Profonde
                                        </Button>
                                    </div>
                                </Card>

                                {/* Sidebar: Score & History */}
                                <div className="col-span-12 lg:col-span-4 space-y-6">
                                    <Card className="bg-slate-900/40 border-slate-800 p-6 shadow-xl">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Statistiques de Session</h4>
                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold text-slate-300">Niveau de Conviction</span>
                                                    <span className="text-xl font-mono text-white">OR</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '85%' }}
                                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold text-slate-300">Précision Juridique</span>
                                                    <span className="text-xl font-mono text-emerald-500">A+</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '92%' }}
                                                        className="h-full bg-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="h-px bg-slate-800" />

                                            <div>
                                                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">CONTRÉ LE PLUS PROBABLE (ADVERSAIRE)</h5>
                                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                                    <p className="text-[11px] text-rose-200 font-medium italic">
                                                        "L'adversaire risque d'invoquer la nullité de forme de l'assignation en se basant sur l'absence de mention du siège social."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="bg-slate-900/40 border-slate-800 p-6 flex flex-col items-center text-center">
                                        <div className="h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
                                            <Sword className="h-8 w-8 text-indigo-500 opacity-50" />
                                        </div>
                                        <h4 className="text-sm font-black italic text-white uppercase">Prêt pour l'Audience ?</h4>
                                        <p className="text-[10px] text-slate-400 mt-2 mb-4 leading-relaxed">
                                            Téléchargez votre "Fiche de Plaidoirie Augmentée" générée à partir de vos meilleures réponses en simulation.
                                        </p>
                                        <Button className="w-full bg-indigo-600 text-white font-bold h-10 text-[11px]"> GÉNÉRER FICHE D'AUDIENCE</Button>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </section>
            </main>

            {/* --- Footer Status Bar --- */}
            <footer className="h-12 border-t border-indigo-500/20 bg-slate-950/90 hidden md:flex items-center justify-between px-8 text-slate-500 fixed bottom-0 w-full z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest text-emerald-500">IA_ENGINE: V9.1_STABLE</span>
                    </div>
                    <div className="h-4 w-px bg-slate-800" />
                    <span className="text-[10px] font-mono uppercase tracking-tighter">Latence: 12ms</span>
                    <span className="text-[10px] font-mono uppercase tracking-tighter">Session: QX-990-2B</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="h-1.5 w-4 bg-indigo-500/50 rounded-full" />
                        <div className="h-1.5 w-4 bg-indigo-500 rounded-full" />
                        <div className="h-1.5 w-4 bg-indigo-500/30 rounded-full" />
                    </div>
                    <span className="text-[10px] font-black italic text-slate-300">LEXVISION | POWERED BY DEEPSEEK QUANTUM</span>
                </div>
            </footer>
        </div>
    )
}

function User(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

function Clock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
