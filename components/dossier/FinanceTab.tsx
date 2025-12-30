
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
    AlertCircle
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
import { formatCurrency, formatDate } from '@/lib/utils'
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

            {/* 1. CARPA / Compte Tiers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-indigo-600" />
                            Compte CARPA (Fonds Tiers)
                        </h3>
                        <p className="text-sm text-slate-500">Solde actuel: <span className={`font-bold ${carpaBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>{formatCurrency(carpaBalance)}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <CarpaActionDialog
                            dossierId={dossierId}
                            type="RETRAIT"
                            onSuccess={() => window.location.reload()}
                        />
                        <CarpaActionDialog
                            dossierId={dossierId}
                            type="DEPOT"
                            onSuccess={() => window.location.reload()}
                        />
                    </div>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carpaTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">Aucune transaction CARPA.</TableCell>
                                </TableRow>
                            ) : carpaTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-slate-500">{formatDate(tx.date)}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.type === 'DEPOT' ? 'success' : 'destructive'}>
                                            {tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(tx.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="border-t border-slate-200 my-6" />

            {/* 2. Débours & Frais */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-amber-600" />
                            Débours & Frais
                        </h3>
                        <p className="text-sm text-slate-500">Total à refacturer: <span className="font-bold text-amber-600">{formatCurrency(totalExpensesToBill)}</span></p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Frais
                    </Button>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">Aucun frais enregistré.</TableCell>
                                </TableRow>
                            ) : expenses.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell className="font-medium">{exp.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{exp.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{formatDate(exp.date)}</TableCell>
                                    <TableCell>
                                        <Badge variant={exp.status === 'TO_BILL' ? 'warning' : 'default'} className={exp.status === 'TO_BILL' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}>
                                            {exp.status === 'TO_BILL' ? 'À Facturer' : 'Facturé'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(exp.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {exp.status === 'TO_BILL' && exp.type === 'DEBOURS' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[10px] border-amber-200 text-amber-700 hover:bg-amber-50"
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                        </Button>
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
                <Button variant={type === 'RETRAIT' ? "outline" : "default"} size="sm" className={type === 'DEPOT' ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
                    {type === 'RETRAIT' ? <TrendingDown className="mr-2 h-4 w-4 text-red-600" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                    {type === 'RETRAIT' ? 'Retrait' : 'Dépôt'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'DEPOT' ? 'Dépôt de Fonds Tiers' : 'Retrait / Paiement CARPA'}</DialogTitle>
                    <DialogDescription>
                        Cette opération sera enregistrée dans le compte fonds tiers du dossier et journalisée en comptabilité.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleAction} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Montant (FCFA)</Label>
                        <Input id="amount" name="amount" type="number" placeholder="0" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Libellé de l'opération</Label>
                        <Input id="description" name="description" placeholder="Ex: Consignation pour expertise" required />
                    </div>
                    {type === 'RETRAIT' && (
                        <div className="grid gap-2">
                            <Label htmlFor="beneficiary">Bénéficiaire</Label>
                            <Input id="beneficiary" name="beneficiary" placeholder="Nom de la partie ou du tiers" required />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="reference">Référence (Chèque, Virement...)</Label>
                        <Input id="reference" name="reference" placeholder="Optionnel" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className={type === 'DEPOT' ? "bg-indigo-600" : "bg-red-600 hover:bg-red-700"}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Confirmer le {type.toLowerCase()}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
