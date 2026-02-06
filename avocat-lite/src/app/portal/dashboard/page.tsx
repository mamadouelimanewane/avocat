
import { getPortalDashboardData } from '@/app/actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Scale, FileText, Calendar, CreditCard, ChevronRight, LogOut, Bell, Download } from 'lucide-react'

export default async function PortalDashboard() {
    const { success, client } = await getPortalDashboardData()

    if (!success || !client) {
        redirect('/portal/login')
    }

    return (
        <div className="min-h-screen bg-indigo-50/50 pb-20">
            {/* Mobile Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 p-4">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-full text-white">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">Bonjour, {(client.name || 'Client').split(' ')[0]}</h1>
                            <p className="text-xs text-indigo-500 font-medium">Espace Client Sécurisé</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                        <Bell className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="max-w-lg mx-auto p-4 space-y-6">

                {/* Status Card */}
                <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 border-none shadow-lg text-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-100 text-sm mb-1">Dossiers Actifs</p>
                                <h2 className="text-4xl font-bold">{(client.dossiers || []).length}</h2>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                                {(client.factures || []).filter(f => f.status !== 'PAYEE').length} Factures à régler
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white border-indigo-100 hover:bg-indigo-50 shadow-sm">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                        <span className="text-xs font-semibold text-slate-700">Prendre RDV</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white border-indigo-100 hover:bg-indigo-50 shadow-sm">
                        <CreditCard className="h-6 w-6 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">Payer Facture</span>
                    </Button>
                </div>

                {/* Dossiers List */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-slate-800">Mes Dossiers Récents</h3>
                        <Button variant="link" className="text-indigo-600 text-xs p-0 h-auto">Tout voir</Button>
                    </div>
                    <div className="space-y-3">
                        {(client.dossiers || []).map(dossier => (
                            <Card key={dossier.id} className="border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <div className="bg-indigo-100 p-2 rounded-md">
                                                <FileText className="h-4 w-4 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{dossier.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{dossier.reference}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600">
                                                    {dossier.status || 'En cours'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-300" />
                                </CardContent>
                            </Card>
                        ))}
                        {(client.dossiers || []).length === 0 && (
                            <div className="text-center p-8 bg-white rounded-lg border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">Aucun dossier actif.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Factures List */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-slate-800">Factures</h3>
                    </div>
                    <div className="space-y-3">
                        {(client.factures || []).map(facture => (
                            <Card key={facture.id} className="border-indigo-50 shadow-sm">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                            Facture #{facture.number}
                                            {facture.status === 'PAYEE' ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] h-5">Payée</Badge>
                                            ) : (
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] h-5">À régler</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(facture.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">{(facture.amountTTC || 0).toLocaleString()} FCFA</div>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mt-1 ml-auto">
                                            <Download className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}
