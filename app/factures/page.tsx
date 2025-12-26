
import { prisma } from '@/lib/prisma'
import { NewInvoiceDialog } from '@/components/factures/NewInvoiceDialog'
import { FacturesList } from '@/components/factures/FacturesList'

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
                    <NewInvoiceDialog clients={clients} />
                </div>
            </div>

            <FacturesList initialFactures={factures as any} />
        </div>
    )
}
