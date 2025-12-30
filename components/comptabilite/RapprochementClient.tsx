
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { reconcileBankEntry, importBankStatement } from '@/app/actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { Check, Loader2, Upload, AlertCircle, RefreshCcw, FileSpreadsheet } from 'lucide-react'
import { BankStatementImport } from './BankStatementImport'

interface BankLine {
    id: string
    date: string
    description: string
    amount: number
    reference?: string
}

interface AccLine {
    id: string
    debit: number
    credit: number
    transaction: {
        date: string
        description: string
    }
}

export function RapprochementClient({ initialBankLines, initialAccountingLines }: { initialBankLines: BankLine[], initialAccountingLines: AccLine[] }) {
    const [bankLines, setBankLines] = useState(initialBankLines)
    const [accLines, setAccLines] = useState(initialAccountingLines)
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
    const [selectedAccId, setSelectedAccId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const bankSelectedAmount = bankLines.find(l => l.id === selectedBankId)?.amount || 0
    const accSelectedAmount = accLines.find(l => l.id === selectedAccId) ? (accLines.find(l => l.id === selectedAccId)!.debit - accLines.find(l => l.id === selectedAccId)!.credit) : 0

    const canReconcile = selectedBankId && selectedAccId && Math.abs(bankSelectedAmount - accSelectedAmount) < 0.01

    const handleReconcile = async () => {
        if (!canReconcile) return
        setIsProcessing(true)
        const res = await reconcileBankEntry(selectedBankId!, selectedAccId!)
        if (res.success) {
            toast({ title: "Succès", description: "Pointage effectué." })
            setBankLines(bankLines.filter(l => l.id !== selectedBankId))
            setAccLines(accLines.filter(l => l.id !== selectedAccId))
            setSelectedBankId(null)
            setSelectedAccId(null)
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
        setIsProcessing(false)
    }

    const triggerSimulation = async () => {
        // En prod, ceci serait un import CSV. Ici on simule pour la démo.
        const mockLines = [
            { date: new Date(), description: "VRMT CLIENT DUPONT", amount: 150000, reference: "BNK-001" },
            { date: new Date(), description: "FRAIS TENUE COMPTE", amount: -5500, reference: "BNK-002" },
            { date: new Date(), description: "CHÈQUE 445522", amount: -120000, reference: "BNK-003" }
        ]
        const res = await importBankStatement(mockLines)
        if (res.success) {
            toast({ title: "Import réussi", description: `${res.count} lignes ajoutées.` })
            window.location.reload()
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <BankStatementImport />
                <div className="flex justify-end gap-2 pb-1">
                    <Button variant="outline" onClick={triggerSimulation} className="border-indigo-200 text-indigo-700 bg-indigo-50">
                        <Upload className="mr-2 h-4 w-4" /> Simuler Données
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bank Side */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b py-3">
                        <CardTitle className="text-sm font-bold flex items-center">
                            <RefreshCcw className="mr-2 h-4 w-4 text-indigo-500" /> RELEVÉ BANCAIRE
                        </CardTitle>
                    </CardHeader>
                    <div className="max-h-[500px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Libellé Relevé</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bankLines.map(line => (
                                    <TableRow
                                        key={line.id}
                                        className={`cursor-pointer transition-colors ${selectedBankId === line.id ? 'bg-indigo-100' : 'hover:bg-slate-50'}`}
                                        onClick={() => setSelectedBankId(line.id)}
                                    >
                                        <TableCell className="text-[10px] text-slate-500">{formatDate(line.date)}</TableCell>
                                        <TableCell className="text-sm truncate max-w-[200px]">{line.description}</TableCell>
                                        <TableCell className={`text-right font-mono text-sm ${line.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {formatCurrency(line.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Accounting Side */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b py-3">
                        <CardTitle className="text-sm font-bold flex items-center">
                            <Check className="mr-2 h-4 w-4 text-emerald-500" /> COMPTABILITÉ (JNL BQ)
                        </CardTitle>
                    </CardHeader>
                    <div className="max-h-[500px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Écriture</TableHead>
                                    <TableHead className="text-right">Solde Ecr.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accLines.map(line => (
                                    <TableRow
                                        key={line.id}
                                        className={`cursor-pointer transition-colors ${selectedAccId === line.id ? 'bg-emerald-100' : 'hover:bg-slate-50'}`}
                                        onClick={() => setSelectedAccId(line.id)}
                                    >
                                        <TableCell className="text-[10px] text-slate-500">{formatDate(line.transaction.date)}</TableCell>
                                        <TableCell className="text-sm truncate max-w-[200px]">{line.transaction.description}</TableCell>
                                        <TableCell className={`text-right font-mono text-sm`}>
                                            {formatCurrency(line.debit - line.credit)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* Reconciliation Bar */}
            <Card className={`border-2 transition-all duration-300 ${canReconcile ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-slate-200 bg-slate-50'}`}>
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold">Sélection Relevé</p>
                            <p className="font-mono text-lg">{formatCurrency(bankSelectedAmount)}</p>
                        </div>
                        <div className="text-slate-300">
                            <RefreshCcw className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold">Sélection Compta</p>
                            <p className="font-mono text-lg">{formatCurrency(accSelectedAmount)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {selectedBankId && selectedAccId && !canReconcile && (
                            <div className="flex items-center text-red-600 text-xs font-bold animate-pulse">
                                <AlertCircle className="mr-1 h-4 w-4" /> Les montants ne correspondent pas
                            </div>
                        )}
                        <Button
                            disabled={!canReconcile || isProcessing}
                            onClick={handleReconcile}
                            className={`${canReconcile ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300'}`}
                        >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Rapprocher ces écritures
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
