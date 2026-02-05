
"use client"

import { useState } from 'react'
import {
    MoreHorizontal,
    Plus,
    Receipt,
    Wallet,
    Landmark,
    FileText,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { createCarpaTransaction, reInvoiceExpense } from '@/app/actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface FinanceTabProps {
    dossierId: string
    carpaTransactions?: any[]
    expenses?: any[]
}

export default function FinanceTab({ dossierId, carpaTransactions = [], expenses = [] }: FinanceTabProps) {
    const carpaBalance = carpaTransactions.reduce((acc, tx) => acc + tx.amount, 0)
    const totalExpensesToBill = expenses.filter(e => e.status === 'TO_BILL').reduce((acc, e) => acc + e.amount, 0)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Landmark className="h-12 w-12 text-indigo-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Solde CARPA</CardDescription>
                        <CardTitle className="text-3xl font-black text-indigo-950">{formatCurrency(carpaBalance)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                            <TrendingUp className="h-3 w-3" />
                            Fonds sécurisés
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="h-12 w-12 text-amber-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-amber-500">Débours à Refacturer</CardDescription>
                        <CardTitle className="text-3xl font-black text-amber-950">{formatCurrency(totalExpensesToBill)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            {expenses.filter(e => e.status === 'TO_BILL').length} frais en attente
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Transactions</CardDescription>
                        <CardTitle className="text-3xl font-black text-slate-900">{carpaTransactions.length + expenses.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-slate-500 font-medium">Flux financiers du dossier</div>
                    </CardContent>
                </Card>
            </div>

            {/* 1. CARPA / Compte Tiers */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <Landmark className="h-6 w-6 text-indigo-600" />
                            </div>
                            Mouvements CARPA
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Historique des fonds détenus pour le compte du client.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="flex-1 md:flex-none">
                            <CarpaActionDialog
                                dossierId={dossierId}
                                type="RETRAIT"
                                onSuccess={() => window.location.reload()}
                            />
                        </div>
                        <div className="flex-1 md:flex-none">
                            <CarpaActionDialog
                                dossierId={dossierId}
                                type="DEPOT"
                                onSuccess={() => window.location.reload()}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Type / Date</TableHead>
                                <TableHead className="font-bold text-slate-700">Référence</TableHead>
                                <TableHead className="font-bold text-slate-700">Désignation</TableHead>
                                <TableHead className="text-right font-bold text-slate-700">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carpaTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center">
                                            <Landmark className="h-8 w-8 mb-2 opacity-20" />
                                            Aucune transaction CARPA enregistrée.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : carpaTransactions.map((tx) => (
                                <TableRow key={tx.id} className="hover:bg-slate-50 group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {tx.type === 'DEPOT' ?
                                                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center"><ArrowUpRight className="h-4 w-4 text-emerald-600" /></div> :
                                                <div className="h-8 w-8 rounded-full bg-rose-50 flex items-center justify-center"><ArrowDownRight className="h-4 w-4 text-rose-600" /></div>
                                            }
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-xs">{tx.type}</span>
                                                <span className="text-[10px] text-slate-400">{formatDate(tx.date)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-400">{tx.reference || '-'}</TableCell>
                                    <TableCell className="text-sm font-medium text-slate-700">{tx.description}</TableCell>
                                    <TableCell className={`text-right font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* 2. Débours & Frais */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                                <Wallet className="h-6 w-6 text-amber-600" />
                            </div>
                            Débours & Frais Clients
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Dépenses engagées par le cabinet à refacturer.</p>
                    </div>
                    <Button className="bg-slate-900 hover:bg-black rounded-xl w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Frais
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-100 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Désignation</TableHead>
                                <TableHead className="font-bold text-slate-700">Statut</TableHead>
                                <TableHead className="font-bold text-slate-700">Date</TableHead>
                                <TableHead className="text-right font-bold text-slate-700">Montant</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center">
                                            <Receipt className="h-8 w-8 mb-2 opacity-20" />
                                            Aucun frais enregistré pour ce dossier.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : expenses.map((exp) => (
                                <TableRow key={exp.id} className="hover:bg-slate-50 group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{exp.description}</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{exp.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={exp.status === 'TO_BILL' ? 'warning' : 'default'} className={cn(
                                            "rounded-full px-4 border-none font-bold text-[9px] uppercase",
                                            exp.status === 'TO_BILL' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                        )}>
                                            {exp.status === 'TO_BILL' ? 'À Facturer' : 'Facturé'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs font-medium">{formatDate(exp.date)}</TableCell>
                                    <TableCell className="text-right font-black text-slate-900">
                                        {formatCurrency(exp.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {exp.status === 'TO_BILL' && exp.type === 'DEBOURS' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 font-bold text-[10px] uppercase"
                                                    onClick={async () => {
                                                        const res = await reInvoiceExpense(exp.id)
                                                        if (res.success) {
                                                            toast({ title: "Succès", description: "Débours refacturé." })
                                                            window.location.reload()
                                                        }
                                                    }}
                                                >
                                                    Refacturer
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

function CarpaActionDialog({ dossierId, type, onSuccess }: { dossierId: string, type: 'DEPOT' | 'RETRAIT', onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    async function handleAction(formData: FormData) {
        const amount = parseFloat(formData.get('amount') as string)
        if (isNaN(amount) || amount <= 0) return

        setLoading(true)
        const res = await createCarpaTransaction({
            dossierId,
            amount: type === 'DEPOT' ? amount : -amount,
            type,
            description: formData.get('description') as string,
            beneficiary: formData.get('beneficiary') as string || undefined,
            reference: formData.get('reference') as string || undefined
        })
        setLoading(false)

        if (res.success) {
            toast({ title: "Succès", description: `Transaction CARPA de ${type} enregistrée.` })
            setIsOpen(false)
            onSuccess()
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={type === 'RETRAIT' ? "outline" : "default"} size="sm" className={cn(
                    "rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 px-6 transition-all",
                    type === 'DEPOT' ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20" : "border-slate-200 hover:bg-slate-50"
                )}>
                    {type === 'RETRAIT' ? <TrendingDown className="mr-2 h-4 w-4 text-red-600" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                    {type === 'RETRAIT' ? 'Retrait' : 'Dépôt'}
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] border-none shadow-3xl">
                <DialogHeader>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                        <Landmark className="h-6 w-6 text-indigo-600" />
                    </div>
                    <DialogTitle className="text-2xl font-black">{type === 'DEPOT' ? 'Dépôt de Fonds Tiers' : 'Retrait / Paiement CARPA'}</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Opération journalisée et traçable en comptabilité OHADA.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleAction} className="space-y-6 py-6 font-medium">
                    <div className="grid gap-2">
                        <Label htmlFor="amount" className="text-xs uppercase font-black text-slate-400 tracking-widest">Montant (F CFA)</Label>
                        <Input id="amount" name="amount" type="number" placeholder="Ex: 500000" className="h-14 rounded-2xl bg-slate-50 border-none text-xl font-black" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs uppercase font-black text-slate-400 tracking-widest">Libellé de l'opération</Label>
                        <Input id="description" name="description" placeholder="Ex: Consignation pour expertise" className="h-12 rounded-xl bg-slate-50 border-none" required />
                    </div>
                    {type === 'RETRAIT' && (
                        <div className="grid gap-2">
                            <Label htmlFor="beneficiary" className="text-xs uppercase font-black text-slate-400 tracking-widest">Bénéficiaire</Label>
                            <Input id="beneficiary" name="beneficiary" placeholder="Nom de la partie" className="h-12 rounded-xl bg-slate-50 border-none" required />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="reference" className="text-xs uppercase font-black text-slate-400 tracking-widest">Référence document</Label>
                        <Input id="reference" name="reference" placeholder="Ex: Chèque n°123456" className="h-12 rounded-xl bg-slate-50 border-none" />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className={cn(
                            "w-full h-14 rounded-2xl font-black text-lg shadow-xl transition-all",
                            type === 'DEPOT' ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                        )}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                            Confirmer {type === 'DEPOT' ? 'le dépôt' : 'le retrait'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
