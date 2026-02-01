
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NewDossierDialog } from '@/components/dossier/NewDossierDialog'
import { DossiersList } from '@/components/dossier/DossiersList'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

export default async function DossiersPage() {
    let dossiers: any[] = [];
    let clientsList: any[] = [];

    try {
        dossiers = await prisma.dossier.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                client: true,
                _count: {
                    select: { documents: true, events: true, timeEntries: true }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch dossiers:", error);
        dossiers = [];
    }

    try {
        clientsList = await prisma.client.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch client list for dossiers:", error);
        clientsList = [];
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dossiers</h1>
                    <p className="text-slate-500 mt-1">Gérez vos affaires juridiques.</p>
                </div>
                <Suspense fallback={<Button variant="outline" disabled>Chargement...</Button>}>
                    <NewDossierDialog clients={clientsList} />
                </Suspense>
            </div>

            <DossiersList initialDossiers={dossiers as any} />
        </div>
    )
}
