
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ExportButton } from '@/components/ui/ExportButton'

interface Entry {
    id: string
    debit: number
    credit: number
    account: {
        code: string
        name: string
    }
    transaction: {
        date: string | Date
        description: string
        journal?: {
            code: string
        } | null
    }
}

interface GrandLivreListProps {
    entries: Entry[]
}

export function GrandLivreList({ entries }: GrandLivreListProps) {
    const exportData = entries.map(e => ({
        Date: format(new Date(e.transaction.date), 'dd/MM/yyyy'),
        Journal: e.transaction.journal?.code || 'GEN',
        Compte_Code: e.account.code,
        Compte_Nom: e.account.name,
        Libelle: e.transaction.description,
        Debit: e.debit,
        Credit: e.credit
    }))

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mouvements Comptables (Exercice 2025)</CardTitle>
                <ExportButton
                    data={exportData}
                    filename="Grand_Livre"
                    sheetName="Mouvements"
                    label="Exporter Excel"
                    variant="outline"
                />
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
    )
}
