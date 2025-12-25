import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Clock, AlertCircle, FileCheck, Phone } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getPortalDashboardData } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function PortalDashboard() {
    const { success, client } = await getPortalDashboardData()

    if (!success || !client) {
        redirect('/client-login')
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Bonjour, {client.name}</h1>
                    <p className="text-slate-500 mt-1">Voici un aperçu de vos affaires juridiques en cours.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                    <Phone className="mr-2 h-4 w-4" />
                    Contacter mon Avocat
                </Button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Dossiers Actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{client.dossiers.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Affaires en cours de traitement</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Dernière Action</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold text-slate-900 truncate">Consultation Juridique</div>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(new Date())}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Factures à régler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{client.factures.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Documents en attente de paiement</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Dossiers List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Mes Dossiers Récents</h2>
                        <Link href="/portal/dossiers" className="text-sm text-indigo-600 hover:underline flex items-center">
                            Voir tout <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {client.dossiers.map(dossier => (
                            <Card key={dossier.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="bg-slate-50">{dossier.reference}</Badge>
                                                <Badge className={dossier.status === 'OUVERT' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                                                    {dossier.status}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-900">{dossier.title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>Mis à jour le {formatDate(dossier.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileCheck className="h-4 w-4" />
                                            <span>{dossier._count.documents} document(s)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Unpaid Invoices & Notifications */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Facturation</CardTitle>
                            <CardDescription>Règlements en attente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {client.factures.length > 0 ? (
                                client.factures.map(facture => (
                                    <div key={facture.id} className="flex justify-between items-center p-3 rounded bg-amber-50 border border-amber-100">
                                        <div>
                                            <p className="font-medium text-amber-900">{facture.number}</p>
                                            <p className="text-xs text-amber-700">Échéance : {facture.dueDate ? formatDate(facture.dueDate) : 'Immédiat'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-amber-900">{formatCurrency(facture.amount)}</p>
                                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-100">
                                                Payer
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm">
                                    <FileCheck className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    Vous êtes à jour dans vos paiements.
                                </div>
                            )}
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/portal/factures">Historique des factures</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-400" />
                                Besoin d'aide ?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-300">
                            <p className="mb-4">Notre équipe est disponible pour répondre à vos questions du Lundi au Vendredi, de 9h à 18h.</p>
                            <div className="space-y-2 font-medium text-white">
                                <p>📞 +221 33 800 00 00</p>
                                <p>📧 contact@lexpremium.sn</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
