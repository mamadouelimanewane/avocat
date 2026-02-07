"use client"

import { useState, useEffect } from "react"
import {
    Rss,
    AlertCircle,
    CheckCircle2,
    ShieldAlert,
    ExternalLink,
    Search,
    Filter,
    ArrowUpRight,
    CircleDot,
    Sparkles,
    Scale,
    Gavel,
    Briefcase,
    Zap,
    Download,
    Eye,
    Globe,
    BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const ALERTS = [
    {
        id: 1,
        title: "Nouvel Arrêt CCJA : Bail Commercial",
        source: "CCJA - Côte d'Ivoire",
        date: "Il y a 2 heures",
        severity: "CRITIQUE",
        impact: "Dossier #402 (Banque Atlantique)",
        description: "Précision sur les délais de renouvellement tacite. L'arrêt infirme la position précédente du TGI Dakar.",
        tags: ["OHADA", "IMMOBILIER", "CONTRAT"]
    },
    {
        id: 2,
        title: "Réforme du Code de Procédure Civile",
        source: "Journal Officiel (JO)",
        date: "Ce matin",
        severity: "MOYEN",
        impact: "Impact Global (12 dossiers)",
        description: "Dématérialisation obligatoire des actes de greffe à compter du 1er Février 2026.",
        tags: ["SÉNÉGAL", "PROCÉDURE", "DIGITAL"]
    },
    {
        id: 3,
        title: "Jurisprudence Sociale : Licenciement",
        source: "Cour Suprême Sénégal",
        date: "24 Jan 2026",
        severity: "FAIBLE",
        impact: "Dossier #115 (M. Fall)",
        description: "Requalification systématique des CDD successifs en CDI après 2 renouvellements sans pause.",
        tags: ["TRAVAIL", "INDEMNITÉS"]
    }
]

// Mock Crawler Results
type CrawledDoc = {
    id: string
    title: string
    source: string
    url: string
    date: string
    status: 'new' | 'added' | 'formatted'
}

const CRAWLER_RESULTS_MOCK: CrawledDoc[] = [
    {
        id: 'c1',
        title: "Arrêt n° 22/2026 : Nullité des Saisies",
        source: "Juricaf (Benin)",
        url: "https://juricaf.org/arret/benin-2026-nullite",
        date: "04 Fév 2026",
        status: 'new'
    },
    // ...
]
// ...
export default function LexisVeillePage() {
    const [mounted, setMounted] = useState(false)
    const [scannedSources, setScannedSources] = useState(38)
    const [isCrawling, setIsCrawling] = useState(false)
    const [crawledDocs, setCrawledDocs] = useState<CrawledDoc[]>(CRAWLER_RESULTS_MOCK)

    useEffect(() => {
        setMounted(true)
    }, [])

    const startCrawler = () => {
        setIsCrawling(true)
        const interval = setInterval(() => {
            setScannedSources(prev => {
                if (prev >= 45) {
                    clearInterval(interval)
                    setIsCrawling(false)
                    return 45
                }
                return prev + 1
            })
        }, 300)
    }

    const formatAndDownload = (doc: CrawledDoc) => {
        setCrawledDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'formatted' } : d))
    }

    const validateAndAdd = (docId: string) => {
        if (confirm("Confirmez-vous l'exactitude juridique de ce document avant intégration à la base 'Jurisprudence' ?")) {
            setCrawledDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'added' } : d))
        }
    }

    const addToLibrary = (docId: string) => {
        setCrawledDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'added' } : d))
    }

    if (!mounted) return null

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100 rounded-[3rem]">

            {/* Glassmorphism Header */}
            <div className="relative p-10 rounded-[3rem] border border-white/10 bg-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Rss className="h-32 w-32 text-amber-500" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50 px-3 py-1 font-black tracking-widest text-[10px]">
                                <CircleDot className="h-3 w-3 mr-2 animate-pulse" />
                                SCAN LIVE ACTIVÉ
                            </Badge>
                            <span className="text-slate-500 text-xs font-bold font-mono">LEX-ID: SENTINEL-2026-X</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            Sentinelle <span className="text-amber-500">Crawler</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-light max-w-2xl">
                            Le Crawler autonome scanne le web juridique (Juricaf, Ohada.com, JO) pour enrichir votre bibliothèque automatiquement.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] w-full md:w-auto">
                        <div className="flex items-center justify-between mb-4 gap-8">
                            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Sources Scannées</p>
                            <span className="text-2xl font-black text-amber-500">{scannedSources}</span>
                        </div>
                        <Progress value={isCrawling ? 100 : (scannedSources / 45) * 100} className={cn("h-2 w-48", isCrawling ? "animate-pulse bg-amber-500/20" : "bg-white/5")} />
                        <Button
                            onClick={startCrawler}
                            disabled={isCrawling}
                            className={cn(
                                "mt-4 w-full font-bold transition-all",
                                isCrawling ? "bg-amber-500/20 text-amber-500" : "bg-amber-500 text-slate-900 hover:bg-amber-400"
                            )}>
                            {isCrawling ? <><Globe className="mr-2 h-4 w-4 animate-spin" /> SCAN EN COURS...</> : <><Globe className="mr-2 h-4 w-4" /> LANCER SCAN MANUEL</>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Active Alerts - Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-amber-500" />
                            Alertes & Découvertes Crawler
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full"><Search className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full"><Filter className="h-5 w-5" /></Button>
                        </div>
                    </div>

                    {/* Crawler Results Section */}
                    {crawledDocs.length > 0 && (
                        <div className="bg-slate-900/50 rounded-[2rem] p-6 border border-white/5 mb-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-emerald-500" /> Documents Découverts sur le Web
                            </h3>
                            <div className="space-y-3">
                                {crawledDocs.map((doc) => (
                                    <div key={doc.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                                WW
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">{doc.source}</span>
                                                    <span className="text-[10px] text-slate-500">{doc.date}</span>
                                                </div>
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="font-bold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-1 block mt-1">
                                                    {doc.title}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc.status === 'new' ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                                                    onClick={() => addToLibrary(doc.id)}
                                                >
                                                    <Download className="h-3 w-3 mr-2" /> AJOUTER BIBLIO
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 cursor-default font-bold text-xs">
                                                    <CheckCircle2 className="h-3 w-3 mr-2" /> AJOUTÉ
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="space-y-4">
                        {ALERTS.map((alert) => (
                            <Card key={alert.id} className="bg-white/5 border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all group overflow-hidden">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    {/* Severity Indicator */}
                                    <div className={cn(
                                        "w-2 shrink-0 h-full absolute md:static top-0 left-0",
                                        alert.severity === 'CRITIQUE' ? 'bg-red-500' :
                                            alert.severity === 'MOYEN' ? 'bg-amber-500' : 'bg-emerald-500'
                                    )} />

                                    <div className="p-8 flex-1 space-y-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <span>{alert.source}</span>
                                                    <span>•</span>
                                                    <span>{alert.date}</span>
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">
                                                    {alert.title}
                                                </h3>
                                            </div>
                                            <Badge className={cn(
                                                "shadow-none border-none px-3 py-1 text-[10px] font-black rounded-lg",
                                                alert.severity === 'CRITIQUE' ? 'bg-red-500/10 text-red-500' :
                                                    alert.severity === 'MOYEN' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                            )}>
                                                {alert.severity}
                                            </Badge>
                                        </div>

                                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                                            {alert.description}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
                                                <ShieldAlert className="h-4 w-4 text-amber-500" />
                                                <span className="text-xs font-bold text-amber-500 uppercase tracking-tight">IMPACT: {alert.impact}</span>
                                            </div>

                                            <div className="flex gap-2">
                                                {alert.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] font-black text-slate-500 border border-white/5 px-2 py-1 rounded-md">#{tag}</span>
                                                ))}
                                            </div>

                                            <Button size="sm" variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/10 rounded-xl text-[10px] font-black">
                                                ANALYSER IMPACT <ArrowUpRight className="h-3 w-3 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Contextual Actions */}
                <div className="space-y-8">
                    <Card className="bg-indigo-600 border-none rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="p-3 bg-white/20 rounded-2xl w-fit">
                                <Zap className="h-6 w-6 fill-white" />
                            </div>
                            <h3 className="text-2xl font-black leading-tight italic">
                                Sémantique Proactive
                            </h3>
                            <p className="text-indigo-100 text-sm font-light leading-relaxed">
                                L'intelligence Nexus a identifié une corrélation sémantique entre l'Arrêt #023 et vos conclusions dans l'affaire SOCIM.
                            </p>
                            <Button className="w-full h-12 bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl shadow-xl">
                                COMPARER AVEC LE DOSSIER
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-[40px]" />
                    </Card>

                    <Card className="bg-slate-900 border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                            <Scale className="h-4 w-4" /> Analyse Dynamique
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Jurisprudence OHADA</span>
                                    <span className="text-emerald-500">+12%</span>
                                </div>
                                <Progress value={78} className="h-1 bg-white/5" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Droit du Travail</span>
                                    <span className="text-red-500">-5%</span>
                                </div>
                                <Progress value={45} className="h-1 bg-white/5" />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-black italic text-slate-500">
                                    "La tendance actuelle montre un durcissement des conditions de validité des cautions personnelles."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center font-black text-slate-900 text-xs shadow-lg shadow-amber-500/20">
                                        AI
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold">Insight LexIA</p>
                                        <p className="text-slate-500">Analysé sur 300 arrêts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}
