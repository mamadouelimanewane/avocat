
import { getAccounts } from "@/app/actions"
import { format } from "date-fns"

export default async function PrintableBalance() {
    const accounts = await getAccounts()
    const totals = {
        debit: accounts.reduce((s, a) => s + (a.balance > 0 ? a.balance : 0), 0),
        credit: accounts.reduce((s, a) => s + (a.balance < 0 ? Math.abs(a.balance) : 0), 0)
    }

    return (
        <div className="p-8 font-serif bg-white min-h-screen text-slate-900">
            {/* Print Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Balance Générale</h1>
                    <p className="text-sm mt-1">Cabinet LEX PREMIUM</p>
                    <p className="text-xs text-slate-500">Système Comptable SYSCOHADA</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Exercice 2025</p>
                    <p className="text-xs text-slate-500">Edité le {format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b border-slate-400">
                        <th className="text-left py-2 font-bold w-24">N° Compte</th>
                        <th className="text-left py-2 font-bold">Intitulé</th>
                        <th className="text-right py-2 font-bold w-32">Solde Débiteur</th>
                        <th className="text-right py-2 font-bold w-32">Solde Créditeur</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc, i) => (
                        <tr key={acc.id} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                            <td className="py-1 font-mono">{acc.code}</td>
                            <td className="py-1">{acc.name}</td>
                            <td className="py-1 text-right font-mono">
                                {acc.balance >= 0 ? acc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '-'}
                            </td>
                            <td className="py-1 text-right font-mono">
                                {acc.balance < 0 ? Math.abs(acc.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '-'}
                            </td>
                        </tr>
                    ))}
                    <tr className="border-t-2 border-slate-900 font-bold bg-slate-100">
                        <td className="py-2" colSpan={2}>TOTAUX</td>
                        <td className="py-2 text-right">{totals.debit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right">{totals.credit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                </tbody>
            </table>

            {/* Print Footer */}
            <div className="mt-12 text-center text-xs text-slate-400">
                <p>Document généré automatiquement par LexPremium ERP.</p>
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
