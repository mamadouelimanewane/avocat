
"use client"

import { useState } from "react"
import {
    Radar,
    ShieldAlert,
    Search,
    Globe,
    Building2,
    Users,
    Activity,
    AlertTriangle,
    FileSearch,
    Map,
    Eye,
    XCircle,
    Download,
    Siren
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface LexSentinelProps {
    dossierId: string
    onClose?: () => void
}

export function LexSentinel({ dossierId, onClose }: LexSentinelProps) {
    const [scanProgress, setScanProgress] = useState(0)
    const [isScanning, setIsScanning] = useState(false)
    const [scanComplete, setScanComplete] = useState(false)

    const startScan = () => {
        setIsScanning(true)
        setScanProgress(0)
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsScanning(false)
                    setScanComplete(true)
                    return 100
                }
                return prev + 2
            })
        }, 50)
    }

    return (
        <div className="bg-slate-950 border-l border-slate-800 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden text-slate-200">
            {/* Header - Spy/Intel Style */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-20 flex items-center justify-between shadow-md shadow-black/50">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-900/50 p-2 rounded-lg border border-emerald-500/30">
                        <Radar className="h-5 w-5 text-emerald-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-black text-white tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-emerald-500">Sentinel</span>
                        </h3>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest font-mono">OSINT & Asset Tracing</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-800 rounded-full h-8 w-8 text-slate-500">
                        <XCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">

                    {/* Search & Target Input */}
                    <Card className="bg-slate-900 border-slate-800 shadow-none">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex gap-2">
                                <Search className="text-slate-500 h-5 w-5 mt-2.5" />
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cible (Personne / Société)</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Jean Dupont ou SARL EXEMPLE"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg h-10 px-3 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        defaultValue="GROUPE HOLDING INVEST"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={startScan}
                                disabled={isScanning}
                                className={cn(
                                    "w-full h-10 font-black tracking-wide border transition-all",
                                    isScanning
                                        ? "bg-emerald-900/20 text-emerald-500 border-emerald-900"
                                        : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-900/50"
                                )}
                            >
                                {isScanning ? "SCAN EN COURS..." : "LANCER DEEP SCAN"}
                            </Button>
                            {isScanning && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase font-mono text-emerald-500">
                                        <span>Recherche Pappers...</span>
                                        <span>{scanProgress}%</span>
                                    </div>
                                    <Progress value={scanProgress} className="h-1 bg-slate-800" indicatorClassName="bg-emerald-500" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {scanComplete && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* 1. Risk Score Radar */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-slate-900 border-slate-800">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                        <div className="relative">
                                            <ShieldAlert className="h-12 w-12 text-amber-500" />
                                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-white">65<span className="text-sm text-slate-500">/100</span></p>
                                            <p className="text-[9px] font-bold text-amber-500 uppercase">Risque Modéré</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="space-y-2">
                                    <RiskItem label="Santé Financière" level="low" />
                                    <RiskItem label="Contentieux" level="high" />
                                    <RiskItem label="Réputation Web" level="medium" />
                                    <RiskItem label="Sanctions Int." level="safe" />
                                </div>
                            </div>

                            {/* 2. Asset Map (Network) */}
                            <Card className="bg-slate-900 border-slate-800 overflow-hidden relative">
                                <div className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur px-2 py-1 rounded border border-slate-700">
                                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                                        <Globe className="h-3 w-3" /> NETWORK GRAPH
                                    </span>
                                </div>
                                <div className="h-48 w-full bg-[#0f172a] relative flex items-center justify-center">
                                    {/* Mock Network Visualization */}
                                    <div className="absolute inset-0 bg-[url('/grid-dot-dark.svg')] opacity-20" />

                                    {/* Central Node */}
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center border-4 border-slate-900 shadow-xl shadow-emerald-500/20">
                                        <Building2 className="h-5 w-5 text-white" />
                                        {/* Satellites */}
                                        <div className="absolute -top-12 -right-8 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-900">
                                            <Building2 className="h-3 w-3 text-slate-300" />
                                        </div>
                                        <div className="absolute -bottom-10 -left-8 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-900">
                                            <Users className="h-3 w-3 text-slate-300" />
                                        </div>
                                        <div className="absolute top-0 -left-16 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center border-2 border-slate-900 animate-pulse">
                                            <Siren className="h-3 w-3 text-white" />
                                        </div>
                                        {/* Lines */}
                                        <svg className="absolute inset-[-100px] pointer-events-none -z-10 w-[300px] h-[300px]">
                                            <line x1="150" y1="150" x2="190" y2="110" stroke="#334155" strokeWidth="2" />
                                            <line x1="150" y1="150" x2="110" y2="190" stroke="#334155" strokeWidth="2" />
                                            <line x1="150" y1="150" x2="90" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-slate-800 flex justify-between items-center text-xs">
                                    <span className="text-slate-400">3 Sociétés liées détectées</span>
                                    <span className="text-amber-500 font-bold flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> 1 Alerte
                                    </span>
                                </div>
                            </Card>

                            {/* 3. Detailed Data Findings */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Données Critiques</h4>
                                <FindingRow
                                    icon={<FileSearch className="h-4 w-4 text-blue-400" />}
                                    title="Dettes URSSAF (Privilèges)"
                                    value="12 450 €"
                                    status="warning"
                                />
                                <FindingRow
                                    icon={<Activity className="h-4 w-4 text-emerald-400" />}
                                    title="Chiffre d'Affaires (2024)"
                                    value="1.2M € (-15%)"
                                    status="neutral"
                                />
                                <FindingRow
                                    icon={<Siren className="h-4 w-4 text-red-500" />}
                                    title="Contentieux en cours"
                                    value="2 Procédures détectées"
                                    status="danger"
                                />
                            </div>

                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white uppercase font-bold text-xs tracking-wider">
                                <Download className="h-3 w-3 mr-2" /> Exporter le rapport OSINT
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

function RiskItem({ label, level }: { label: string, level: 'safe' | 'medium' | 'high' | 'low' }) {
    const color = {
        safe: "bg-emerald-500",
        medium: "bg-amber-500",
        high: "bg-red-500",
        low: "bg-slate-500"
    }[level]

    return (
        <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded border border-slate-800">
            <span className="text-slate-400 font-medium">{label}</span>
            <div className={cn("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", color)} />
        </div>
    )
}

function FindingRow({ icon, title, value, status }: { icon: React.ReactNode, title: string, value: string, status: 'warning' | 'danger' | 'neutral' }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-3">
                <div className="bg-slate-950 p-2 rounded text-slate-300">{icon}</div>
                <span className="text-xs font-bold text-slate-300">{title}</span>
            </div>
            <span className={cn(
                "text-xs font-mono font-bold",
                status === 'danger' ? "text-red-500" : status === 'warning' ? "text-amber-500" : "text-slate-400"
            )}>
                {value}
            </span>
        </div>
    )
}
