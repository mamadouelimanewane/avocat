
"use client"

import { useEffect, useState } from 'react'
import { getClientPortalData } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Landmark,
    FileText,
    Receipt,
    Clock,
    Download,
    MessageSquare,
    LogOut,
    ExternalLink,
    ShieldCheck,
    Briefcase
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ClientPortalDashboard() {
    const [client, setClient] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const session = localStorage.getItem('client_session')
        if (!session) {
            router.push('/portal/login')
            return
        }

        const { id } = JSON.parse(session)
        async function load() {
            const data = await getClientPortalData(id)
            setClient(data)
            setLoading(false)
        }
        load()
    }, [router])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Landmark className="h-10 w-10 text-slate-300 animate-pulse" />
                <p className="text-slate-400 text-sm animate-pulse">Chargement de votre espace sécurisé...</p>
            </div>
        </div>
    )

    const allDossiers = client.dossiers || []
    const allFactures = allDossiers.flatMap((d: any) => d.factures || [])
    const unpaidFactures = allFactures.filter((f: any) => f.status !== 'PAYEE')

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header / Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-2 rounded-lg">
                        <Landmark className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="font-black text-slate-900 tracking-tight">LEXAPP <span className="text-slate-400 font-medium">| PORTAIL</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-900">{client.name}</p>
                        <p className="text-[10px] text-emerald-600 flex items-center justify-end gap-1">
                            <ShieldCheck className="h-2 w-2" /> Session Sécurisée
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                        localStorage.removeItem('client_session')
                        router.push('/portal/login')
                    }} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            <main className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Bonjour, {client.name.split(' ')[0]}</h1>
                        <p className="text-slate-500">Bienvenue sur votre espace de suivi juridique.</p>
                    </div>
                    <Button className="bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all">
                        <MessageSquare className="mr-2 h-4 w-4" /> Contacter le Cabinet
                    </Button>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold text-slate-500">Mes Dossiers en cours</CardDescription>
                            <CardTitle className="text-3xl font-black text-slate-900 flex items-center justify-between">
                                {allDossiers.length}
                                <Briefcase className="h-6 w-6 text-indigo-500 opacity-20" />
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold text-slate-500">Mes Actes Signés</CardDescription>
                            <CardTitle className="text-3xl font-black text-slate-900 flex items-center justify-between">
                                {allDossiers.reduce((acc: number, d: any) => acc + (d.documents?.length || 0), 0)}
                                <FileText className="h-6 w-6 text-emerald-500 opacity-20" />
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="border-slate-200 border-amber-200 bg-amber-50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] uppercase font-bold text-amber-600">Factures à régler</CardDescription>
                            <CardTitle className="text-3xl font-black text-amber-700 flex items-center justify-between">
                                {unpaidFactures.length}
                                <Receipt className="h-6 w-6 text-amber-500 opacity-20" />
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* List of Dossiers */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b">
                            <CardTitle className="text-lg">Mes Dossiers</CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Détails</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allDossiers.map((d: any) => (
                                    <TableRow key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold text-indigo-600">{d.reference}</TableCell>
                                        <TableCell className="font-medium text-slate-900 truncate max-w-[200px]">{d.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={d.status === 'OUVERT' ? 'success' : 'secondary'}>{d.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Important Documents */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b">
                            <CardTitle className="text-lg">Documents & Actes Signés</CardTitle>
                        </CardHeader>
                        <div className="p-0">
                            {allDossiers.flatMap((d: any) => d.documents).length === 0 ? (
                                <div className="p-8 text-center">
                                    <FileText className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                                    <p className="text-slate-400 text-sm">Aucun document disponible.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableBody>
                                        {allDossiers.flatMap((d: any) => (d.documents || []).map((doc: any) => (
                                            <TableRow key={doc.id} className="hover:bg-emerald-50/30 transition-colors group">
                                                <TableCell className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-100 rounded text-emerald-700">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                                                        <p className="text-[10px] text-slate-400">Signé le {formatDate(doc.signedAt)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" className="h-8 text-[10px] group-hover:bg-white">
                                                        <Download className="mr-2 h-3 w-3" /> Télécharger
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Billing Section */}
                <Card className="border-slate-200 shadow-xl overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" /> Mes Factures & Règlements
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>N° Facture</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Dossier</TableHead>
                                <TableHead>Montant TTC</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allFactures.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">Aucune facture enregistrée.</TableCell>
                                </TableRow>
                            ) : allFactures.map((f: any) => (
                                <TableRow key={f.id}>
                                    <TableCell className="font-bold">{f.number}</TableCell>
                                    <TableCell>{formatDate(f.issueDate)}</TableCell>
                                    <TableCell className="text-xs text-slate-500 italic">
                                        {allDossiers.find((d: any) => d.id === f.dossierId)?.title}
                                    </TableCell>
                                    <TableCell className="font-black text-slate-900">{formatCurrency(f.amountTTC)}</TableCell>
                                    <TableCell>
                                        <Badge variant={f.status === 'PAYEE' ? 'success' : 'warning'}>
                                            {f.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {f.status !== 'PAYEE' ? (
                                            <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600 text-xs h-8">
                                                Payer en ligne
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                Reçu PDF
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </main>
        </div>
    )
}
