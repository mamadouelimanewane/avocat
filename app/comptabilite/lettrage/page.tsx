
import { prisma } from '@/lib/prisma'
import { getAccounts } from '@/app/actions'
import { LettrageClient } from '@/components/comptabilite/LettrageClient'

export default async function LettragePage() {
    // On récupère les comptes de tiers (411, 401, etc.)
    const accounts = await prisma.account.findMany({
        where: {
            OR: [
                { code: { startsWith: '411' } },
                { code: { startsWith: '401' } },
            ]
        },
        orderBy: { code: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lettrage des Comptes</h1>
                <p className="text-slate-500">Associez les règlements aux factures pour solder vos comptes de tiers.</p>
            </div>

            <LettrageClient accounts={accounts as any} />
        </div>
    )
}
