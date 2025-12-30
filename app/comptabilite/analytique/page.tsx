
import { prisma } from '@/lib/prisma'
import { getDossiersList } from '@/app/actions'
import { AnalyticalDashboardClient } from '@/components/comptabilite/AnalyticalDashboardClient'

export default async function AnalyticalAccountingPage() {
    const dossiers = await prisma.dossier.findMany({
        include: {
            client: true,
            _count: {
                select: { tasks: true, documents: true, timeEntries: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Comptabilité Analytique</h1>
                <p className="text-slate-500">Analysez la rentabilité de chaque dossier et le temps passé.</p>
            </div>

            <AnalyticalDashboardClient initialDossiers={dossiers as any} />
        </div>
    )
}
