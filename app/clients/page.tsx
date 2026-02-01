
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NewClientDialog } from '@/components/client/NewClientDialog'
import { ClientsList } from '@/components/client/ClientsList'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

export default async function ClientsPage() {
    let clients: any[] = [];
    try {
        clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { dossiers: true }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        clients = [];
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-1">Gérez votre base de contacts et prospects.</p>
                </div>
                <Suspense fallback={<Button className="bg-emerald-600 text-white" disabled>Chargement...</Button>}>
                    <NewClientDialog />
                </Suspense>
            </div>

            <ClientsList initialClients={clients as any} />
        </div>
    )
}
