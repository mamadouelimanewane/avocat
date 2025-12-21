
"use client"

import { useState } from 'react'
import {
    TrendingUp,
    PieChart,
    Download,
    FileText,
    Briefcase,
    Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from '@/lib/utils'

interface Stats {
    caAnnuel: number
    dossiersOuverts: number
    dossiersClotures: number
    tempsFacture: number
    facturesMoyenne: number
    tauxReussite: number
    topClients: { name: string, ca: number, dossiers: number }[]
    parDomaine: { domaine: string, pourcentage: number, color: string }[]
    performanceAvocats: { name: string, heures: number, ca: number, dossiers: number }[]
}

export default function RapportsDashboard({ stats }: { stats: Stats }) {
    const [periode, setPeriode] = useState('annee')

    const handleExportPDF = () => {
        alert('Export PDF en cours de génération...')
    }

    const handleExportExcel = () => {
        alert('Export Excel en cours de génération...')
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rapports & Statistiques</h1>
                    <p className="text-slate-500 mt-1">Analyse de la performance du cabinet (Données Réelles).</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={periode} onValueChange={setPeriode}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mois">Ce Mois</SelectItem>
                            <SelectItem value="trimestre">Ce Trimestre</SelectItem>
                            <SelectItem value="annee">Cette Année</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Button variant="outline" onClick={handleExportExcel}>
                        <FileText className="mr-2 h-4 w-4" /> Excel
                    </Button>
                </div>
            </div>

            {/* KPI Cards Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-emerald-500 text-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.caAnnuel)}</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> Performance Annuelle
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 text-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dossiers Actifs</CardTitle>
                        <Briefcase className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.dossiersOuverts}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.dossiersClotures} clôturés cette période
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 text-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Heures Facturées</CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tempsFacture.toFixed(0)}h</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Moyenne Facture: {formatCurrency(stats.facturesMoyenne)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 text-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Recouvrement</CardTitle>
                        <PieChart className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tauxReussite}%</div>
                        <p className="text-xs text-emerald-600 mt-1">
                            Basé sur les factures payées
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="clients" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="clients">Top Clients</TabsTrigger>
                    <TabsTrigger value="domaines">Par Juridiction</TabsTrigger>
                    {/* <TabsTrigger value="avocats">Performance Avocats</TabsTrigger> */}
                </TabsList>

                <TabsContent value="clients">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Clients par Chiffre d'Affaires</CardTitle>
                            <CardDescription>Vos clients les plus importants (CA Facturé).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topClients.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">Aucune donnée disponible.</div>
                                ) : stats.topClients.map((client, index) => (
                                    <div key={client.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-amber-500' :
                                                index === 1 ? 'bg-slate-400' :
                                                    index === 2 ? 'bg-amber-700' : 'bg-slate-300'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{client.name}</div>
                                                <div className="text-sm text-slate-500">{client.dossiers} dossiers</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-slate-900">{formatCurrency(client.ca)}</div>
                                            <div className="text-xs text-slate-500">CA Généré</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="domaines">
                    <Card>
                        <CardHeader>
                            <CardTitle>Répartition par Juridiction/Domaine</CardTitle>
                            <CardDescription>Volume de dossiers par juridiction.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.parDomaine.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500">Aucune donnée disponible.</div>
                                ) : stats.parDomaine.map(domaine => (
                                    <div key={domaine.domaine} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-700">{domaine.domaine}</span>
                                            <span className="text-slate-500">{domaine.pourcentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3">
                                            <div
                                                className={`bg-indigo-500 h-3 rounded-full transition-all duration-500`}
                                                style={{ width: `${domaine.pourcentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
