"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Globe, Building2, MapPin, AlertTriangle, CheckCircle2, Eye, Lock, RefreshCw, FileWarning } from "lucide-react"

export function SherlockScanner() {
    const [query, setQuery] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<any>(null)

    const handleScan = () => {
        if (!query) return
        setIsScanning(true)
        setProgress(0)
        setResult(null)

        // Simulation of scanning process
        let p = 0
        const interval = setInterval(() => {
            p += Math.random() * 15
            if (p > 100) {
                p = 100
                clearInterval(interval)
                setIsScanning(false)
                setResult(MOCK_RESULT)
            }
            setProgress(p)
        }, 500)
    }

    const MOCK_RESULT = {
        name: query,
        score: 35, // Low score = High Risk/Low Solvency
        riskLevel: "HIGH",
        assets: [
            { type: "IMMOBILIER", details: "Terrain nu 400m² - Rufisque ( Annonce 2023)", confidence: "MOYENNE" },
            { type: "VEHICULE", details: "SUV Toyota Prado (Photo RS Jan 2024)", confidence: "HAUTE" }
        ],
        alerts: [
            { type: "JURIDIQUE", msg: "Cité dans 2 affaires au Tribunal du Commerce (2022, 2024)." },
            { type: "CORPORATE", msg: "Changement de gérance suspect 3 mois avant le litige." },
            { type: "REPUTATION", msg: "Plaintes multiples sur page Facebook (Non livraison)." }
        ],
        digitalFootprint: {
            sites: ["senegal-annonces.com", "linkedin.com", "rccm.sn"],
            lastActive: "Hier (Facebook)"
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-rose-500">
                            <Eye className="h-6 w-6" />
                            Sherlock OSINT™
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Scanner de solvabilité & patrimoine (Open Source Intelligence).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    placeholder="Nom, Société, NINEA..."
                                    className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                className={`w-full font-bold ${isScanning ? 'bg-slate-700 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'}`}
                                onClick={handleScan}
                                disabled={isScanning}
                            >
                                {isScanning ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" /> Scan en cours... {Math.round(progress)}%
                                    </span>
                                ) : (
                                    "Lancer l'Enquête"
                                )}
                            </Button>
                        </div>

                        {isScanning && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-1 bg-slate-800" indicatorClassName="bg-rose-500" />
                                <p className="text-[10px] text-slate-400 font-mono animate-pulse">
                                    > Analysing RCCM databases...<br />
                                    > Scraping social graphs...<br />
                                    > Checking land registry index...
                                </p>
                            </div>
                        )}

                        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-[10px] text-rose-200/70 flex gap-2">
                            <Lock className="h-4 w-4 shrink-0" />
                            <p>
                                Ce module n'utilise que des données publiques (OSINT). L'utilisation à des fins d'espionnage privé est illégale. Usage professionnel uniquement.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
                {result ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Score Header */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <Card className="flex-1 bg-white border-none shadow-md">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Indice de Solvabilité</p>
                                        <h3 className="text-3xl font-black text-slate-900">{result.score}/100</h3>
                                        <Badge variant="destructive" className="mt-1">NIVEAU DE RISQUE : {result.riskLevel}</Badge>
                                    </div>
                                    <div className="h-16 w-16 rounded-full border-4 border-rose-100 flex items-center justify-center text-rose-500 bg-rose-50">
                                        <AlertTriangle className="h-8 w-8" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 bg-white border-none shadow-md">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Empreinte Numérique</p>
                                        <h3 className="text-xl font-bold text-slate-900">3 Sources</h3>
                                        <p className="text-xs text-slate-500">Dernière activité : {result.digitalFootprint.lastActive}</p>
                                    </div>
                                    <div className="h-16 w-16 rounded-full border-4 border-slate-100 flex items-center justify-center text-slate-500 bg-slate-50">
                                        <Globe className="h-8 w-8" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Tabs/Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Assets Detected */}
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-emerald-50/50 pb-3">
                                    <CardTitle className="text-sm font-bold uppercase text-emerald-800 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" /> Actifs Détectés (Indices)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {result.assets.map((asset: any, i: number) => (
                                            <div key={i} className="p-4 hover:bg-emerald-50/20 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded-full mb-1 inline-block">{asset.type}</span>
                                                        <p className="font-medium text-slate-800 text-sm">{asset.details}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600">
                                                        Confiance: {asset.confidence}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Red Flags */}
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardHeader className="bg-amber-50/50 pb-3">
                                    <CardTitle className="text-sm font-bold uppercase text-amber-800 flex items-center gap-2">
                                        <FileWarning className="h-4 w-4" /> Red Flags & Alertes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {result.alerts.map((alert: any, i: number) => (
                                            <div key={i} className="p-4 hover:bg-amber-50/20 transition-colors flex gap-3">
                                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-amber-700 mb-0.5">{alert.type}</p>
                                                    <p className="text-sm text-slate-700">{alert.msg}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-500">En attente de cible</h3>
                        <p className="text-sm max-w-xs text-center mt-2">
                            Entrez le nom d'une personne ou d'une entreprise pour lancer l'investigation numérique.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
