"use client"

import { useState } from "react"
import {
    BarChart3,
    Send,
    Clock,
    Calendar,
    FileText,
    Zap,
    TrendingUp,
    ArrowUpRight,
    CheckCircle2,
    User,
    Mail,
    Settings2,
    PieChart,
    History,
    Download,
    LayoutDashboard,
    MessageCircle,
    Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for Client Portal (Admin View)
const RECENT_REPORTS = [
    { id: 1, client: "Sonatel Orange", status: "ENVOYÉ", date: "Aujourd'hui, 09:12", satisfaction: 94 },
    { id: 2, client: "Africa Logistics", status: "PRÉVU", date: "Demain, 10:00", satisfaction: 88 },
    { id: 3, client: "NeoBank Dakar", status: "LECTURE", date: "Il y a 2h", satisfaction: 98 },
]

export default function ClientExperiencePage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* Client XP Header: Transparency & Premium vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 ring-4 ring-white">
                        <LayoutDashboard className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expérience Client 100% IA</h1>
                        <p className="text-slate-500 font-medium italic">Reporting automatisé, Portail client & Fidélisation (Inspiré HighQ / Clio Connect).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white font-bold rounded-xl shadow-sm">
                        <Settings2 className="h-4 w-4 mr-2" /> Paramètres Portail
                    </Button>
                    <Button className="h-12 px-8 bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl font-bold rounded-xl">
                        <Send className="h-4 w-4 mr-2" /> Flash Report Hebdo
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden border-t-4 border-t-emerald-500">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Articles Envoyés (Mois)</p>
                        <h3 className="text-2xl font-black text-slate-900">142</h3>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">100% AUTOMATISÉ</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white border-t-4 border-t-indigo-500">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satisfaction Moyenne</p>
                        <h3 className="text-2xl font-black text-indigo-600">4.9 / 5</h3>
                        <div className="flex gap-1 mt-1 text-amber-400">
                            <Zap className="h-3 w-3 fill-amber-400" />
                            <Zap className="h-3 w-3 fill-amber-400" />
                            <Zap className="h-3 w-3 fill-amber-400" />
                            <Zap className="h-3 w-3 fill-amber-400" />
                            <Zap className="h-3 w-3 fill-amber-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-white border-t-4 border-t-amber-500">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comptes Clients Actifs</p>
                        <h3 className="text-2xl font-black text-slate-900">85</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">SUR VOTRE PLATEFORME</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-100 shadow-sm bg-emerald-900 text-white">
                    <CardContent className="pt-6">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Économie de temps</p>
                        <h3 className="text-2xl font-black">+25h <span className="text-[10px] opacity-60">/ Avocat</span></h3>
                        <p className="text-[10px] text-indigo-200 font-bold mt-1 uppercase">REPORTING SUPPRIMÉ</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Active Reporting Feed */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Flash Reports Automatisés</CardTitle>
                                <CardDescription>Suivi des résumés d&apos;activité envoyés aux clients stratégiques.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400"><History className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400"><Download className="h-5 w-5" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {RECENT_REPORTS.map((r) => (
                                    <div key={r.id} className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center gap-8">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{r.client}</h3>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{r.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-2 mb-1">
                                                    <p className="text-sm font-black text-slate-900">{r.satisfaction}% <span className="text-[9px] text-slate-400 opacity-60">SAT</span></p>
                                                    <div className="w-12 h-1 bg-slate-100 rounded-full">
                                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.satisfaction}%` }} />
                                                    </div>
                                                </div>
                                                <Badge className={`${r.status === 'ENVOYÉ' ? 'bg-emerald-50 text-emerald-600' :
                                                        r.status === 'LECTURE' ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-900'
                                                    } border-none font-black text-[9px] px-3 py-1`}>{r.status}</Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-200">
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Portal Preview / Widget */}
                    <Card className="rounded-[3rem] border-indigo-100 bg-white shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-12 bg-indigo-50/50 rounded-bl-[100px] -z-0" />
                        <div className="relative z-10 p-12 flex flex-col md:flex-row items-center gap-12">
                            <div className="space-y-6 flex-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Portail Client 3.0
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Votre Client est co-pilote.</h3>
                                <p className="text-lg text-slate-500 font-medium">
                                    Offrez à vos clients Premium un accès 24/7 à leur dossier, aux factures et à l&apos;évolution de leur stratégie juridique.
                                </p>
                                <div className="flex gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps réel</p>
                                        <p className="text-sm font-bold text-slate-700">Audit de dossier</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collaboratif</p>
                                        <p className="text-sm font-bold text-slate-700">Dépôt de pièces</p>
                                    </div>
                                </div>
                                <Button className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">Personnaliser le Portail</Button>
                            </div>
                            <div className="w-full md:w-80 h-[400px] bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden ring-8 ring-slate-100">
                                <div className="flex justify-between items-center mb-10">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                    <User className="h-8 w-8 text-slate-600" />
                                </div>
                                <h4 className="text-xl font-black mb-2">Hello Orange,</h4>
                                <p className="text-xs text-slate-400">Voici l&apos;état de votre dossier "Fusion-Acquisition Q1".</p>
                                <div className="mt-12 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black">
                                            <span>PHASE 2: DUE DILIGENCE</span>
                                            <span>85%</span>
                                        </div>
                                        <Progress value={85} className="h-1 bg-white/10" />
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[9px] text-indigo-400 uppercase font-black mb-1">Dernière Action</p>
                                        <p className="text-[10px] font-medium leading-relaxed italic">"Révision du pacte par LexAI (Certifié)"</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-900 to-transparent p-8 flex items-end">
                                    <Button className="w-full bg-indigo-600 h-10 rounded-xl font-bold text-xs ring-4 ring-slate-900">Signer l&apos;Acte</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Automation & Health */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] bg-emerald-50 border-emerald-100 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h4 className="font-black text-emerald-900 text-sm">IA Satisfaction Report</h4>
                        </div>
                        <p className="text-xs text-emerald-700 leading-relaxed font-bold mb-6 italic">
                            "LexAI détecte une frustration potentielle chez le client **Africa Logistics** car aucun flash report n&apos;a été lu depuis 3 semaines. Planifiez un appel."
                        </p>
                        <Button className="w-full bg-emerald-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-100">Traiter l&apos;Alerte</Button>
                    </Card>

                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden p-8 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Canaux de communication</h4>
                        <div className="space-y-4">
                            {[
                                { label: "Portail Web", icon: <LayoutDashboard className="h-4 w-4" />, status: "ACTIF" },
                                { label: "WhatsApp Bot", icon: <MessageCircle className="h-4 w-4" />, status: "ALPHA" },
                                { label: "E-mail Flash", icon: <Mail className="h-4 w-4" />, status: "ACTIF" },
                            ].map((c, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 group-hover:text-emerald-600">
                                        {c.icon} {c.label}
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black border-slate-200">{c.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl text-center space-y-4">
                        <PieChart className="h-10 w-10 text-indigo-400 mx-auto" />
                        <div>
                            <h4 className="font-black text-lg">Impact Business</h4>
                            <p className="text-[10px] text-slate-400 lowercase italic px-4 font-medium">Réduction de 45% des demandes de mise à jour manuelles par téléphone.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
