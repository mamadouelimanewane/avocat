import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getLedgerEntries, getJournals } from "@/app/actions"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function GrandLivrePage() {
    const entries = await getLedgerEntries()
    const journals = await getJournals()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Grand Livre
                </h1>
                <div className="flex gap-2">
                    {/* Add Filter Component here later */}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mouvements Comptables (Exercice 2025)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Jnl</TableHead>
                                <TableHead>Compte</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead className="text-right">Débit</TableHead>
                                <TableHead className="text-right">Crédit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Aucune écriture comptable dans cette période.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-slate-50">
                                        <TableCell className="font-mono text-xs text-slate-500">
                                            {format(new Date(entry.transaction.date), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {entry.transaction.journal?.code || 'GEN'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-indigo-700">
                                            {entry.account.code} - {entry.account.name}
                                        </TableCell>
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
                </CardContent>
            </Card>
        </div>
    )
}
