
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
                        <Button variant="outline" size="sm">
                            <TrendingDown className="mr-2 h-4 w-4 text-red-600" /> Retrait
                        </Button>
                        <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <TrendingUp className="mr-2 h-4 w-4" /> Dépôt
                        </Button>
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
