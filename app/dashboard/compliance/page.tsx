"use client"

import { useState, useEffect } from "react"
import {
    ShieldCheck,
    Fingerprint,
    ScanFace,
    Lock,
    Scale,
    Landmark,
    TriangleAlert,
    CheckCircle2,
    Search,
    UserCheck,
    Globe,
    CreditCard,
    ArrowRight,
    Zap,
    History,
    FileCheck2 as FileCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const KYC_CHECKS = [
    { name: "Vérification CNI / Passeport", status: "VALIDÉ", date: "02/02/2026" },
    { name: "Scan Biométrique Facial", status: "VALIDÉ", date: "02/02/2026" },
    { name: "Contrôle Liste de Sanctions", status: "EN COURS", date: "--" },
    { name: "Provenance des Fonds (CARPA)", status: "EN ATTENTE", date: "--" },
]

export default function CarpaKycPage() {
    const [mounted, setMounted] = useState(false)
    const [scanActive, setScanActive] = useState(false)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const startBiometricScan = () => {
        setScanActive(true)
        setTimeout(() => {
            setScanActive(false)
            setIsVerified(true)
        }, 3000)
    }

    if (!mounted) return null

    return (
        <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-slate-100 rounded-[3rem]">

            {/* Security Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-900/20 ring-4 ring-emerald-600/20">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Safe<span className="text-emerald-500">Nexus</span> Compliance</h1>
                        <p className="text-slate-500 font-medium italic">Vérification d&apos;Identité Biométrique & Gestion CARPA Anti-Blanchiment.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 rounded-xl px-6 font-black text-[10px] tracking-widest">
                        <Lock className="h-4 w-4 mr-2" /> ACCÈS SÉCURISÉ AES-256
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* KYC Biometric Module (5 columns) */}
                <div className="xl:col-span-12 lg:col-span-5 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="bg-slate-900 border-white/10 rounded-[3rem] p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
                            {/* Scanning UI Area */}
                            <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                                {/* Decorative Scanning Lines */}
                                <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
                                <div className="absolute inset-4 border border-emerald-500/10 rounded-full animate-ping" />

                                <div className={cn(
                                    "relative h-48 w-48 rounded-[3rem] border-2 flex items-center justify-center transition-all duration-700",
                                    scanActive ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-emerald-500/5" :
                                        isVerified ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5"
                                )}>
                                    {isVerified ? (
                                        <Fingerprint className="h-24 w-24 text-emerald-500 animate-in zoom-in duration-500" />
                                    ) : (
                                        <ScanFace className={cn("h-24 w-24 transition-all", scanActive ? "text-emerald-500 scale-110" : "text-white/20")} />
                                    )}

                                    {scanActive && (
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] animate-[scan_2s_linear_infinite]" />
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-4 max-w-sm relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tight">Vérification Client</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                                    Scannez le visage du client ou son empreinte pour authentification immédiate via le registre national.
                                </p>
                                <Button
                                    onClick={startBiometricScan}
                                    disabled={scanActive || isVerified}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-2xl transition-all",
                                        isVerified ? "bg-emerald-600 text-white" : "bg-white text-slate-900 hover:bg-slate-100"
                                    )}
                                >
                                    {scanActive ? "SCAN EN COURS..." : isVerified ? <><CheckCircle2 className="h-4 w-4 mr-2" /> CLIENT CERTIFIÉ</> : "LANCER L'IDENTIFICATION"}
                                </Button>
                            </div>

                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                        </Card>

                        {/* Compliance Status Details */}
                        <Card className="bg-white rounded-[3rem] border-none shadow-2xl p-10 text-slate-900 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <UserCheck className="h-6 w-6 text-emerald-600" />
                                        Score de Conformité
                                    </h3>
                                    <span className="text-3xl font-black text-emerald-600">85<span className="text-slate-300">/100</span></span>
                                </div>
                                <Progress value={85} className="h-3 bg-slate-100" />

                                <div className="space-y-4 pt-4">
                                    {KYC_CHECKS.map((check, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-3 w-3 rounded-full",
                                                    check.status === 'VALIDÉ' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                        check.status === 'EN COURS' ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'
                                                )} />
                                                <span className="text-xs font-black uppercase text-slate-700 tracking-tight">{check.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={cn(
                                                    "border-none font-black text-[9px] px-2",
                                                    check.status === 'VALIDÉ' ? 'bg-emerald-100 text-emerald-700' :
                                                        check.status === 'EN COURS' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-400'
                                                )}>
                                                    {check.status}
                                                </Badge>
                                                <p className="text-[9px] font-bold text-slate-400 mt-1">{check.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card className="mt-8 bg-amber-50 border-amber-100 p-6 rounded-2xl border-dashed">
                                <div className="flex items-center gap-3 mb-2">
                                    <TriangleAlert className="h-4 w-4 text-amber-600" />
                                    <h4 className="text-xs font-black uppercase text-amber-700 tracking-widest">Alerte LC-BFT</h4>
                                </div>
                                <p className="text-[10px] text-amber-600 font-bold leading-relaxed">
                                    La provenance des fonds pour l&apos;encaissement de 5.000.000 FCFA nécessite un justificatif de ressource (Article 15 de la Directive UMOA).
                                </p>
                            </Card>
                        </Card>
                    </div>
                </div>

                {/* CARPA Transaction Explorer (Full width below) */}
                <div className="xl:col-span-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <Landmark className="h-6 w-6 text-emerald-500" />
                            Explorateur de Flux CARPA
                        </h2>
                        <Button variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 font-black text-xs uppercase tracking-widest rounded-xl">
                            <History className="h-4 w-4 mr-2" /> Historique Complet
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-slate-900 border-white/10 p-8 rounded-[2rem] flex flex-col justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mouvements en instance</p>
                            <h3 className="text-3xl font-black mt-4">12.450.000 <span className="text-sm font-light text-slate-500 tracking-tighter">FCFA</span></h3>
                            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="text-[10px] font-bold text-emerald-500">+15% vs mois dernier</span>
                                <Globe className="h-4 w-4 text-slate-700" />
                            </div>
                        </Card>

                        <Card className="bg-emerald-600 border-none p-8 rounded-[2rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Prêt pour décaissement</p>
                            <h3 className="text-3xl font-black mt-4">8.200.000 <span className="text-sm font-light text-emerald-200 tracking-tighter">FCFA</span></h3>
                            <button className="mt-6 w-full py-2 bg-white text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                                <Zap className="h-4 w-4 fill-emerald-600" /> Signer Virement IA
                            </button>
                            <CreditCard className="absolute top-0 right-0 h-24 w-24 text-white/5 -mr-8 -mt-8 rotate-12" />
                        </Card>

                        <Card className="bg-slate-900 border-white/10 p-8 rounded-[2rem] flex flex-col justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Taux de Rétention (Honoraires)</p>
                            <h3 className="text-3xl font-black mt-4">18<span className="text-sm font-light text-slate-500 tracking-tighter">%</span></h3>
                            <Progress value={18} className="mt-6 h-1.5 bg-white/5" />
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500">OPTIMISÉ PAR IA</span>
                                <ArrowRight className="h-4 w-4 text-slate-700" />
                            </div>
                        </Card>
                    </div>

                    <div className="p-10 bg-slate-900/30 border border-white/5 rounded-[3rem] text-center space-y-4">
                        <FileCheck className="h-12 w-12 text-emerald-500 mx-auto" />
                        <h4 className="text-lg font-black tracking-tight italic">Rapports de Conformité Générés Automatiquement</h4>
                        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                            Le système Nexus prépare automatiquement vos rapports pour le Bâtonnier et les autorités de contrôle financier selon les normes TRACFIN/UMOA.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
