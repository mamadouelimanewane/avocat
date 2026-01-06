"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Users,
    TrendingUp,
    DollarSign,
    Target,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { type Lead } from '@/lib/lead-scoring'

interface LeadStatsProps {
    leads: Lead[]
}

export function LeadStats({ leads }: LeadStatsProps) {
    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.status === 'WON').length
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0

    const totalValue = leads.reduce((acc, lead) => acc + (lead.budget || 0), 0)
    const activePipelineValue = leads
        .filter(l => l.status !== 'WON' && l.status !== 'LOST')
        .reduce((acc, lead) => acc + (lead.budget || 0), 0)

    const stats = [
        {
            title: "Total Leads",
            value: totalLeads,
            change: "+12%",
            trending: 'up',
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Taux de Conversion",
            value: `${conversionRate.toFixed(1)}%`,
            change: "+3.2%",
            trending: 'up',
            icon: Target,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Valeur Pipeline",
            value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(activePipelineValue),
            change: "-2%",
            trending: 'down',
            icon: DollarSign,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Objectif Q1",
            value: "75%",
            change: "+5%",
            trending: 'up',
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trending === 'up' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                {stat.trending === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
