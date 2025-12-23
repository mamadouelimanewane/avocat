
import { getAccounts } from "@/app/actions"
import { calculateResultat } from "@/lib/syscohada-mapper"
import { format } from "date-fns"

export default async function CompteResultatPrint() {
    const accounts = await getAccounts()

    // Separate logic for balance polarity
    // In our DB: Debit is positive on Assets/Expenses. Credit is positive on Liab/Equity? 
    // Wait, createTransaction logic:
    // Actif/Charge: newBal = old + debit - credit. (Debit increases). So Expense has POSITIVE balance.
    // Produit: newBal = old + credit - debit. (Credit increases). So Income has POSITIVE balance.
    // So both Charges and Products have POSITIVE balances in the DB if they increase.

    const rows = calculateResultat(accounts)

    return (
        <div className="p-8 font-serif bg-white min-h-screen text-slate-900">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Compte de Résultat</h1>
                    <p className="text-sm mt-1">Cabinet LEX PREMIUM</p>
                    <p className="text-xs text-slate-500">SYSCOHADA Révisé</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Exercice 2025</p>
                    <p className="text-xs text-slate-500">Edité le {format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
            </div>

            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-emerald-800 text-white font-bold">
                        <th className="text-left py-2 px-4">Libellés</th>
                        <th className="text-right py-2 px-4 w-40">Montant Net</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className={`border-b border-slate-200 
                            ${row.isTotal ? 'bg-emerald-50 font-bold border-t-2 border-emerald-800' : ''}
                            ${row.highlight ? 'bg-emerald-100 text-lg border-y-4 border-double border-emerald-900' : ''}
                        `}>
                            <td className="py-2 px-4 uppercase">{row.label}</td>
                            <td className="py-2 px-4 text-right font-mono">
                                {(row.value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0 })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-12 text-center text-xs text-slate-400">
                <p>Les montants entre parenthèses ou précédés d'un signe moins indiquent des charges ou diminutions du résultat.</p>
            </div>

            <style>{`
                @media print {
                    body { background: white; -webkit-print-color-adjust: exact; }
                    @page { margin: 1cm; size: A4; }
                }
            `}</style>
        </div>
    )
}
