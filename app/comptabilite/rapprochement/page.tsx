
import { prisma } from '@/lib/prisma'
import { RapprochementClient } from '@/components/comptabilite/RapprochementClient'

export default async function RapprochementPage() {
    // 1. On récupère les lignes de relevé non rapprochées
    const bankLines = await prisma.bankStatementLine.findMany({
        where: { reconciled: false },
        orderBy: { date: 'asc' }
    })

    // 2. On récupère les écritures comptables du journal de banque non rapprochées
    // Compte 5121 par défaut au Sénégal
    const account = await prisma.account.findUnique({ where: { code: '5121' } })

    const accountingLines = account ? await prisma.transactionLine.findMany({
        where: {
            accountId: account.id,
            reconciled: false
        },
        include: { transaction: true },
        orderBy: { transaction: { date: 'asc' } }
    }) : []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rapprochement Bancaire</h1>
                <p className="text-slate-500">Pointez les écritures comptables avec votre relevé bancaire réel.</p>
            </div>

            <RapprochementClient
                initialBankLines={bankLines as any}
                initialAccountingLines={accountingLines as any}
            />
        </div>
    )
}
