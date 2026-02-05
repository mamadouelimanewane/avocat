"use client"

import { useState } from "react"
import {
    Users,
    Target,
    TrendingUp,
    Mail,
    Phone,
    Calendar,
    Star,
    MoreHorizontal,
    Filter,
    Plus,
    ArrowUpRight,
    Briefcase,
    Zap,
    Clock,
    CheckCircle2,
    Heart,
    MessageCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock Data for Relationship Intelligence
const RELATIONSHIP_KPIs = [
    { label: "Leads Actifs", value: "24", trend: "+12%", color: "text-indigo-600" },
    { label: "Taux de Conversion", value: "32%", trend: "+5%", color: "text-emerald-600" },
    { label: "Pipeline Value", value: "145M FCFA", trend: "+15M", color: "text-slate-900" },
    { label: "Délai Signature", value: "18 j", trend: "-2 j", color: "text-rose-600" },
]

const KEY_PROSPECTS = [
    { id: 1, name: "Africa Logistics SA", stage: "OFFRE FINALE", value: "45M FCFA", health: 95, lastContact: "Aujourd'hui", owner: "Me Ndiaye" },
    { id: 2, name: "NeoBank Dakar", stage: "NÉGOCIATION", value: "12M FCFA", health: 60, lastContact: "Hier", owner: "Me Fall" },
    { id: 3, name: "Exploitation Minière Est", stage: "PRISE DE CONTACT", value: "85M FCFA", health: 85, lastContact: "2 jours", owner: "Me Diop" },
]

export default function RelationshipIntelligencePage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* Pipedrive style Premium CRM Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 ring-4 ring-white">
                        <Target className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Relationship Intelligence</h1>
                        <p className="text-slate-500 font-medium italic">Gérez vos opportunités & réseau d&apos;influence (Inspiré Pipedrive / LawCRM).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white shadow-sm font-bold">
                        <Filter className="h-4 w-4 mr-2" /> Filtrer Pipeline
                    </Button>
                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-xl font-bold">
                        <Plus className="h-4 w-4 mr-2" /> Nouvelle Opportunité
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {RELATIONSHIP_KPIs.map((kpi, i) => (
                    <Card key={i} className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden group">
                        <CardContent className="pt-6 relative">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                                <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</h3>
                            <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">{kpi.trend} VS MOIS DERNIER</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Main Pipeline Table */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Opportunités Stratégiques</CardTitle>
                                <CardDescription>Suivi actif des prospects et renforcement des relations.</CardDescription>
                            </div>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] px-3 py-1">PIPELINE ACTIF</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {KEY_PROSPECTS.map((p) => (
                                    <div key={p.id} className="p-8 hover:bg-slate-50/50 transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center gap-8">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.name}</h3>
                                                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px]">{p.stage}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5 uppercase tracking-wider">Valeur Est.: <span className="text-slate-900">{p.value}</span></span>
                                                <span className="flex items-center gap-1.5 uppercase tracking-wider">Resp: <span className="text-slate-900">{p.owner}</span></span>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-40 space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Health Score</span>
                                                <span className={p.health > 80 ? 'text-emerald-600' : 'text-rose-600'}>{p.health}%</span>
                                            </div>
                                            <Progress value={p.health} className={`h-1.5 ${p.health > 80 ? 'bg-emerald-100' : 'bg-rose-100'}`} />
                                        </div>

                                        <div className="flex items-center gap-4 justify-end min-w-[150px]">
                                            <div className="flex -space-x-2">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-indigo-600 shadow-sm"><Mail className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-indigo-600 shadow-sm"><Phone className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-indigo-600 shadow-sm"><Calendar className="h-4 w-4" /></Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-200">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-50">
                                <Button variant="link" className="text-slate-400 font-bold text-xs uppercase tracking-widest">Voir le Kanban Complet</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Relationship Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl p-8 bg-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <ArrowUpRight className="h-16 w-16 text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="h-6 w-6 text-amber-500" />
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">IA Business Intelligence</h4>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed mb-6">
                                LexAI a détecté que vous n&apos;avez pas contacté **"Dakar Port Authority"** depuis 45 jours. Une relance pourrait débloquer le contrat de 25M FCFA.
                            </p>
                            <Button className="w-full bg-slate-900 text-white font-bold h-11 rounded-2xl shadow-lg ring-4 ring-slate-100">Planifier Relance IA</Button>
                        </Card>

                        <Card className="rounded-[2.5rem] border-amber-100 bg-amber-50/20 shadow-sm p-8 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Heart className="h-4 w-4" /> Client "At Risk"
                                </h4>
                                <p className="text-xs text-amber-700 font-medium">Votre client **"Africa Logistics"** a montré des signes de désengagement (Réduction des calls). Une réunion de courtoisie est suggérée.</p>
                            </div>
                            <Button variant="link" className="text-amber-800 text-[10px] font-black uppercase tracking-widest p-0 flex justify-start">Traiter l&apos;alerte rétention</Button>
                        </Card>
                    </div>
                </div>

                {/* Right: Networking & Activity */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-indigo-600 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
                                <MessageCircle className="h-4 w-4 text-emerald-400" />
                                Dernières Interactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { user: "Me Ndiaye", action: "Email envoyé", prospect: "AfricaTech", time: "10:30" },
                                { user: "Me Fall", action: "Réunion physique", prospect: "NeoBank", time: "Hier" },
                                { user: "Sytème IA", action: "Détection Lead", prospect: "Somat SARL", time: "09:15" },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">{act.user[0]}</div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-900">{act.action} <span className="text-indigo-600">{act.prospect}</span></p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full bg-slate-50 text-slate-600 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                Journal d&apos;activité complet
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-indigo-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-all" />
                        <Briefcase className="h-10 w-10 text-emerald-400 mb-6" />
                        <h4 className="text-lg font-black mb-2 tracking-tight">Objectif Trimestriel</h4>
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                                <span>Target: 500M FCFA</span>
                                <span>72%</span>
                            </div>
                            <Progress value={72} className="h-2 bg-white/20" />
                        </div>
                        <p className="text-[10px] text-indigo-300 font-medium mt-4 italic">
                            "Encore 140M FCFA à signer pour atteindre vos bonus de performance."
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}
