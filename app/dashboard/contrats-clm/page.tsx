"use client"

import { useState } from "react"
import {
    BarChart3,
    Calendar,
    ChevronRight,
    Clock,
    Filter,
    Layout,
    MoreHorizontal,
    Plus,
    Search,
    Workflow,
    CheckCircle2,
    AlertCircle,
    FileSignature,
    Bell,
    ArrowUpRight,
    TrendingDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for Contract Metrics
const CONTRACT_METRICS = [
    { id: 1, name: "Bail Commercial SAS Dakar", party: "SCI Plateau", value: 12000000, stage: "SIGNATURE", renewal: "12 mois", status: "ACTIF" },
    { id: 2, name: "Contrat Maintenance Solaire", party: "GreenWatts", value: 4500000, stage: "RECOUVREMENT", renewal: "2 mois", status: "CRITIQUE" },
    { id: 3, name: "Accord Confidentialité Fintech", party: "Wave Mobile", value: 0, stage: "RELECTURE", renewal: "N/A", status: "EN COURS" },
]

export default function ContractLifecyclePage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* Lexzur/Enterprise style Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 ring-4 ring-white">
                        <FileSignature className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contract Lifecycle (CLM)</h1>
                        <p className="text-slate-500 font-medium italic">Pilotage actif de la valeur contractuelle (Inspiré Lexzur / Enterprise Legal).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white">
                        <Bell className="h-4 w-4 mr-2" /> Alertes Expirations
                    </Button>
                    <Button className="h-12 px-8 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau Contrat (CLM)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Contrats Actifs</p>
                        <h3 className="text-2xl font-black text-slate-900">142</h3>
                        <div className="flex items-center gap-1 text-emerald-500 mt-1 font-bold text-[10px]">
                            <ArrowUpRight className="h-3 w-3" /> +8 ce mois
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valeur Contractuelle Totale</p>
                        <h3 className="text-2xl font-black text-slate-900">852.4M <span className="text-[10px] font-medium text-slate-400">FCFA</span></h3>
                        <div className="flex items-center gap-1 text-rose-500 mt-1 font-bold text-[10px]">
                            <TrendingDown className="h-3 w-3" /> -2% (Devise)
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taux de Renouvellement</p>
                        <h3 className="text-2xl font-black text-slate-900">94.5%</h3>
                        <Progress value={94.5} className="h-1 bg-slate-100 mt-2" />
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-emerald-100 bg-emerald-50 shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Optimisation IA</p>
                        <h3 className="text-2xl font-black text-emerald-900">Elite</h3>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">ÉCONOMIE: 4.2M / AN</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Main CLM View (Lexzur style table) */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Suivi Actif des Engagements</CardTitle>
                                <CardDescription>Visualisation du cycle de vie des contrats signés.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-slate-500 font-bold border border-slate-100">
                                    <Filter className="h-4 w-4 mr-2" /> Statut
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {CONTRACT_METRICS.map((c) => (
                                    <div key={c.id} className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center gap-8">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{c.name}</h3>
                                                <Badge className={`${c.status === 'CRITIQUE' ? 'bg-rose-50 text-rose-600 animate-pulse' :
                                                        c.status === 'ACTIF' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                    } border-none font-black text-[9px]`}>{c.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5 uppercase tracking-wider">Partie: <span className="text-slate-900">{c.party}</span></span>
                                                <span className="flex items-center gap-1.5 uppercase tracking-wider">Valeur: <span className="text-slate-900">{new Intl.NumberFormat('fr-FR').format(c.value)} FCFA</span></span>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-48 space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Prochain Jalon</span>
                                                <span className={c.status === 'CRITIQUE' ? 'text-rose-600' : 'text-slate-900'}>{c.renewal}</span>
                                            </div>
                                            <Progress value={c.status === 'CRITIQUE' ? 85 : 40} className={`h-1.5 ${c.status === 'CRITIQUE' ? 'bg-rose-100' : 'bg-slate-100'}`} />
                                        </div>

                                        <div className="flex items-center gap-4 justify-end min-w-[150px]">
                                            <Button variant="ghost" className="text-xs font-bold text-indigo-600 bg-indigo-50/50 rounded-xl px-4">Gérer Jalon</Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-50">
                                <Button variant="link" className="text-slate-400 font-bold text-xs uppercase tracking-widest">Voir les 139 autres contrats</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Legal Insights (CLM style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl p-8 bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Optimisation Clause IA</h4>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed mb-6">
                                LexAI suggère de renégocier la clause d&apos;indexation des loyers sur 12 contrats pour augmenter votre rendement de 4.5%.
                            </p>
                            <Button className="w-full bg-emerald-600 text-white font-bold h-11 rounded-2xl shadow-lg shadow-emerald-100">Appliquer les modifications</Button>
                        </Card>

                        <Card className="rounded-[2.5rem] border-amber-100 bg-amber-50/20 shadow-sm p-8 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> Risque Expiration
                                </h4>
                                <p className="text-xs text-amber-700 font-medium">2 contrats majeurs expirent dans les 30 prochains jours sans option de renouvellement tacite.</p>
                            </div>
                            <Button variant="link" className="text-amber-800 text-[10px] font-black uppercase tracking-widest p-0 flex justify-start">Traiter les expirations</Button>
                        </Card>
                    </div>
                </div>

                {/* Right: Repository Hub & Stats */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Layout className="h-4 w-4 text-emerald-400" />
                                Archive CLM Consolidée
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { name: "SOCIÉTÉS (Statuts/Pactes)", count: 45, value: "145M" },
                                { name: "RECRUTEMENT (CDI/CDD)", count: 28, value: "N/A" },
                                { name: "IMMOBILIER (Baux)", count: 69, value: "707M" },
                            ].map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{cat.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-emerald-500`} style={{ width: `${(cat.count / 142) * 100}%` }} />
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{cat.count} DOCUMENTS</p>
                                </div>
                            ))}
                            <Button className="w-full bg-slate-50 text-slate-600 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border border-slate-200 mt-4">
                                Exporter l&apos;Inventaire Juridique
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl" />
                        <TrendingDown className="h-10 w-10 text-rose-500 mb-6" />
                        <h4 className="text-lg font-black mb-2 tracking-tight">Analyse de Perte Contractuelle</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                            Vous avez perdu 3.2M FCFA d&apos;opportunités de renouvellement le mois dernier faute de suivi. activez l&apos;IA CLM pour automatiser les relances.
                        </p>
                        <Button className="w-full bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100">
                            Activer Relances Auto
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
