import { getPortalAllInvoices } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, CreditCard, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function PortalInvoicesPage() {
    const { success, factures } = await getPortalAllInvoices()

    if (!success) {
        redirect('/portal')
    }

    const unpaidTotal = (factures || [])
        .filter((f: any) => f.status !== 'PAYEE' && f.status !== 'ANNULEE')
        .reduce((sum: number, f: any) => sum + (f.amount || 0), 0)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/portal" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Retour au tableau de bord
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Mes Factures</h1>
                    <p className="text-slate-500 mt-1">Gérez vos paiements et téléchargez vos justificatifs fiscaux.</p>
                </div>
                <Card className="bg-indigo-600 text-white border-none shadow-lg px-6 py-4 flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider font-medium text-indigo-100">Total à régler</span>
                    <span className="text-2xl font-bold">{formatCurrency(unpaidTotal)}</span>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[100px]">N° Facture</TableHead>
                            <TableHead>Date d'émission</TableHead>
                            <TableHead>Échéance</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(factures || []).map((facture: any) => (
                            <TableRow key={facture.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium text-slate-900">{facture.number}</TableCell>
                                <TableCell className="text-slate-600">{formatDate(facture.date)}</TableCell>
                                <TableCell className="text-slate-600">
                                    {facture.dueDate ? formatDate(facture.dueDate) : 'Immédiat'}
                                    {facture.status !== 'PAYEE' && facture.dueDate && new Date(facture.dueDate) < new Date() && (
                                        <Badge variant="outline" className="ml-2 text-rose-600 bg-rose-50 border-rose-100 p-0 h-auto">
                                            <AlertCircle className="h-3 w-4 mr-1" /> En retard
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge className={
                                        facture.status === 'PAYEE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                            facture.status === 'BROUILLON' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' :
                                                'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    }>
                                        {facture.status === 'PAYEE' ? (
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Payée</span>
                                        ) : facture.status === 'EN_ATTENTE' ? (
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> En attente</span>
                                        ) : facture.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900">
                                    {formatCurrency(facture.amount || 0)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    {facture.status !== 'PAYEE' && (
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                            <CreditCard className="h-4 w-4 mr-2" /> Payer
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Card>

                {(factures || []).length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Aucune facture trouvée</p>
                        <p className="text-sm">Vous n'avez pas d'historique de facturation pour le moment.</p>
                    </div>
                )}
            </div>

            {/* Payment methods and help */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 text-white border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-indigo-400" />
                            Modes de paiement acceptés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span>Virement bancaire (Détails sur la facture)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span>Carte bancaire (Stripe Secure)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span>Orange Money / Wave (Via plateforme locale)</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                            <AlertCircle className="h-6 w-6 text-indigo-600" />
                            Une question sur votre facture ?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-indigo-800">
                        <p className="mb-4">
                            Si vous constatez une erreur ou si vous avez besoin d'un délai de paiement supplémentaire, contactez notre service comptable.
                        </p>
                        <div className="font-bold">
                            📧 comptabilite@lexpremium.sn
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
