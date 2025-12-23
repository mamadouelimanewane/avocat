"use client"

import { useState, useEffect } from "react"
import { getAccounts, getAccountHistory } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { Search, Printer } from "lucide-react"
import Link from "next/link"

export default function InterrogationComptePage() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [selectedAccountId, setSelectedAccountId] = useState("")
    const [entries, setEntries] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAccounts().then(setAccounts)
    }, [])

    const handleSearch = async (accId: string) => {
        setSelectedAccountId(accId)
        setIsLoading(true)
        const res = await getAccountHistory(accId)
        setEntries(res)
        setIsLoading(false)
    }

    const currentAccount = accounts.find(a => a.id === selectedAccountId)
    const totalDebit = entries.reduce((s, e) => s + e.debit, 0)
    const totalCredit = entries.reduce((s, e) => s + e.credit, 0)
    const solde = totalDebit - totalCredit

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Interrogation de Compte</h1>
                    <p className="text-slate-500">Consultez et lettrer les mouvements d'un compte.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="bg-slate-50 pb-4">
                    <div className="flex gap-4 items-end">
                        <div className="w-[400px]">
                            <label className="text-sm font-medium mb-1 block">Choisir un Compte</label>
                            <Select onValueChange={handleSearch}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Rechercher par numéro ou nom..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.code} - {acc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedAccountId && (
                            <Link href={`/comptabilite/editions/compte/${selectedAccountId}`} target="_blank">
                                <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Version Imprimable</Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Date</TableHead>
                                <TableHead className="w-24">Jnl</TableHead>
                                <TableHead>Pièce / Libellé</TableHead>
                                <TableHead className="text-right w-32">Débit</TableHead>
                                <TableHead className="text-right w-32">Crédit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24">Chargement...</TableCell></TableRow>
                            ) : entries.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-400">Aucun mouvement trouvé ou compte non sélectionné.</TableCell></TableRow>
                            ) : (
                                entries.map(entry => (
                                    <TableRow key={entry.id} className={entry.transaction.status === 'DRAFT' ? 'bg-amber-50/50 italic text-slate-500' : ''}>
                                        <TableCell className="font-mono">{format(new Date(entry.transaction.date), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{entry.transaction.journal?.code}</TableCell>
                                        <TableCell>{entry.transaction.description}</TableCell>
                                        <TableCell className="text-right font-mono text-slate-700">
                                            {entry.debit > 0 ? entry.debit.toLocaleString('fr-FR') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-700">
                                            {entry.credit > 0 ? entry.credit.toLocaleString('fr-FR') : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {selectedAccountId && (
                        <div className="bg-slate-100 p-4 border-t flex justify-end gap-12 font-bold font-mono text-lg">
                            <div className="text-slate-600">Total Mouvements</div>
                            <div className="text-emerald-700">Débit: {totalDebit.toLocaleString('fr-FR')}</div>
                            <div className="text-red-700">Crédit: {totalCredit.toLocaleString('fr-FR')}</div>
                            <div className="border-l pl-12 text-black">
                                Solde: {Math.abs(solde).toLocaleString('fr-FR')} {solde >= 0 ? '(D)' : '(C)'}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
