
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Download, FileText, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, Printer, Trash2, Loader2 } from 'lucide-react'
import { sendInvoiceMail } from '@/app/actions'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ExportButton } from '@/components/ui/ExportButton'

interface FactureWithClient {
    id: string
    number: string
    type: string
    issueDate: Date
    amountTTC: number
    status: string
    client: {
        name: string
        email: string | null
    }
}

interface FacturesListProps {
    initialFactures: FactureWithClient[]
}

export function FacturesList({ initialFactures }: FacturesListProps) {
    const [search, setSearch] = useState('')
    const [sendingId, setSendingId] = useState<string | null>(null)

    const handleSendEmail = async (id: string) => {
        setSendingId(id)
        const res = await sendInvoiceMail(id)
        setSendingId(null)

        if (res.success) {
            toast({ title: "Succès", description: "La facture a été envoyée au client." })
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
    }

    const handlePrint = (id: string) => {
        // Open the invoice page in a new window and trigger print
        const printWindow = window.open(`/factures/${id}?print=true`, '_blank')
    }

    const filtered = initialFactures.filter(f =>
        f.number.toLowerCase().includes(search.toLowerCase()) ||
        f.client.name.toLowerCase().includes(search.toLowerCase())
    )

    const exportData = filtered.map(f => ({
        Numero: f.number,
        Type: f.type,
        Client: f.client.name,
        Date_Emission: f.issueDate,
        Montant_TTC: f.amountTTC,
        Statut: f.status
    }))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="search"
                        placeholder="Rechercher une facture..."
                        className="pl-9 h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ExportButton
                    data={exportData}
                    filename="Liste_Factures"
                    sheetName="Factures"
                    label="Export Excel"
                    variant="outline"
                />
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b">
                            <TableHead className="w-[150px]">Numéro</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date d'émission</TableHead>
                            <TableHead>Montant TTC</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    Aucune pièce comptable trouvée.
                                </TableCell>
                            </TableRow>
                        ) : filtered.map((facture) => (
                            <TableRow key={facture.id} className="hover:bg-slate-50 group border-b">
                                <TableCell className="font-medium">
                                    <Link href={`/factures/${facture.id}`} className="flex items-center hover:underline text-primary">
                                        <FileText className="mr-2 h-4 w-4 text-slate-400" />
                                        {facture.number}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={facture.type === 'PROVISION' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}>
                                        {facture.type === 'PROVISION' ? 'PROVISION' : 'FACTURE'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{facture.client.name}</TableCell>
                                <TableCell>{formatDate(facture.issueDate)}</TableCell>
                                <TableCell className="font-semibold">{formatCurrency(facture.amountTTC)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={facture.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Télécharger PDF">
                                            <Link href={`/factures/${facture.id}?download=true`}>
                                                <Download className="h-4 w-4 text-slate-500" />
                                            </Link>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/factures/${facture.id}`} className="flex items-center">
                                                        <FileText className="mr-2 h-4 w-4" /> Voir le détail
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handlePrint(facture.id)}>
                                                    <Printer className="mr-2 h-4 w-4" /> Imprimer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSendEmail(facture.id)} disabled={sendingId === facture.id}>
                                                    {sendingId === facture.id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Mail className="mr-2 h-4 w-4" />
                                                    )}
                                                    Envoyer par Email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "default";

    switch (status) {
        case 'PAYEE': variant = 'success'; break;
        case 'EMISE': variant = 'warning'; break;
        case 'PARTIELLE': variant = 'warning'; break;
        case 'BROUILLON': variant = 'secondary'; break;
        case 'ANNULEE': variant = 'destructive'; break;
        default: variant = 'outline';
    }

    return <Badge variant={variant}>{status}</Badge>
}
