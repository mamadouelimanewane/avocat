
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

// Mock Data (In real app, this comes from props or fetch)
const mockExpenses = [
    { id: 1, description: "Frais de déplacement - Taxi", amount: 15000, date: "2025-12-08", status: "TO_BILL", category: "DEPLACEMENT" },
    { id: 2, description: "Repas Client", amount: 45000, date: "2025-12-07", status: "BILLED", category: "REPAS" },
];

const mockCarpa = [
    { id: 1, reference: "CARPA-2025-098", date: "2025-12-01", type: "DEPOT", amount: 5000000, description: "Séquestre Vente Immeuble", beneficiary: "Cabinet" },
    { id: 2, reference: "CARPA-2025-102", date: "2025-12-05", type: "RETRAIT", amount: -250000, description: "Frais de Greffe", beneficiary: "Greffe TGI" },
]

export default function FinanceTab({ dossierId }: { dossierId: string }) {
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
                        <p className="text-sm text-slate-500">Solde actuel: <span className="font-bold text-slate-900">{formatCurrency(4750000)}</span></p>
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
                            {mockCarpa.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="text-slate-500">{tx.date}</TableCell>
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
                        <p className="text-sm text-slate-500">Total à refacturer: <span className="font-bold text-amber-600">{formatCurrency(15000)}</span></p>
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
                            {mockExpenses.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell className="font-medium">{exp.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{exp.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{exp.date}</TableCell>
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
