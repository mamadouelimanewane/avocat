"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Target, BrainCircuit } from 'lucide-react'

interface ChartProps {
    data: any[]
}

/**
 * Graphique de croissance financière (Revenus vs Dépenses vs Objectifs)
 */
export function RevenueGrowthChart({ data }: ChartProps) {
    return (
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900">Croissance du Chiffre d'Affaires</CardTitle>
                        <CardDescription>Évolution mensuelle comparative (HT/TTC vs Objectifs)</CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1">
                        <TrendingUp className="h-4 w-4 mr-2" /> +14.2% vs l'an dernier
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            formatter={(value: any) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value), '']}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            name="Revenu Réel"
                            type="monotone"
                            dataKey="amount"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            name="Objectif Cabinet"
                            type="monotone"
                            dataKey="target"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorTarget)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

/**
 * Modèle prédictif IA (Prévision sur 6 mois)
 */
export function PredictiveForecastingChart({ history, prediction }: { history: any[], prediction: number[] }) {
    // Merge history and prediction for the chart
    const lastMonth = history[history.length - 1]
    const combinedData = [
        ...history.map(h => ({ ...h, type: 'actual' })),
        ...prediction.map((p, i) => ({
            month: `P-${i + 1}`,
            amount: p,
            type: 'forecast'
        }))
    ]

    return (
        <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-indigo-400" /> Prévisions IA (Next 6 Months)
                        </CardTitle>
                        <CardDescription className="text-slate-400">Basé sur la saisonnalité et la vélocité des règlements</CardDescription>
                    </div>
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        Confiance : 82%
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] p-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value), 'Estimé']}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fill="#6366f1"
                            fillOpacity={0.1}
                            dot={(props) => {
                                if (props.payload.type === 'forecast') {
                                    return <circle cx={props.cx} cy={props.cy} r={4} fill="#818cf8" stroke="white" strokeWidth={2} />
                                }
                                return null
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="p-6 grid grid-cols-2 gap-4 border-t border-white/10 bg-black/20">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">CA Prévu Q3</p>
                        <p className="text-lg font-black">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(prediction.slice(0, 3).reduce((a, b) => a + b, 0))}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Croissance Prévue</p>
                        <p className="text-lg font-black text-emerald-400">+{((prediction[0] / history[history.length - 1].amount - 1) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * Rentabilité par domaine (Heatmap de performance)
 */
export function DomainProfitabilityChart({ data }: ChartProps) {
    return (
        <Card className="border-none shadow-xl">
            <CardHeader>
                <CardTitle>Rentabilité par Domaine Juridique</CardTitle>
                <CardDescription>Marge nette après déduction des frais et débours</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="domain"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fontWeight: 'bold' }}
                        />
                        <Tooltip
                            formatter={(value: any) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value)}
                        />
                        <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#4f46e5' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
