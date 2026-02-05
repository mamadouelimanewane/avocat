"use client"

import { useState, useEffect } from "react"
import {
    Radar,
    Globe,
    Building2,
    Landmark,
    ShieldAlert,
    Network,
    Zap,
    History,
    FileSearch,
    ArrowUpRight,
    MapPin,
    Activity,
    Eye,
    Fingerprint,
    Lock,
    Satellite,
    Share2,
    Download,
    Cpu,
    ExternalLink,
    AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const INTELLIGENCE_SOURCES = [
    { name: "Registres Offshore (Panama/BVI)", status: "CONNECTÉ", latency: "12ms" },
    { name: "OSINT Social Scraper", status: "ACTIF", latency: "45ms" },
    { name: "Satellite Asset Tracking", status: "VEILLE", latency: "1.2s" },
    { name: "Dark Web Leak DB", status: "SCAN", latency: "89ms" },
]

const DETECTED_CONNECTIONS = [
    { id: 1, source: "Débiteur Principal", target: "Blue Horizon Ltd (Seychelles)", relation: "UBO (Beneficiaire Effectif)", strength: 95 },
    { id: 2, source: "Blue Horizon Ltd", target: "Villa Turquoise (Marrakech)", relation: "Propriété Directe", strength: 100 },
    { id: 3, source: "Débiteur Principal", target: "Mme X (Épouse)", relation: "Transfert de fonds via prête-nom", strength: 72 },
]

export default function AssetHunterIntelligencePage() {
    const [isScanning, setIsScanning] = useState(false)
    const [scanProgress, setScanProgress] = useState(0)
    const [currentSource, setCurrentSource] = useState("")
    const [showIntelligence, setShowIntelligence] = useState(false)

    const startDeepInvestigation = () => {
        setIsScanning(true)
        setShowIntelligence(false)
        setScanProgress(0)

        const sources = ["Extraction RCCM...", "Pivotement vers Registre Dubaï...", "Scan Social Media Metadata...", "Analyse Leak Panama Papers...", "Tracking Satellite Géolocalisé..."]
        let i = 0

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsScanning(false)
                    setShowIntelligence(true)
                    return 100
                }
                if (prev % 20 === 0) {
                    setCurrentSource(sources[i])
                    i++
                }
                return prev + 1
            })
        }, 60)
    }

    return (
        <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-slate-100 selection:bg-emerald-500/30">

            {/* Intelligence Header - Mossad Style */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400 group cursor-pointer overflow-hidden">
                            <Radar className="h-12 w-12 animate-pulse group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-slate-900 border border-emerald-500 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-emerald-500 animate-spin-slow" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-2 py-0 text-[9px] font-black tracking-widest uppercase">
                                Grade: Intelligence Militaire
                            </Badge>
                            <span className="text-slate-600 text-[10px] font-mono">ID: NEXUS-HUNTER-V4</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                            Nexus <span className="text-emerald-500">Asset</span> Hunter
                        </h1>
                        <p className="text-slate-500 font-medium italic mt-1 max-w-xl text-sm leading-relaxed">
                            Système de traçage d&apos;actifs par fusion de données multimodales et analyse de réseaux d&apos;influence offshore.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl px-8 font-black text-xs tracking-widest group">
                        <Lock className="h-4 w-4 mr-3 text-emerald-500 group-hover:rotate-12 transition-transform" /> ACCÈS CRYPTÉ GPG
                    </Button>
                    <Button className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-10 font-black text-xs tracking-widest shadow-2xl shadow-emerald-900/40 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">
                        <Share2 className="h-4 w-4 mr-3" /> EXPORTER DOSSIER DE PREUVES
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left Panel: Target Profiling (4 columns) */}
                <div className="xl:col-span-4 space-y-8">
                    <Card className="bg-slate-900/50 border-white/10 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden backdrop-blur-xl">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>Cible Prioritaire</span>
                                <Fingerprint className="h-4 w-4 text-emerald-500/50" />
                            </div>
                            <div className="relative">
                                <FileSearch className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500" />
                                <input
                                    className="w-full h-18 bg-black/40 border border-white/10 rounded-3xl pl-16 pr-6 text-lg font-black text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner"
                                    placeholder="Nom du Débiteur / Société..."
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-emerald-500" /> Algorithmes de Pivotement
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {INTELLIGENCE_SOURCES.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                s.status === 'ACTIF' ? 'bg-emerald-500 animate-pulse' :
                                                    s.status === 'SCAN' ? 'bg-amber-500 animate-spin' : 'bg-emerald-500/50'
                                            )} />
                                            <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase">{s.name}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-600">{s.latency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={startDeepInvestigation}
                            disabled={isScanning}
                            className="w-full h-20 bg-emerald-600 text-white rounded-[2rem] font-black text-md shadow-2xl shadow-emerald-900/50 uppercase tracking-[0.2em] transform transition hover:scale-[1.02] flex flex-col items-center justify-center p-0"
                        >
                            {isScanning ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>DASH AVANCÉ...</span>
                                    </div>
                                    <p className="text-[8px] font-mono opacity-60 lowercase">{currentSource}</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Eye className="h-6 w-6" />
                                    <span>LANCER L&apos;INVESTIGATION</span>
                                </div>
                            )}
                        </Button>
                    </Card>

                    <Card className="bg-emerald-950/10 border-emerald-500/20 rounded-[2.5rem] p-8 space-y-6">
                        <h4 className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> Analyse de Vraisemblance
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">Probabilité d&apos;Offshore</span>
                                <span className="text-emerald-500">89%</span>
                            </div>
                            <Progress value={89} className="h-1.5 bg-white/5" />
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                                Le profil de dépense social (voyages, hôtels luxe) ne correspond pas aux revenus déclarés au Sénégal. Écart de solvabilité détecté.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Investigation Dashboard (8 columns) */}
                <div className="xl:col-span-8 space-y-8">
                    {isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center bg-black/40 rounded-[4rem] border border-white/5 py-32 space-y-12 backdrop-blur-3xl relative overflow-hidden">
                            {/* Scanning Radar Animation */}
                            <div className="relative h-80 w-80">
                                <div className="absolute inset-0 border border-emerald-500 rounded-full animate-[ping_4s_linear_infinite] opacity-10" />
                                <div className="absolute inset-10 border border-emerald-500 rounded-full animate-[ping_3s_linear_infinite] opacity-20" />
                                <div className="absolute inset-20 border border-emerald-500/50 rounded-full flex items-center justify-center bg-emerald-500/5">
                                    <div className="text-center">
                                        <span className="text-6xl font-black text-emerald-500 tabular-nums">{scanProgress}%</span>
                                        <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-[0.3em]">Deep Sync</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 left-1/2 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-[spin_3s_linear_infinite]" />
                            </div>

                            <div className="max-w-md w-full space-y-8 text-center px-10">
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,1)]" style={{ width: `${scanProgress}%` }} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 italic animate-pulse">{currentSource}</p>
                                    <p className="text-[10px] font-mono text-slate-600">Cross-referencing legal entities in British Virgin Islands...</p>
                                </div>
                            </div>

                            {/* Floating data bits */}
                            <div className="absolute top-10 left-10 text-[8px] font-mono text-emerald-500/30">0x4F...D2 FOUND</div>
                            <div className="absolute bottom-20 right-20 text-[8px] font-mono text-emerald-500/30">MATCHING GEO-TAG: MARRAKECH</div>
                        </div>
                    ) : showIntelligence ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-emerald-600 shadow-[0_20px_40px_rgba(16,185,129,0.2)] border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10 space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Valeur Totale Saisissable</p>
                                        <h3 className="text-4xl font-black italic tracking-tighter">4.2 <span className="text-lg font-light opacity-60">Mrd FCFA</span></h3>
                                        <div className="pt-4 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                            <span className="text-[9px] font-black uppercase">Prêt pour saisie conservatoire</span>
                                        </div>
                                    </div>
                                    <Satellite className="absolute bottom-[-10px] right-[-10px] h-32 w-32 text-white/5 rotate-12" />
                                </Card>

                                <Card className="bg-white rounded-[2.5rem] border-none p-8 text-slate-900 shadow-2xl flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Degré d&apos;Opacité</p>
                                        <h3 className="text-2xl font-black mt-2 text-rose-500">COMPLEXE (Lvl 4)</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[9px] font-black">
                                            <span>Prête-noms identifiés</span>
                                            <span>4</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full" />
                                    </div>
                                </Card>

                                <Card className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 text-white shadow-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Dernière Preuve OSINT</p>
                                    <h4 className="text-sm font-bold mt-4 leading-tight italic">Jet immatriculé T7-XXX localisé à l&apos;Aéroport de Dakar (AIBD) ce matin à 08:42.</h4>
                                    <div className="mt-4 flex gap-2">
                                        <Badge className="bg-white/5 text-white/50 border-white/10 text-[8px]">LOG GPS</Badge>
                                        <Badge className="bg-white/5 text-white/50 border-white/10 text-[8px]">PHOTO</Badge>
                                    </div>
                                </Card>
                            </div>

                            {/* Link Analysis Visualizer Mockup */}
                            <Card className="bg-black/60 border border-white/5 rounded-[3.5rem] p-10 h-[550px] relative group overflow-hidden">
                                <div className="absolute top-10 left-10 z-10 space-y-1">
                                    <h3 className="text-xl font-black flex items-center gap-3">
                                        <Network className="h-6 w-6 text-emerald-500" />
                                        Deep Link Analysis Engine
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Toile d&apos;influence & Dissimulation de Capital</p>
                                </div>

                                {/* Simulated Graph Visualization */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <svg className="w-full h-full opacity-30">
                                        {DETECTED_CONNECTIONS.map((conn, i) => (
                                            <line key={i} x1="50%" y1="50%" x2={20 + i * 30 + "%"} y2={30 + i * 20 + "%"} stroke="rgba(16,185,129,0.5)" strokeWidth="1" strokeDasharray="5,5" />
                                        ))}
                                    </svg>

                                    {/* Central Node */}
                                    <div className="relative h-28 w-28 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.5)] border-2 border-white/20 z-20">
                                        <Fingerprint className="h-12 w-12" />
                                        <p className="absolute -bottom-8 text-[10px] font-black uppercase whitespace-nowrap">DÉBITEUR SOURCE</p>
                                    </div>

                                    {/* Subsidiary Nodes */}
                                    <div className="absolute top-1/4 left-1/4 h-20 w-20 bg-slate-900 border border-emerald-500/50 rounded-[2rem] flex flex-col items-center justify-center text-center p-2 animate-bounce">
                                        <Building2 className="h-6 w-6 text-emerald-500 mb-1" />
                                        <p className="text-[7px] font-black leading-tight uppercase">Blue Horizon (Seychelles)</p>
                                    </div>

                                    <div className="absolute bottom-1/4 right-1/4 h-24 w-24 bg-rose-900/20 border border-rose-500/50 rounded-[2rem] flex flex-col items-center justify-center text-center p-3">
                                        <MapPin className="h-8 w-8 text-rose-500 mb-1" />
                                        <p className="text-[7px] font-black leading-tight uppercase">Actif Immobilier (Marrakech)</p>
                                        <Badge className="bg-rose-500 text-white border-none text-[6px] px-1 h-3 mt-1 underline">INVESTIGUER</Badge>
                                    </div>

                                    <div className="absolute top-1/2 right-10 h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center opacity-40">
                                        <Users className="h-6 w-6" />
                                    </div>
                                </div>

                                <div className="absolute bottom-10 right-10 flex gap-4">
                                    <Button variant="outline" size="sm" className="bg-black/50 border-white/10 text-emerald-500 font-black rounded-xl text-[10px] hover:bg-emerald-500 hover:text-white transition-all uppercase px-6">
                                        DÉVOILER COUCHES OFFSHORE
                                    </Button>
                                </div>
                            </Card>

                            {/* Detailed Findings Table */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="bg-white rounded-[3rem] p-10 text-slate-950 shadow-2xl h-fit">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-8">
                                        <Target className="h-6 w-6 text-emerald-600" />
                                        Actifs de Haute Valeur
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { title: "Villa Cap Manuel (Sénégal)", value: "850M FCFA", desc: "Titre foncier au nom d&apos;une SCI gérée par l&apos;épouse.", badge: "SAISISSABLE" },
                                            { title: "Compte Emirates NBD (Dubaï)", value: "1.2M USD", desc: "Flux suspect détecté via société écran Blue Horizon.", badge: "SUSPECT" },
                                            { title: "Actions SARL X (BTP)", value: "300M FCFA", desc: "Participation occulte de 40% via prête-nom.", badge: "CERTIFIÉ" },
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:shadow-xl transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase italic">{item.title}</h4>
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[8px] uppercase">{item.badge}</Badge>
                                                </div>
                                                <p className="text-2xl font-black text-slate-900 mb-2 tabular-nums">{item.value}</p>
                                                <p className="text-xs text-slate-500 font-medium italic">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div className="space-y-8">
                                    <Card className="bg-rose-900 shadow-[0_20px_40px_rgba(225,29,72,0.2)] border-none rounded-[3rem] p-10 text-white relative overflow-hidden group">
                                        <div className="relative z-10 space-y-6">
                                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <ShieldAlert className="h-7 w-7" />
                                            </div>
                                            <h3 className="text-2xl font-black leading-tight italic uppercase">Recommandation Tactique Nexus</h3>
                                            <p className="text-rose-100 text-sm font-medium leading-relaxed">
                                                "Le transfert d&apos;actifs vers la structure Blue Horizon ayant eu lieu après la mise en demeure, l&apos;action Paulienne est hautement recommandée pour fraude aux droits du créancier."
                                            </p>
                                            <Button className="w-full h-14 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                                                GÉNÉRER ASSIGNATION IA
                                            </Button>
                                        </div>
                                        <AlertCircle className="absolute top-[-20px] right-[-20px] h-48 w-48 text-white/5" />
                                    </Card>

                                    <Card className="bg-slate-900 border-white/10 rounded-[2.5rem] p-8 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <Download className="h-4 w-4" /> Documents de Preuve
                                        </h4>
                                        <div className="divide-y divide-white/5">
                                            {[1, 2].map(i => (
                                                <div key={i} className="py-4 flex items-center justify-between group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <FileSearch className="h-4 w-4 text-emerald-500" />
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Extrait Registre Dubaï - BlueHorizon.pdf</span>
                                                    </div>
                                                    <Badge variant="outline" className="border-white/10 text-[8px] tracking-tighter">SECURED</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-black/40 rounded-[4rem] border border-white/5 py-40 group hover:bg-black/60 transition-all cursor-crosshair">
                            <div className="h-32 w-32 bg-emerald-500/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                <Radar className="h-16 w-16 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Prêt pour l&apos;infiltration</h2>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Saisissez une cible pour déployer les agents de recherche Nexus.</p>

                            <div className="mt-12 flex gap-8 items-center opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                <Globe className="h-8 w-8" />
                                <Lock className="h-8 w-8" />
                                <Satellite className="h-8 w-8" />
                                <Fingerprint className="h-8 w-8" />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <style jsx global>{`
                @keyframes scan-line {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
