
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NewInvoiceDialog } from '@/components/factures/NewInvoiceDialog'
import { FacturesList } from '@/components/factures/FacturesList'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wand2 } from "lucide-react"

export default async function FacturesPage() {
    let factures: any[] = [];
    let clients: any[] = [];

    try {
        factures = await prisma.facture.findMany({
            orderBy: { issueDate: 'desc' },
            include: { client: true }
        });
    } catch (error) {
        console.error("Failed to fetch invoices:", error);
        factures = [];
    }

    try {
        clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });
    } catch (error) {
        console.error("Failed to fetch clients for invoices:", error);
        clients = [];
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturation & Honoraires</h1>
                    <p className="text-slate-500 mt-1">Gérez vos factures et demandes de provisions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild className="gap-2 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                        <Link href="/factures/smart"><Wand2 className="h-4 w-4" /> Assistant IA</Link>
                    </Button>
                    <NewInvoiceDialog clients={clients} />
                </div>
            </div>

            <FacturesList initialFactures={factures as any} />
        </div>
    )
}
