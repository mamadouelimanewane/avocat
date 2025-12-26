"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAccounts, createTransaction, getDraftTransactions, validateJournalEntries } from "@/app/actions"
import { Check, Plus, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/ui/ExportButton"

export default function JournalEntryPage({ params }: { params: { code: string } }) {
    const searchParams = useSearchParams()
    const journalId = searchParams.get('id') || ""

    // Data State
    const [accounts, setAccounts] = useState<any[]>([])
    const [drafts, setDrafts] = useState<any[]>([])

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [description, setDescription] = useState("")
    const [lines, setLines] = useState<any[]>([
        { accountId: "", debit: 0, credit: 0 },
        { accountId: "", debit: 0, credit: 0 }
    ])

    useEffect(() => {
        loadData()
    }, [journalId])

    const loadData = async () => {
        const [acc, dr] = await Promise.all([
            getAccounts(),
            getDraftTransactions(journalId)
        ])
        setAccounts(acc)
        setDrafts(dr)
    }

    const handleAddLine = () => {
        setLines([...lines, { accountId: "", debit: 0, credit: 0 }])
    }

    const updateLine = (index: number, field: string, value: any) => {
        const newLines = [...lines]
        newLines[index] = { ...newLines[index], [field]: value }
        setLines(newLines)
    }

    const handleSaveDraft = async () => {
        // Filter empty lines
        const activeLines = lines.filter(l => l.accountId && (l.debit > 0 || l.credit > 0))
        if (activeLines.length < 2) return alert("Il faut au moins 2 lignes d'écriture.")

        const res = await createTransaction(description, new Date(date), activeLines, journalId, 'DRAFT')
        if (res.success) {
            loadData()
            // Reset but keep date
            setDescription("")
            setLines([
                { accountId: "", debit: 0, credit: 0 },
                { accountId: "", debit: 0, credit: 0 }
            ])
        } else {
            alert(res.message)
        }
    }

    const handleValidateAll = async () => {
        if (!confirm("Voulez-vous valider définitivement le brouillard ? Cette action mettra à jour les soldes.")) return
        const res = await validateJournalEntries(journalId)
        if (res.success) {
            alert(`${res.count} écritures validées au Grand Livre.`)
            loadData()
        } else {
            alert(res.message)
        }
    }

    const totalDebit = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0)
    const totalCredit = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0)
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Saisie Journal: {params.code}</h1>
                    <p className="text-slate-500">Date de valeur: {date}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadData}>Actualiser</Button>
                    <ExportButton
                        data={drafts.flatMap(tx => tx.lines.map((l: any) => ({
                            Piece: tx.description,
                            Date: tx.date,
                            Compte: l.account.code,
                            Intitule: l.account.name,
                            Debit: l.debit,
                            Credit: l.credit
                        })))}
                        filename={`Journal_${params.code}_Brouillard`}
                        sheetName="Brouillard"
                        label="Exporter Brouillard"
                        variant="outline"
                    />
                    <Button
                        className={drafts.length > 0 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                        disabled={drafts.length === 0}
                        onClick={handleValidateAll}
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Valider le Brouillard ({drafts.length})
                    </Button>
                </div>
            </div>

            <Card className="border-slate-300 shadow-md">
                <CardHeader className="bg-slate-50 border-b pb-3">
                    <div className="flex gap-4 items-end">
                        <div className="w-40">
                            <label className="text-xs font-semibold">Date</label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-semibold">Libellé de la pièce</label>
                            <Input
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Ex: Facture Orange..."
                                className="bg-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Compte</TableHead>
                                <TableHead className="text-right w-[150px]">Débit</TableHead>
                                <TableHead className="text-right w-[150px]">Crédit</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lines.map((line, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Select value={line.accountId} onValueChange={v => updateLine(idx, 'accountId', v)}>
                                            <SelectTrigger className="h-8 border-transparent focus:border-slate-300">
                                                <SelectValue placeholder="Compte..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(a => (
                                                    <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8 text-right border-transparent focus:border-slate-300"
                                            value={line.debit || ''}
                                            onChange={e => updateLine(idx, 'debit', parseFloat(e.target.value))}
                                            placeholder="0"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8 text-right border-transparent focus:border-slate-300"
                                            value={line.credit || ''}
                                            onChange={e => updateLine(idx, 'credit', parseFloat(e.target.value))}
                                            placeholder="0"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {idx > 1 && <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => setLines(lines.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center p-4 bg-slate-50 border-t">
                        <Button variant="ghost" size="sm" onClick={handleAddLine}><Plus className="mr-2 h-4 w-4" /> Ajouter ligne</Button>
                        <div className="flex items-center gap-6">
                            <div className={`text-sm font-mono ${!isBalanced ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                Écart: {Math.abs(totalDebit - totalCredit).toLocaleString()}
                            </div>
                            <Button onClick={handleSaveDraft} disabled={!isBalanced || !description || !lines[0].accountId}>
                                <Save className="mr-2 h-4 w-4" /> Enregistrer Brouillard
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-slate-700">📌 Brouillard en attente (Non validé)</h3>
                {drafts.length === 0 ? (
                    <p className="text-slate-400 italic">Aucune écriture en attente.</p>
                ) : (
                    <div className="space-y-4">
                        {drafts.map(tx => (
                            <Card key={tx.id} className="bg-slate-50/50">
                                <CardContent className="p-4">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-bold text-slate-800">{tx.description}</div>
                                        <Badge variant="secondary">DRAFT</Badge>
                                    </div>
                                    <Table>
                                        <TableBody>
                                            {tx.lines.map((l: any) => (
                                                <TableRow key={l.id} className="border-0 h-8">
                                                    <TableCell className="py-0 font-mono text-xs">{l.account.code}</TableCell>
                                                    <TableCell className="py-0 text-xs">{l.account.name}</TableCell>
                                                    <TableCell className="py-0 text-right text-xs font-mono">{l.debit > 0 ? l.debit.toLocaleString() : '-'}</TableCell>
                                                    <TableCell className="py-0 text-right text-xs font-mono">{l.credit > 0 ? l.credit.toLocaleString() : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
