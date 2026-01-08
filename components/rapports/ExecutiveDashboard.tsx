"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Users, Briefcase, Clock, Target, Download, RefreshCcw, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExecutiveDashboardProps {
    analytics: {
        kpi: {
            caRealise: number
            caPrevu: number
            tauxRecouvrement: number
            creanceEnCours: number
            margeNette: number
            caParAvocat: number
            tempsMoyenDossier: number
            dossiersActifs: number
        }
        tresorerie: {
            soldeActuel: number
            prevision30j: number
            prevision60j: number
            prevision90j: number
        }
        alertes: Array<{
            id: string
            type: 'URGENT' | 'WARNING' | 'INFO'
            titre: string
            description: string
            dossierRef?: string
        }>
        tendances: {
            ca: Array<{ mois: string, ca: number, objectif: number }>
            recouvrement: Array<{ mois: string, taux: number }>
        }
        repartition: {
            parDomaine: Array<{ domaine: string, montant: number, couleur: string }>
            parAvocat: Array<{ avocat: string, ca: number, dossiers: number }>
        }
        dossiersRisque: Array<{
            id: string
            reference: string
            client: string
            risque: 'HIGH' | 'MEDIUM' | 'LOW'
            motif: string
        }>
    }
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export function ExecutiveDashboard({ analytics }: ExecutiveDashboardProps) {
    const { kpi, tresorerie, alertes, tendances, repartition, dossiersRisque } = analytics

    const objectifAtteint = (kpi.caRealise / kpi.caPrevu) * 100

    return (
        <div className="space-y-6">
            {/* En-tête avec Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord Exécutif</h1>
                    <p className="text-slate-500 mt-1">Vision 360° du cabinet en temps réel</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCcw className="h-4 w-4" /> Actualiser
                    </Button>
                    <Button size="sm" className="bg-slate-900 gap-2">
                        <Download className="h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Alertes Critiques */}
            {alertes.filter(a => a.type === 'URGENT').length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-5 w-5" />
                            Alertes Urgentes ({alertes.filter(a => a.type === 'URGENT').length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {alertes.filter(a => a.type === 'URGENT').slice(0, 3).map(alerte => (
                            <div key={alerte.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-red-100">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900">{alerte.titre}</p>
                                    <p className="text-xs text-slate-600 mt-1">{alerte.description}</p>
                                    {alerte.dossierRef && <Badge variant="outline" className="mt-2 text-[10px]">{alerte.dossierRef}</Badge>}
                                </div>
                                <Button size="sm" variant="destructive" className="h-7 text-xs">Traiter</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-indigo-100 text-sm font-medium">CA Réalisé / Objectif</p>
                            <DollarSign className="h-5 w-5 text-indigo-200" />
                        </div>
                        <p className="text-3xl font-bold">{kpi.caRealise.toLocaleString('fr-FR')} F</p>
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-indigo-200">Objectif : {kpi.caPrevu.toLocaleString('fr-FR')} F</span>
                                <span className="font-bold">{objectifAtteint.toFixed(0)}%</span>
                            </div>
                            <Progress value={objectifAtteint} className="h-2 bg-indigo-400" indicatorClassName="bg-white" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 text-sm font-medium">Taux de Recouvrement</p>
                            <Target className="h-5 w-5 text-emerald-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{kpi.tauxRecouvrement}%</p>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            {kpi.tauxRecouvrement >= 85 ? (
                                <>
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-600 font-medium">Excellent</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-4 w-4 text-amber-500" />
                                    <span className="text-amber-600 font-medium">À surveiller</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 text-sm font-medium">Créances en Cours</p>
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{kpi.creanceEnCours.toLocaleString('fr-FR')} F</p>
                        <p className="text-xs text-slate-500 mt-2">Impayés &gt; 30 jours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 text-sm font-medium">Marge Nette</p>
                            <Zap className="h-5 w-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{kpi.margeNette.toFixed(1)}%</p>
                        <p className="text-xs text-slate-500 mt-2">CA - Charges - Temps interne</p>
                    </CardContent>
                </Card>
            </div>

            {/* Graphiques & Onglets */}
            <Tabs defaultValue="tendances" className="w-full">
                <TabsList className="bg-slate-100">
                    <TabsTrigger value="tendances">Tendances</TabsTrigger>
                    <TabsTrigger value="tresorerie">Trésorerie</TabsTrigger>
                    <TabsTrigger value="repartition">Répartition</TabsTrigger>
                    <TabsTrigger value="risques">Dossiers à Risque</TabsTrigger>
                </TabsList>

                <TabsContent value="tendances" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Évolution CA vs Objectifs</CardTitle>
                                <CardDescription>Chiffre d&apos;affaires mensuel comparé aux objectifs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={tendances.ca}>
                                        <defs>
                                            <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="mois" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="ca" stroke="#6366f1" fillOpacity={1} fill="url(#colorCA)" name="CA Réalisé" />
                                        <Line type="monotone" dataKey="objectif" stroke="#f59e0b" strokeDasharray="5 5" name="Objectif" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Taux de Recouvrement</CardTitle>
                                <CardDescription>Évolution du taux de paiement des factures</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={tendances.recouvrement}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="mois" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="taux" stroke="#10b981" strokeWidth={3} name="Taux (%)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tresorerie" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                                Prévisions de Trésorerie
                            </CardTitle>
                            <CardDescription>Projection basée sur les factures émises et échéances connues</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Solde Actuel</p>
                                    <p className="text-2xl font-bold text-slate-900">{tresorerie.soldeActuel.toLocaleString('fr-FR')} F</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs text-blue-600 uppercase font-bold mb-1">+ 30 jours</p>
                                    <p className="text-2xl font-bold text-blue-700">{tresorerie.prevision30j.toLocaleString('fr-FR')} F</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <p className="text-xs text-indigo-600 uppercase font-bold mb-1">+ 60 jours</p>
                                    <p className="text-2xl font-bold text-indigo-700">{tresorerie.prevision60j.toLocaleString('fr-FR')} F</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <p className="text-xs text-purple-600 uppercase font-bold mb-1">+ 90 jours</p>
                                    <p className="text-2xl font-bold text-purple-700">{tresorerie.prevision90j.toLocaleString('fr-FR')} F</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Note de Prudence</p>
                                    <p className="text-xs text-amber-700 mt-1">Ces prévisions sont basées sur un taux de recouvrement moyen de {kpi.tauxRecouvrement}%. Les retards de paiement client peuvent impacter significativement la trésorerie réelle.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="repartition" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">CA par Domaine Juridique</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={repartition.parDomaine}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry: any) => `${entry.domaine} (${((entry.montant / repartition.parDomaine.reduce((acc, d) => acc + d.montant, 0)) * 100).toFixed(0)}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="montant"
                                        >
                                            {repartition.parDomaine.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Performance par Avocat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {repartition.parAvocat.map((avocat, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900">{avocat.avocat}</p>
                                                    <p className="text-xs text-slate-500">{avocat.dossiers} dossiers</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-slate-900">{avocat.ca.toLocaleString('fr-FR')} F</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="risques" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Dossiers Nécessitant une Attention Particulière
                            </CardTitle>
                            <CardDescription>Analyse IA des dossiers à risque (impayés, délais critiques, conflits)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dossiersRisque.map(dossier => (
                                    <div key={dossier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Badge className={
                                                dossier.risque === 'HIGH' ? 'bg-red-500' :
                                                    dossier.risque === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                                            }>
                                                {dossier.risque}
                                            </Badge>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900">{dossier.reference}</p>
                                                <p className="text-xs text-slate-600">{dossier.client}</p>
                                                <p className="text-xs text-slate-500 mt-1 italic">{dossier.motif}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="text-xs">Voir Dossier</Button>
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
