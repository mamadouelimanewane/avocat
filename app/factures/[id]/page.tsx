
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Send } from 'lucide-react'
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
import ClientDownloadButton from '@/components/documents/ClientDownloadButton'
import { InvoiceActions } from '@/components/factures/InvoiceActions'
import { getCabinetSettings } from '@/app/actions'

const prisma = new PrismaClient()

export default async function FactureDetailPage({ params }: { params: { id: string } }) {
    const facture = await prisma.facture.findUnique({
        where: { id: params.id },
        include: { client: true, items: true }
    })

    // Fetch settings for PDF data injection
    const settings = await getCabinetSettings()

    if (!facture) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <Link href="/factures" className="hover:text-slate-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Factures
                </Link>
                <span>/</span>
                <span className="font-medium text-slate-900">{facture.number}</span>
            </div>

            {/* Header Info */}
            <div className="flex items-start justify-between bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Facture {facture.number}</h1>
                    <div className="flex gap-2 mb-4">
                        <Badge variant={facture.status === 'PAYEE' ? 'success' : 'default'}>{facture.status}</Badge>
                        <span className="text-sm text-slate-500 flex items-center">Émise le {formatDate(facture.issueDate)}</span>
                    </div>
                    <div className="text-sm">
                        <p className="text-slate-500 uppercase text-xs tracking-wider mb-1">Client</p>
                        <p className="font-semibold text-slate-900">{facture.client.name}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <InvoiceActions facture={facture} />
                    <Button variant="outline" size="sm">
                        <Send className="mr-2 h-4 w-4" /> Envoyer
                    </Button>
                    <ClientDownloadButton facture={facture} settings={settings} />
                </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px] text-right">Qté</TableHead>
                            <TableHead className="w-[150px] text-right">Prix Unitaire</TableHead>
                            <TableHead className="w-[150px] text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facture.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Totals Section */}
                <div className="p-6 bg-slate-50 flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Total HT</span>
                            <span>{formatCurrency(facture.amountHT)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>TVA (18%)</span>
                            <span>{formatCurrency(facture.amountTVA)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2">
                            <span>Net à Payer</span>
                            <span>{formatCurrency(facture.amountTTC)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
