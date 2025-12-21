
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Plus, Download, MoreHorizontal, FileText, Wallet } from 'lucide-react'
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
import { formatCurrency, formatDate } from '@/lib/utils'
import { NewInvoiceDialog } from '@/components/factures/NewInvoiceDialog'

const prisma = new PrismaClient()

export default async function FacturesPage() {
    const factures = await prisma.facture.findMany({
        orderBy: { issueDate: 'desc' },
        include: { client: true }
    })

    const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturation & Honoraires</h1>
                    <p className="text-slate-500 mt-1">Gérez vos factures et demandes de provisions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Excel
                    </Button>
                    <NewInvoiceDialog clients={clients} />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                        {factures.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    Aucune pièce comptable enregistrée.
                                </TableCell>
                            </TableRow>
                        ) : factures.map((facture) => (
                            <TableRow key={facture.id} className="hover:bg-slate-50 group">
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
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <Link href={`/factures/${facture.id}`}>
                                            <Download className="h-4 w-4 text-slate-500" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                    </Button>
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
        case 'EMISE': variant = 'warning'; break; // Sent but not paid
        case 'PARTIELLE': variant = 'warning'; break;
        case 'BROUILLON': variant = 'secondary'; break;
        case 'ANNULEE': variant = 'destructive'; break;
        default: variant = 'outline';
    }

    return <Badge variant={variant}>{status}</Badge>
}
