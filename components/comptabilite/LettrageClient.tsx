
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { letterTransactionLines } from '@/app/actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Link as LinkIcon, Unlink } from 'lucide-react'

interface Account {
    id: string
    code: string
    name: string
}

interface Line {
    id: string
    date: string
    description: string
    debit: number
    credit: number
    letter: string | null
    transaction: {
        date: string
        description: string
    }
}

export function LettrageClient({ accounts }: { accounts: Account[] }) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('')
    const [lines, setLines] = useState<Line[]>([])
    const [selectedLines, setSelectedLines] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const fetchLines = async (accId: string) => {
        if (!accId) return
        setLoading(true)
        try {
            const response = await fetch(`/api/comptabilite/lines?accountId=${accId}&nonLettered=true`)
            const data = await response.json()
            setLines(data)
        } catch (e) {
            toast({ title: "Erreur", description: "Impossible de charger les écritures.", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedAccountId) fetchLines(selectedAccountId)
    }, [selectedAccountId])

    const totalDebit = lines
        .filter(l => selectedLines.includes(l.id))
        .reduce((sum, l) => sum + l.debit, 0)

    const totalCredit = lines
        .filter(l => selectedLines.includes(l.id))
        .reduce((sum, l) => sum + l.credit, 0)

    const balance = Math.abs(totalDebit - totalCredit)
    const isBalanced = balance < 0.01 && selectedLines.length > 0

    const handleLetter = async () => {
        if (!isBalanced) return
        setIsProcessing(true)

        // On génère un code de lettrage simple (ex: Date + Random)
        const letterCode = Math.random().toString(36).substring(2, 4).toUpperCase()

        const res = await letterTransactionLines(selectedLines, letterCode)
        if (res.success) {
            toast({ title: "Succès", description: `Écritures lettrées avec le code ${letterCode}` })
            setSelectedLines([])
            fetchLines(selectedAccountId)
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
        setIsProcessing(false)
    }

    return (
        <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg">Sélection du compte</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger className="w-full md:w-[400px]">
                            <SelectValue placeholder="Choisir un compte client ou fournisseur..." />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedAccountId && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-3 border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50">
                            <CardTitle className="text-md">Écritures non lettrées</CardTitle>
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Libellé</TableHead>
                                    <TableHead className="text-right">Débit</TableHead>
                                    <TableHead className="text-right">Crédit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lines.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                            Aucune écriture à lettrer pour ce compte.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    lines.map((line) => (
                                        <TableRow key={line.id} className={selectedLines.includes(line.id) ? "bg-indigo-50/50" : ""}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedLines.includes(line.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSelectedLines([...selectedLines, line.id])
                                                        else setSelectedLines(selectedLines.filter(id => id !== line.id))
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">{formatDate(line.transaction.date)}</TableCell>
                                            <TableCell className="text-sm font-medium">{line.transaction.description}</TableCell>
                                            <TableCell className="text-right text-sm font-mono">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</TableCell>
                                            <TableCell className="text-right text-sm font-mono">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    <Card className="h-fit sticky top-6 border-slate-200 shadow-md">
                        <CardHeader className="bg-indigo-600 text-white">
                            <CardTitle className="text-md flex items-center">
                                <LinkIcon className="mr-2 h-4 w-4" /> Résumé Lettrage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Écritures sél. :</span>
                                <span className="font-bold">{selectedLines.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Débit :</span>
                                <span className="text-indigo-600 font-mono">{formatCurrency(totalDebit)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Crédit :</span>
                                <span className="text-emerald-600 font-mono">{formatCurrency(totalCredit)}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-semibold">Écart :</span>
                                    <Badge variant={isBalanced ? "success" : "destructive"} className="font-mono">
                                        {formatCurrency(balance)}
                                    </Badge>
                                </div>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    disabled={!isBalanced || isProcessing}
                                    onClick={handleLetter}
                                >
                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                                    Lettrer la sélection
                                </Button>
                                {!isBalanced && selectedLines.length > 0 && (
                                    <p className="text-[10px] text-red-500 mt-2 text-center">
                                        L'écart doit être nul pour lettrer.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
