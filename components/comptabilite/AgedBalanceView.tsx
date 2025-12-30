
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { sendPaymentReminder } from '@/app/actions'
import { toast } from '@/components/ui/use-toast'
import { Mail, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

export function AgedBalanceView({ initialData }: { initialData: any }) {
    const { categories, details } = initialData
    const [sendingRelance, setSendingRelance] = useState<string | null>(null)

    const handleRelance = async (id: string) => {
        setSendingRelance(id)
        const res = await sendPaymentReminder(id)
        if (res.success) {
            toast({ title: "Relance envoyée", description: "Le client a été notifié par email." })
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
        setSendingRelance(null)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard title="Courant (0-30j)" amount={categories.current} color="bg-emerald-500" />
                <SummaryCard title="Late (31-60j)" amount={categories.late30} color="bg-amber-500" />
                <SummaryCard title="Late (61-90j)" amount={categories.late60} color="bg-orange-500" />
                <SummaryCard title="Critique (>90j)" amount={categories.late90} color="bg-rose-500" />
            </div>

            <Card className="border-slate-200">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-md flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-slate-500" /> Détail des Factures en Attente
                    </CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>N° Facture</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Échéance</TableHead>
                            <TableHead>Retard</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead className="text-right">Reste à payer</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {details.map((inv: any) => (
                            <TableRow key={inv.id}>
                                <TableCell className="font-mono font-bold text-xs">{inv.number}</TableCell>
                                <TableCell className="text-sm">{inv.client}</TableCell>
                                <TableCell className="text-xs">{formatDate(inv.dueDate)}</TableCell>
                                <TableCell>
                                    {inv.daysPast > 0 ? (
                                        <Badge variant="outline" className={`text-[10px] ${inv.daysPast > 30 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            <AlertTriangle className="mr-1 h-3 w-3" /> {inv.daysPast} jours
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                            <CheckCircle className="mr-1 h-3 w-3" /> À jour
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">{formatCurrency(inv.amount)}</TableCell>
                                <TableCell className="text-right font-mono text-sm font-bold text-indigo-700">{formatCurrency(inv.remaining)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-[10px]"
                                        onClick={() => handleRelance(inv.id)}
                                        disabled={sendingRelance === inv.id}
                                    >
                                        <Mail className="mr-1 h-3 w-3" />
                                        Relancer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

function SummaryCard({ title, amount, color }: { title: string, amount: number, color: string }) {
    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className={`h-1 w-full ${color}`} />
            <CardContent className="pt-4">
                <p className="text-[10px] uppercase font-bold text-slate-500">{title}</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(amount)}</p>
            </CardContent>
        </Card>
    )
}
