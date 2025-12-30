
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { getDossierAnalytics } from '@/app/actions'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Clock, Search, Briefcase } from 'lucide-react'

export function AnalyticalDashboardClient({ initialDossiers }: { initialDossiers: any[] }) {
    const [analytics, setAnalytics] = useState<Record<string, any>>({})
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const loadAllAnalytics = async () => {
            const results: Record<string, any> = {}
            for (const d of initialDossiers) {
                const data = await getDossierAnalytics(d.id)
                if (data) results[d.id] = data
            }
            setAnalytics(results)
        }
        loadAllAnalytics()
    }, [initialDossiers])

    const filteredDossiers = initialDossiers.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.reference.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                    type="search"
                    placeholder="Filtrer par dossier ou référence..."
                    className="pl-9 h-10 w-full max-w-md rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase text-slate-500">CA Analytique Total</p>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-bold mt-1">
                            {formatCurrency(Object.values(analytics).reduce((s, a) => s + a.revenue, 0))}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase text-slate-500">Marge Nette Globale</p>
                            <TrendingDown className="h-4 w-4 text-rose-500" />
                        </div>
                        <p className="text-2xl font-bold mt-1 text-indigo-600">
                            {formatCurrency(Object.values(analytics).reduce((s, a) => s + a.margin, 0))}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase text-slate-500">Volume Horaire</p>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold mt-1">
                            {Math.round(Object.values(analytics).reduce((s, a) => s + a.hours, 0))} h
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase text-slate-500">Rentabilité Moyenne</p>
                            <Briefcase className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold mt-1 text-emerald-600">
                            {Math.round((Object.values(analytics).filter(a => a.revenue > 0).length / initialDossiers.length) * 100)} %
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Dossier</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead className="text-right">Produits ( encaissés)</TableHead>
                            <TableHead className="text-right">Charges Directes</TableHead>
                            <TableHead className="text-right">Coût Temps</TableHead>
                            <TableHead className="text-right font-bold">Marge Analytique</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDossiers.map((d) => {
                            const data = analytics[d.id] || { revenue: 0, directCosts: 0, timeCost: 0, margin: 0, hours: 0 }
                            return (
                                <TableRow key={d.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{d.title}</span>
                                            <span className="text-[10px] text-slate-500">{d.reference}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{d.client.name}</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{formatCurrency(data.revenue)}</TableCell>
                                    <TableCell className="text-right font-mono text-xs text-rose-600">{formatCurrency(data.directCosts)}</TableCell>
                                    <TableCell className="text-right font-mono text-xs text-amber-600">
                                        {formatCurrency(data.timeCost)}
                                        <div className="text-[9px] text-slate-400">({Math.round(data.hours)}h)</div>
                                    </TableCell>
                                    <TableCell className={`text-right font-bold font-mono ${data.margin < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {formatCurrency(data.margin)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
