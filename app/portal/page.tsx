import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Clock, AlertCircle, FileCheck, Phone, CreditCard, Lock, Globe } from 'lucide-react'
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
                <div className="flex gap-2">
                    <Button variant="outline" className="border-indigo-100 text-indigo-700 bg-indigo-50">
                        <Globe className="mr-2 h-4 w-4" />
                        Français (FR)
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <Phone className="mr-2 h-4 w-4" />
                        Contacter mon Avocat
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Dossiers Actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{(client.dossiers || []).length}</div>
                        <p className="text-xs text-slate-500 mt-1">Procédures en cours</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow bg-rose-50/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-rose-600 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> Prochaine Audience
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {client.events && client.events.length > 0 ? (
                            <>
                                <div className="text-sm font-bold text-slate-900 truncate">{client.events[0].title}</div>
                                <p className="text-xs text-slate-500 mt-1">{formatDate(client.events[0].startDate)}</p>
                            </>
                        ) : (
                            <>
                                <div className="text-sm font-bold text-slate-400">Aucune planifiée</div>
                                <p className="text-xs text-slate-400 mt-1">À confirmer</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Solde à régler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatCurrency((client.factures || []).reduce((acc: number, f: any) => acc + (f.amountTTC || 0), 0))}
                        </div>
                        <p className="text-xs text-amber-600 mt-1">{(client.factures || []).length} document(s) à payer</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Documents Reçus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">3</div>
                        <p className="text-xs text-slate-500 mt-1">Derniers 30 jours</p>
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
                        {(client.dossiers || []).map(dossier => (
                            <Card key={dossier.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="bg-slate-50">{dossier.reference}</Badge>
                                                <Badge className={dossier.status === 'OUVERT' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                                                    {dossier.status}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{dossier.title}</h3>
                                        </div>
                                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                                        </Button>
                                    </div>

                                    {/* Timeline Preview */}
                                    <div className="relative pt-4 pb-2">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[65%]" />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>Ouverture</span>
                                            <span className="font-bold text-indigo-600">Instruction en cours</span>
                                            <span>Clôture</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-slate-500 mt-4 border-t pt-4 border-slate-50">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>Mis à jour le {formatDate(dossier.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileCheck className="h-4 w-4" />
                                            <span>{(dossier as any)._count?.documents || 0} document(s)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {(client.dossiers || []).length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                                <FileCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500">Aucun dossier actif pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Unpaid Invoices & Notifications */}
                <div className="space-y-6">
                    <Card className="border-amber-200 bg-amber-50/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                                <CreditCard className="h-5 w-5" />
                                Factu-Express (Stripe)
                            </CardTitle>
                            <CardDescription>Règlements sécurisés en ligne</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(client.factures || []).length > 0 ? (
                                (client.factures || []).map(facture => (
                                    <div key={facture.id} className="bg-white p-3 rounded shadow-sm border border-amber-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-900">{facture.number}</p>
                                                <p className="text-xs text-slate-500">Échéance : {facture.dueDate ? formatDate(facture.dueDate) : 'Immédiat'}</p>
                                            </div>
                                            <p className="font-bold text-lg text-emerald-600">{formatCurrency((facture as any).amountTTC || 0)}</p>
                                        </div>
                                        <Button size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs">
                                            <Lock className="h-3 w-3 mr-1.5" />
                                            Payer par Carte (Prochainement)
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm bg-white rounded border border-dashed border-slate-200">
                                    <FileCheck className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    Vous êtes à jour dans vos paiements.
                                </div>
                            )}
                            <Button variant="outline" className="w-full border-amber-200 text-amber-800 hover:bg-amber-100" asChild>
                                <Link href="/portal/factures">Historique des factures</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
                        {/* Abstract Background Shape */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-400" />
                                Support Clientèle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-300 relative z-10">
                            <p className="mb-4">Notre équipe dédiée est disponible pour répondre à vos questions urgentes.</p>
                            <div className="space-y-3 font-medium text-white">
                                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                    <Phone className="h-4 w-4 text-amber-400" />
                                    <span>+221 33 800 00 00</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                    <Globe className="h-4 w-4 text-indigo-400" />
                                    <span>contact@lexpremium.sn</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
