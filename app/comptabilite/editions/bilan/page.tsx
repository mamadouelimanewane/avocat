
import { getAccounts } from "@/app/actions"
import { calculateBilanActif, calculateBilanPassif, calculateResultat } from "@/lib/syscohada-mapper"
import { format } from "date-fns"

export default async function BilanPrint() {
    const accounts = await getAccounts()

    // We need the Net Result to balance the Passif
    const crRows = calculateResultat(accounts)
    const netResultRow = crRows.find(r => r.label === "RÉSULTAT NET")
    const netResult = netResultRow ? netResultRow.value : 0

    const actifRows = calculateBilanActif(accounts)
    const passifRows = calculateBilanPassif(accounts, netResult)

    return (
        <div className="p-8 font-serif bg-white min-h-screen text-slate-900">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Bilan (OHADA)</h1>
                    <p className="text-sm mt-1">Cabinet LEX PREMIUM</p>
                    <p className="text-xs text-slate-500">Système Comptable SYSCOHADA</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Exercice 2025</p>
                    <p className="text-xs text-slate-500">Edité le {format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 align-top">
                {/* ACTIF */}
                <div>
                    <h2 className="bg-emerald-800 text-white font-bold p-2 text-center uppercase mb-2">Actif</h2>
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            {actifRows.map((row, i) => (
                                <tr key={i} className={`border-b border-slate-100 
                                    ${row.isTotal ? 'bg-slate-100 font-bold border-t border-slate-400' : ''}
                                    ${row.highlight ? 'bg-emerald-100 text-base border-y-2 border-black font-bold' : ''}
                                    ${row.isTitle ? 'font-bold underline pt-4 uppercase text-xs text-slate-500' : ''}
                                `}>
                                    <td className="py-1 px-2">{row.label}</td>
                                    {!row.isTitle && (
                                        <td className="py-1 px-2 text-right font-mono">
                                            {(row.value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0 })}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PASSIF */}
                <div>
                    <h2 className="bg-emerald-800 text-white font-bold p-2 text-center uppercase mb-2">Passif</h2>
                    <table className="w-full text-sm border-collapse">
                        <tbody>
                            {passifRows.map((row, i) => (
                                <tr key={i} className={`border-b border-slate-100 
                                    ${row.isTotal ? 'bg-slate-100 font-bold border-t border-slate-400' : ''}
                                    ${row.highlight ? 'bg-emerald-100 text-base border-y-2 border-black font-bold' : ''}
                                    ${row.isTitle ? 'font-bold underline pt-4 uppercase text-xs text-slate-500' : ''}
                                `}>
                                    <td className="py-1 px-2">{row.label}</td>
                                    {!row.isTitle && (
                                        <td className="py-1 px-2 text-right font-mono">
                                            {(row.value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0 })}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-slate-400">
                <p>État financier généré automatiquement. Vérifiez les imputations avant clôture.</p>
            </div>

            <style>{`
                @media print {
                    body { background: white; -webkit-print-color-adjust: exact; }
                    @page { margin: 1cm; size: landscape; }
                }
            `}</style>
        </div>
    )
}
