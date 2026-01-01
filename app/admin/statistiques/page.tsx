
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts"
import {
    TrendingUp,
    Users,
    Briefcase,
    AlertCircle,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Scale
} from "lucide-react"

const dataCA = [
    { name: "Jan", ca: 4500000 },
    { name: "Fév", ca: 5200000 },
    { name: "Mar", ca: 4800000 },
    { name: "Avr", ca: 6100000 },
    { name: "Mai", ca: 5500000 },
    { name: "Join", ca: 6700000 },
]

const dataDossiers = [
    { name: "Civil", value: 45 },
    { name: "Pénal", value: 25 },
    { name: "Affaires", value: 30 },
]

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"]

export default function StatisticsPage() {
    return (
        <div className="space-y-6 container mx-auto py-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Pilotage Stratégique</h1>
                    <p className="text-slate-500 mt-1 font-light italic">Tableau de bord décisionnel des associés de LexPremium.</p>
                </div>
                <div className="flex gap-2">
                    <Card className="px-4 py-2 border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-600">LIVE SYNC</span>
                    </Card>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Wallet className="h-8 w-8 text-indigo-200" />
                            <Badge className="bg-white/20 text-white">+12%</Badge>
                        </div>
                        <div className="text-3xl font-black">32.8M</div>
                        <p className="text-xs text-indigo-100 uppercase tracking-widest mt-1">CA Annuel (F CFA)</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Briefcase className="h-8 w-8 text-amber-500" />
                            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-900">145</div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Dossiers Actifs</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Users className="h-8 w-8 text-indigo-500" />
                            <div className="text-xs font-bold text-slate-400">Stable</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900">12</div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Avocats & Staff</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Scale className="h-8 w-8 text-emerald-500" />
                            <ArrowDownRight className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-900">88%</div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Taux de Succès</p>
                    </CardContent>
                </Card>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                            Évolution du Chiffre d'Affaires
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataCA}>
                                <defs>
                                    <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="ca" stroke="#6366f1" fillOpacity={1} fill="url(#colorCa)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Répartition des Dossiers</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataDossiers}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataDossiers.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-4 pr-10">
                            {dataDossiers.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-sm font-bold text-slate-700">{d.name}</span>
                                    <span className="text-xs text-slate-400">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ALERT SECTION */}
            <Card className="border-dashed border-2 bg-rose-50 border-rose-200">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-rose-100 p-3 rounded-full shrink-0">
                        <AlertCircle className="h-6 w-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-rose-900 font-bold">Alerte Délais : 3 Dossiers Critiques</h4>
                        <p className="text-rose-700 text-sm">Des forclusions approchent pour les dossiers 2024-CIV-089, 2024-COM-012 et 2025-PEN-002.</p>
                    </div>
                    <Button variant="outline" className="border-rose-300 text-rose-900 hover:bg-rose-100">Agir Immédiatement</Button>
                </CardContent>
            </Card>
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${className}`}>
            {children}
        </span>
    )
}
