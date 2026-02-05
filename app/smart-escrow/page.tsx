"use client"

import { useState } from "react"
import {
    Link as LinkIcon,
    ShieldCheck,
    Lock,
    Zap,
    Scale,
    Landmark,
    ArrowRight,
    Search,
    History,
    FileCheck2 as FileCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Target,
    Activity,
    Globe,
    ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const ESCROW_STEPS = [
    { id: 1, label: "DEPOT DES FONDS", status: "COMPLÉTÉ", date: "01/02/2026", color: "text-emerald-500" },
    { id: 2, label: "VÉRIFICATION CONDITIONS", status: "EN COURS", date: "Actif", color: "text-amber-500" },
    { id: 3, label: "VALIDATION AVOCAT / CARPA", status: "EN ATTENTE", date: "--", color: "text-slate-400" },
    { id: 4, label: "LIBÉRATION AUTOMATIQUE", status: "VERROUILLÉ", date: "--", color: "text-slate-400" },
]

export default function SmartEscrowPage() {
    const [isExecuting, setIsExecuting] = useState(false)

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">

            {/* Header: Fintech Secure Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 ring-4 ring-white">
                        <Lock className="h-10 w-10 shadow-lg" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Smart<span className="text-indigo-600">Escrow</span> OHADA</h1>
                        <p className="text-slate-500 font-medium italic">Séquestre Intelligent & Libération de Fonds sur Conditions (Blockchain Layer).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 rounded-xl px-6 font-black text-xs tracking-widest uppercase">
                        <History className="h-4 w-4 mr-2" /> JOURNAL DES TRANSACTIONS
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left: Transaction Setup & Details (4 columns) */}
                <div className="xl:col-span-4 space-y-8">
                    <Card className="bg-white border-slate-100 shadow-xl rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paramètres du Contrat Smart</label>

                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dossier de référence</p>
                                    <p className="font-bold text-slate-900 uppercase text-xs italic">Affaire SOCIM vs Banque Atlantique</p>
                                </div>

                                <div className="p-6 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Montant sous Séquestre</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-black">25.000.000</p>
                                        <p className="text-sm font-light opacity-60">FCFA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vérification des Conditions</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase italic">Signature de l&apos;Acte</span>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none font-black text-[8px]">OK</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase italic">Levée Hypothèque (Conservation)</span>
                                    </div>
                                    <Badge className="bg-amber-500 text-white border-none font-black text-[8px] animate-pulse">SCAN...</Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={true}
                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 opacity-50 cursor-not-allowed"
                        >
                            <ShieldCheck className="h-5 w-5 mr-3" /> LIBÉRER LES FONDS (VERROUILLÉ)
                        </Button>

                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Landmark className="h-24 w-24" />
                        </div>
                    </Card>

                    <Card className="bg-indigo-50 border-indigo-100 rounded-[2rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <LinkIcon className="h-5 w-5 text-indigo-600" />
                            <h4 className="text-xs font-black uppercase text-indigo-700 tracking-widest">Protocol Blockchain OHADA</h4>
                        </div>
                        <p className="text-[10px] text-indigo-600/60 font-medium leading-relaxed italic">
                            Chaque étape est enregistrée sur le registre décentralisé LexChain, assurant l&apos;immutabilité des conditions de libération des fonds.
                        </p>
                    </Card>
                </div>

                {/* Right: Flow Visualization & Audit (8 columns) */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Visual Stepper */}
                    <Card className="bg-white border-slate-100 shadow-xl rounded-[3rem] p-12 overflow-hidden relative">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-12">
                            <Activity className="h-6 w-6 text-indigo-600" />
                            Progression du Séquestre Intelligent
                        </h3>

                        <div className="relative flex justify-between items-start">
                            {/* Horizontal Line Background */}
                            <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-100" />

                            {ESCROW_STEPS.map((step) => (
                                <div key={step.id} className="relative z-10 flex flex-col items-center text-center w-1/4 space-y-4 group">
                                    <div className={cn(
                                        "h-16 w-16 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 shadow-lg",
                                        step.status === 'COMPLÉTÉ' ? 'bg-emerald-600 text-white' :
                                            step.status === 'EN COURS' ? 'bg-amber-500 text-white animate-pulse' : 'bg-white border-2 border-slate-100 text-slate-200'
                                    )}>
                                        {step.status === 'COMPLÉTÉ' ? <CheckCircle2 className="h-8 w-8" /> :
                                            step.status === 'EN COURS' ? <Clock className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{step.label}</p>
                                        <p className={cn("text-[9px] font-bold uppercase", step.color)}>{step.status}</p>
                                        <p className="text-[8px] font-medium text-slate-400">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Real-time Audit Log */}
                        <div className="mt-16 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" /> Live Auditor LexChain
                                </h4>
                                <Badge variant="outline" className="text-[8px] font-black border-slate-200">Node: Dakar-01</Badge>
                            </div>
                            <div className="space-y-3 font-mono text-[10px] text-slate-500 italic">
                                <div className="flex justify-between items-center group cursor-pointer hover:text-slate-900">
                                    <span>[TRANSACTION_SIGNATURE] Verified by Private Key: 0x4f...a2</span>
                                    <span className="text-emerald-500">Verified</span>
                                </div>
                                <div className="flex justify-between items-center group cursor-pointer hover:text-slate-900 border-t border-slate-200/50 pt-2">
                                    <span>[DOC_VERIFICATION] Pièce n°12 : Signature Notaire reconnue via IA</span>
                                    <span className="text-emerald-500">Matched</span>
                                </div>
                                <div className="flex justify-between items-center group cursor-pointer hover:text-slate-900 border-t border-slate-200/50 pt-2">
                                    <span>[CONDITION_LOCK] Waiting for Land Registry Confirmation (Conservation Foncière)</span>
                                    <span className="text-amber-500 animate-pulse">Waiting</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-indigo-900 border-none rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-white/20 rounded-2xl w-fit">
                                    <Globe className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Garantie<span className="text-indigo-400"> Internationnale</span></h3>
                                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                                    Sécurisez vos opérations de M&A ou de commerce transfrontalier avec une protection juridique automatisée.
                                </p>
                                <Button className="h-12 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-black uppercase text-[10px] tracking-widest w-full shadow-2xl shadow-indigo-950/20">
                                    EN SAVOIR PLUS
                                </Button>
                            </div>
                            <div className="absolute bottom-[-40px] right-[-40px] h-48 w-48 bg-white/5 rounded-full blur-[50px]" />
                        </Card>

                        <div className="space-y-8">
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Honoraires Sécurisés</p>
                                        <p className="text-sm font-black text-slate-900">Provision Automatisée</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>

                            <Card className="p-8 bg-slate-900 text-white rounded-[2rem] border-none shadow-2xl relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <Target className="h-5 w-5 text-indigo-500" />
                                    <h4 className="text-xs font-black uppercase tracking-widest italic">Intégration CARPA</h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-bold">
                                    Connectez vos Smart Escrows directement à votre compte CARPA pour une gestion comptable transparente.
                                </p>
                                <Zap className="absolute top-4 right-4 h-6 w-6 text-indigo-500/20" />
                            </Card>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
