"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Target,
    Zap,
    Download,
    Users
} from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts'

const data = [
    { name: 'Jan', revenue: 4500000, goal: 4000000 },
    { name: 'Fév', revenue: 5200000, goal: 4000000 },
    { name: 'Mar', revenue: 3800000, goal: 4000000 },
    { name: 'Avr', revenue: 6100000, goal: 4500000 },
    { name: 'Mai', revenue: 5800000, goal: 4500000 },
    { name: 'Juin', revenue: 7200000, goal: 5000000 },
]

const domainData = [
    { name: 'Commercial', value: 45, color: '#6366f1' },
    { name: 'Civil', value: 25, color: '#10b981' },
    { name: 'Social', value: 15, color: '#f59e0b' },
    { name: 'Pénal', value: 10, color: '#ef4444' },
    { name: 'Immobilier', value: 5, color: '#06b6d4' },
]

export function AdvancedFinancialDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-indigo-600" />
                        Tableau de Bord Financier Stratégique
                    </h1>
                    <p className="text-slate-500 mt-1">Analyse prédictive et performance financière en temps réel.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" /> Annuel 2024
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        <Download className="h-4 w-4" /> Rapport PDF
                    </Button>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-indigo-100 bg-white/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <DollarSign className="h-5 w-5 text-indigo-600" />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">Chiffre d'Affaires Mensuel</p>
                            <h3 className="text-2xl font-bold text-slate-900">7.200.000 <span className="text-xs font-normal text-slate-400">FCFA</span></h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-white/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +5%
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">Taux de Recouvrement</p>
                            <h3 className="text-2xl font-bold text-slate-900">84 <span className="text-xs font-normal text-slate-400">%</span></h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-100 bg-white/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <Badge variant="outline" className="text-red-600 border-red-100 bg-red-50">
                                4 urgents
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">Impayés {'>'} 60j</p>
                            <h3 className="text-2xl font-bold text-slate-900">12.450.000 <span className="text-xs font-normal text-slate-400">FCFA</span></h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-100 bg-white/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                IA Preview
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">Prévisionnel (Q3)</p>
                            <h3 className="text-2xl font-bold text-slate-900">22.500.000 <span className="text-xs font-normal text-slate-400">FCFA</span></h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Evolution */}
                <Card className="lg:col-span-2 shadow-sm border-slate-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            Évolution du CA vs Objectifs
                        </CardTitle>
                        <CardDescription>Comparaison mensuelle de la performance financière.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(value as number)} FCFA`}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                    <Area type="monotone" dataKey="goal" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Profitability by Domain */}
                <Card className="shadow-sm border-slate-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-indigo-600" />
                            Rentabilité par Domaine
                        </CardTitle>
                        <CardDescription>Répartition du CA par expertise.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={domainData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {domainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4">
                            {domainData.map((domain, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domain.color }} />
                                        <span className="font-medium text-slate-700">{domain.name}</span>
                                    </div>
                                    <span className="text-slate-500">{domain.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Financial Alerts */}
                <Card className="border-indigo-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-indigo-50/50">
                        <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                            <Zap className="h-5 w-5 text-indigo-600 animate-pulse" />
                            Intelligence Financière & Alertes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-orange-900">Anomalie de facturation détectée</h4>
                                <p className="text-xs text-orange-700 mt-1">
                                    Le dossier "TechCorp vs État" présente 45h de travail non facturées depuis 30 jours.
                                    Perte potentielle : 2.250.000 FCFA.
                                </p>
                                <Button variant="link" className="p-0 h-auto text-xs text-orange-800 font-bold mt-2">Générer facture pro-forma</Button>
                            </div>
                        </div>

                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-emerald-900">Baisse du coût d'acquisition</h4>
                                <p className="text-xs text-emerald-700 mt-1">
                                    Vos nouveaux clients en Droit Immobilier coûtent 15% de moins que le mois dernier.
                                    Rentabilité projetée en hausse sur ce segment.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
                            <Target className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-indigo-900">Objectif Mensuel : 95% atteint</h4>
                                <p className="text-xs text-indigo-700 mt-1">
                                    Il ne manque que 350.000 FCFA pour atteindre votre record historique.
                                    2 factures arrivent à échéance ce vendredi.
                                </p>
                                <Progress value={95} className="h-2 mt-3 bg-indigo-200" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Financial Performance */}
                <Card className="shadow-sm border-slate-100">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            Performance Financière de l'Équipe
                        </CardTitle>
                        <CardDescription>Diligences facturables et recouvrement par avocat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { name: "Me Ndiaye", billable: 85, recovery: 92, amount: "3.2M" },
                                { name: "Me Diop", billable: 70, recovery: 85, amount: "2.1M" },
                                { name: "Me Faye", billable: 95, recovery: 78, amount: "2.8M" }
                            ].map((user, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {user.name[3]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                        </div>
                                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100">{user.amount} FCFA</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                                                <span>Facturable</span>
                                                <span>{user.billable}%</span>
                                            </div>
                                            <Progress value={user.billable} className="h-1 bg-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                                                <span>Recouvrement</span>
                                                <span className="text-emerald-600">{user.recovery}%</span>
                                            </div>
                                            <Progress value={user.recovery} className="h-1 bg-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
