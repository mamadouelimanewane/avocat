
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { getVATReport } from '@/app/actions'
import { FileDown, RefreshCcw, TrendingUp, TrendingDown, Gavel, Scale } from 'lucide-react'

export function VATReportView({ initialData }: { initialData: any }) {
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())
    const [data, setData] = useState(initialData)
    const [loading, setLoading] = useState(false)

    const refreshData = async () => {
        setLoading(true)
        const d = await getVATReport(month, year)
        setData(d)
        setLoading(false)
    }

    const netValue = data.collected - data.deductible
    const isCredit = netValue < 0

    return (
        <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-slate-50">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="grid gap-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Mois</label>
                            <select
                                className="h-9 w-32 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2000, i, 1))}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Année</label>
                            <input
                                type="number"
                                className="h-9 w-24 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm outline-none"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            />
                        </div>
                        <Button onClick={refreshData} disabled={loading} variant="secondary">
                            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Calculer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3 text-rose-500" /> TVA Collectée (Dette)
                        </CardDescription>
                        <CardTitle className="text-2xl font-bold">{formatCurrency(data.collected)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">TVA facturée sur les prestations facturées durant cette période.</p>
                        <Progress value={70} className="h-1 mt-4" />
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold flex items-center">
                            <TrendingDown className="mr-1 h-3 w-3 text-emerald-500" /> TVA Déductible
                        </CardDescription>
                        <CardTitle className="text-2xl font-bold font-mono">{formatCurrency(data.deductible)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500">TVA récupérable sur vos achats et frais généraux du cabinet.</p>
                        <Progress value={40} className="h-1 mt-4" />
                    </CardContent>
                </Card>

                <Card className={`border-2 ${isCredit ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase font-bold flex items-center text-slate-900">
                            {isCredit ? <Scale className="mr-1 h-3 w-3" /> : <Gavel className="mr-1 h-3 w-3" />}
                            Position Nette
                        </CardDescription>
                        <CardTitle className={`text-2xl font-bold ${isCredit ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {formatCurrency(Math.abs(netValue))}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={isCredit ? "success" : "destructive"} className="mb-2">
                            {isCredit ? "Crédit de TVA" : "TVA à Décaisser"}
                        </Badge>
                        <p className="text-[10px] text-slate-500 italic">
                            {isCredit
                                ? "Montant à reporter sur votre prochaine déclaration."
                                : "Montant à verser à la DGID avant le 15 du mois prochain."}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <FileDown className="mr-2 h-4 w-4" /> Exporter Cerfa / Formulaire DGID
                </Button>
            </div>
        </div>
    )
}
