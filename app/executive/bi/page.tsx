"use client"

import { useEffect, useState } from 'react'
import { RevenueGrowthChart, PredictiveForecastingChart, DomainProfitabilityChart } from '@/components/bi/BICharts'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Briefcase,
    PiggyBank,
    Calculator,
    Loader2,
    BrainCircuit,
    Filter,
    Download,
    Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { predictFutureRevenue } from '@/lib/analytics-service'

export default function BIDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [months, setMonths] = useState(12)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const res = await fetch(`/api/bi/stats?months=${months}`)
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [months])

    if (loading || !stats) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">L'IA analyse vos performances financières...</p>
            </div>
        )
    }

    const futureRevenue = predictFutureRevenue(stats.monthlyRevenue, 6)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                        Executive BI & IA
                        <Badge className="bg-indigo-600 text-white border-none font-bold px-3">PREMIUM v3.0</Badge>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Analyse prédictive et pilotage de la rentabilité du cabinet.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border-2 border-slate-100 p-1 rounded-xl flex">
                        {[6, 12, 24].map((m) => (
                            <Button
                                key={m}
                                variant={months === m ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setMonths(m)}
                                className={`text-xs font-bold ${months === m ? 'bg-slate-900' : ''}`}
                            >
                                {m} Mois
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" className="font-bold border-2 hidden sm:flex">
                        <Download className="mr-2 h-4 w-4" /> Rapport PDF
                    </Button>
                </div>
            </div>

            {/* KPI Overviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIWidget
                    title="Chiffre d'Affaires"
                    value={stats.summary.totalCA}
                    icon={DollarSign}
                    color="blue"
                    change="+12.5%"
                    trending="up"
                />
                <KPIWidget
                    title="Charges & Frais"
                    value={stats.summary.totalExpenses}
                    icon={PiggyBank}
                    color="rose"
                    change="-4.2%"
                    trending="up"
                />
                <KPIWidget
                    title="Bénéfice Net"
                    value={stats.summary.netProfit}
                    icon={Calculator}
                    color="emerald"
                    change="+18.7%"
                    trending="up"
                />
                <KPIWidget
                    title="Dossiers Actifs"
                    value={stats.summary.activeDossiers}
                    icon={Briefcase}
                    color="amber"
                    change="+3"
                    trending="up"
                    isCurrency={false}
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <RevenueGrowthChart data={stats.monthlyRevenue} />
                </div>
                <div>
                    <PredictiveForecastingChart history={stats.monthlyRevenue} prediction={futureRevenue} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DomainProfitabilityChart data={stats.profitabilityByDomain} />

                {/* IA Smart Insight Panel */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                        <BrainCircuit className="h-48 w-48 text-indigo-600" />
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <BrainCircuit className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Recommandations LexAI</h3>
                        </div>

                        <div className="space-y-4">
                            <InsightItem
                                type="opportunity"
                                title="Optimisation du Droit Commercial"
                                text="Le domaine Commercial génère 45% de votre CA avec seulement 20% des charges. Pensez à augmenter votre budget marketing sur ce segment."
                            />
                            <InsightItem
                                type="warning"
                                title="Alerte Trésorerie Q4"
                                text="Les prévisions indiquent une baisse saisonnière de 12% en Décembre. Prévoyez une campagne de recouvrement agressive en Novembre."
                            />
                            <InsightItem
                                type="success"
                                title="Efficacité Record"
                                text="Votre marge nette a augmenté de 5.2 points ce trimestre grâce à la réduction des frais de déplacement (merci la Visio !)."
                            />
                        </div>

                        <Button className="w-full bg-slate-900 text-white hover:bg-black font-bold h-12 mt-4">
                            Générer Stratégie Complète (LexAI)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function KPIWidget({ title, value, icon: Icon, color, change, trending, isCurrency = true }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        rose: "bg-rose-50 text-rose-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600"
    }

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <Badge className={`${trending === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} border-none text-[10px] font-black`}>
                        {change}
                    </Badge>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {isCurrency ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value) : value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    )
}

function InsightItem({ type, title, text }: any) {
    const icons: any = {
        opportunity: { icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
        warning: { icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-100" },
        success: { icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" }
    }
    const { icon: Icon, color, bg } = icons[type]

    return (
        <div className="flex gap-4 p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-10 w-10 shrink-0 rounded-full ${bg} ${color} flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{text}</p>
            </div>
        </div>
    )
}
