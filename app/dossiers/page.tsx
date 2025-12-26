
import { prisma } from '@/lib/prisma'
import { NewDossierDialog } from '@/components/dossier/NewDossierDialog'
import { DossiersList } from '@/components/dossier/DossiersList'

export default async function DossiersPage() {
    const dossiers = await prisma.dossier.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            client: true,
            _count: {
                select: { documents: true, events: true, timeEntries: true }
            }
        }
    })

    const clientsList = await prisma.client.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dossiers</h1>
                    <p className="text-slate-500 mt-1">Gérez vos affaires juridiques.</p>
                </div>
                <NewDossierDialog clients={clientsList} />
            </div>

            <DossiersList initialDossiers={dossiers as any} />
        </div>
    )
}
