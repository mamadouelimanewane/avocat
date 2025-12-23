
import { getLedgerEntries } from "@/app/actions"
import { format } from "date-fns"

export default async function PrintableGrandLivre() {
    const entries = await getLedgerEntries()

    // Group by Account
    const grouped: any = {}
    entries.forEach(e => {
        if (!grouped[e.accountId]) {
            grouped[e.accountId] = {
                account: e.account,
                entries: [],
                sumDebit: 0,
                sumCredit: 0
            }
        }
        grouped[e.accountId].entries.push(e)
        grouped[e.accountId].sumDebit += e.debit
        grouped[e.accountId].sumCredit += e.credit
    })

    const sortedAccountIds = Object.keys(grouped).sort((a, b) => grouped[a].account.code.localeCompare(grouped[b].account.code))

    return (
        <div className="p-8 font-serif bg-white min-h-screen text-slate-900">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Grand Livre des Comptes</h1>
                    <p className="text-sm mt-1">Cabinet LEX PREMIUM</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Exercice 2025</p>
                    <p className="text-xs text-slate-500">Edité le {format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
            </div>

            <div className="space-y-8">
                {sortedAccountIds.map(accId => {
                    const group = grouped[accId]
                    return (
                        <div key={accId} className="break-inside-avoid">
                            <div className="bg-slate-100 px-4 py-2 font-bold flex justify-between border-b border-slate-300">
                                <span>{group.account.code} - {group.account.name}</span>
                                <span className="text-xs font-normal text-slate-500">Solde actuel: {group.account.balance.toLocaleString('fr-FR')}</span>
                            </div>
                            <table className="w-full text-xs mt-1 mb-4">
                                <thead className="border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="text-left w-24 py-1">Date</th>
                                        <th className="text-left w-16">Jnl</th>
                                        <th className="text-left">Libellé</th>
                                        <th className="text-right w-24">Débit</th>
                                        <th className="text-right w-24">Crédit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.entries.map((e: any) => (
                                        <tr key={e.id} className="border-b border-slate-50">
                                            <td className="py-1 font-mono">{format(new Date(e.transaction.date), 'dd/MM/yyyy')}</td>
                                            <td>{e.transaction.journal?.code}</td>
                                            <td>{e.transaction.description}</td>
                                            <td className="text-right font-mono">{e.debit > 0 ? e.debit.toLocaleString('fr-FR') : ''}</td>
                                            <td className="text-right font-mono">{e.credit > 0 ? e.credit.toLocaleString('fr-FR') : ''}</td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold bg-slate-50 border-t border-slate-300">
                                        <td colSpan={3} className="text-right py-1 pr-2">Total Période</td>
                                        <td className="text-right py-1">{group.sumDebit.toLocaleString('fr-FR')}</td>
                                        <td className="text-right py-1">{group.sumCredit.toLocaleString('fr-FR')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })}
            </div>

            <style>{`
                @media print {
                    body { background: white; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </div>
    )
}
