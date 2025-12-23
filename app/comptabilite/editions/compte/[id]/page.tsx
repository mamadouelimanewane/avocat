
import { getAccountHistory, getAccounts } from "@/app/actions"
import { prisma } from "@/lib/prisma" // Direct access for single account ref if needed or modify action
// Workaround: fetch all accounts to find name, or add getAccountById action. 
// For speed, let's use the list.

import { format } from "date-fns"

export default async function PrintableAccountPage({ params }: { params: { id: string } }) {
    const entries = await getAccountHistory(params.id)
    const account = await prisma.account.findUnique({ where: { id: params.id } })

    if (!account) return <div>Compte introuvable</div>

    const totalDebit = entries.reduce((s, e) => s + e.debit, 0)
    const totalCredit = entries.reduce((s, e) => s + e.credit, 0)
    const solde = totalDebit - totalCredit

    return (
        <div className="p-8 font-serif bg-white min-h-screen text-slate-900">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Extrait de Compte</h1>
                    <h2 className="text-xl font-mono mt-2">{account.code} - {account.name}</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Cabinet LEX PREMIUM</p>
                    <p className="text-xs text-slate-500">Edité le {format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
            </div>

            <table className="w-full text-sm border-collapse mb-8">
                <thead>
                    <tr className="border-b border-slate-400">
                        <th className="text-left py-2 w-24">Date</th>
                        <th className="text-left py-2 w-16">Jnl</th>
                        <th className="text-left py-2">Libellé</th>
                        <th className="text-right py-2 w-32">Débit</th>
                        <th className="text-right py-2 w-32">Crédit</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => (
                        <tr key={entry.id} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-slate-50/30' : ''}`}>
                            <td className="py-1 font-mono">{format(new Date(entry.transaction.date), 'dd/MM/yyyy')}</td>
                            <td className="py-1">{entry.transaction.journal?.code}</td>
                            <td className="py-1">{entry.transaction.description}</td>
                            <td className="py-1 text-right font-mono">{entry.debit > 0 ? entry.debit.toLocaleString('fr-FR') : ''}</td>
                            <td className="py-1 text-right font-mono">{entry.credit > 0 ? entry.credit.toLocaleString('fr-FR') : ''}</td>
                        </tr>
                    ))}
                    <tr className="border-t-2 border-slate-900 font-bold bg-slate-100">
                        <td className="py-2" colSpan={3}>TOTAUX</td>
                        <td className="py-2 text-right">{totalDebit.toLocaleString('fr-FR')}</td>
                        <td className="py-2 text-right">{totalCredit.toLocaleString('fr-FR')}</td>
                    </tr>
                    <tr className="border-t border-slate-900 font-bold text-lg">
                        <td className="py-4" colSpan={3}>SOLDE FINAL</td>
                        <td className="py-4 text-right underline" colSpan={2}>
                            {Math.abs(solde).toLocaleString('fr-FR')} {solde >= 0 ? '(DÉBITEUR)' : '(CRÉDITEUR)'}
                        </td>
                    </tr>
                </tbody>
            </table>

            <style>{`
                @media print {
                    body { background: white; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </div>
    )
}
