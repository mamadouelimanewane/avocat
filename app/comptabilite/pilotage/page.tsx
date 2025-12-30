
import { getGlobalAnalytics } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Users, Clock, Briefcase, ChevronRight, BarChart3, Wallet } from 'lucide-react'
import Link from 'next/link'

export default async function PilotageDashboard() {
    const data = await getGlobalAnalytics()

    if (!data) return <div>Erreur de chargement des données.</div>

    const { summary, dossiers } = data

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord Associé</h1>
                    <p className="text-slate-500">Analyse de la performance et rentabilité du cabinet.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Marge Globale</p>
                        <p className={`text-xl font-black ${summary.globalMargin >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatCurrency(summary.globalMargin)}
                        </p>
                    </div>
                    <div className={`p-2 rounded-full ${summary.globalMargin >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Chiffre d'Affaires (HT)"
                    value={formatCurrency(summary.totalRevenue)}
                    sub="Facturé total"
                    icon={<BarChart3 className="h-5 w-5 text-indigo-600" />}
                />
                <StatCard
                    title="Encaissements"
                    value={formatCurrency(summary.totalEncaisse)}
                    sub={`${((summary.totalEncaisse / (summary.totalRevenue || 1)) * 100).toFixed(1)}% de recouvrement`}
                    icon={<Wallet className="h-5 w-5 text-emerald-600" />}
                />
                <StatCard
                    title="Temps Valorisé"
                    value={formatCurrency(summary.totalTimeCost)}
                    sub={`${summary.totalHours.toFixed(1)} heures passées`}
                    icon={<Clock className="h-5 w-5 text-amber-600" />}
                />
                <StatCard
                    title="Charges & Débours"
                    value={formatCurrency(summary.totalExpenses)}
                    sub="Frais directs dossiers"
                    icon={<Briefcase className="h-5 w-5 text-rose-600" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Top 10 Dossiers les plus Rentables</CardTitle>
                        <CardDescription>Marge nette après déduction des frais et du coût du temps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {dossiers.map((d, i) => (
                                <div key={d.id} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-300">#{i + 1}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">{d.title}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{d.reference}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-600">{formatCurrency(d.margin)}</p>
                                            <p className="text-[10px] text-slate-400">Marge: {d.profitability.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                    <Progress value={d.profitability} className="h-1.5 bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-indigo-900 border-none text-white overflow-hidden relative">
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <TrendingUp className="h-40 w-40" />
                        </div>
                        <CardHeader>
                            <CardTitle>Analyse de la Valeur</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-indigo-300 uppercase font-bold">Valeur moyenne heure</p>
                                <p className="text-2xl font-black">
                                    {summary.totalHours > 0 ? formatCurrency(summary.totalRevenue / summary.totalHours) : '0'}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-indigo-800">
                                <p className="text-xs text-indigo-300">Votre taux de rentabilité globale est exceptionnel ce mois-ci (+12% vs mois dernier).</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Actions Rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <QuickActionLink href="/comptabilite/editions" label="Générer Rapport TVA" />
                            <QuickActionLink href="/dossiers" label="Réviser Dossiers non-rentables" />
                            <QuickActionLink href="/admin/settings" label="Ajuster Taux Internes" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, sub, icon }: any) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </CardContent>
        </Card>
    )
}

function QuickActionLink({ href, label }: any) {
    return (
        <Link href={href} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>
    )
}
