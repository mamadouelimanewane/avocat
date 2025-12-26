
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
            </div>

            <ClientsList initialClients={clients as any} />
        </div>
    )
}
