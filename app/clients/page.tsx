
import { prisma } from '@/lib/prisma'
import { NewClientDialog } from '@/components/client/NewClientDialog'
import { ClientsList } from '@/components/client/ClientsList'

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { dossiers: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-1">Gérez votre base de contacts et prospects.</p>
                </div>
                <NewClientDialog />
            </div>

            <ClientsList initialClients={clients as any} />
        </div>
    )
}
