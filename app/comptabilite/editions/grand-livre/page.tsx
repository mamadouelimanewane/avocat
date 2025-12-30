"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getLedgerEntries } from "@/app/actions"
import { LedgerPDF } from "@/components/documents/LedgerPDF"
import { Loader2 } from "lucide-react"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Génération du Grand Livre...</p>
    </div>,
})

export default function GrandLivreEditionPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLedgerEntries().then(entries => {
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
            setData(grouped)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="flex items-center justify-center h-screen text-slate-500">Préparation des données...</div>

    return (
        <div className="h-screen w-full bg-slate-100 flex flex-col">
            <div className="p-4 bg-white border-b flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Édition : Grand Livre des Comptes</h1>
                <p className="text-sm text-slate-500">Sénégal - Exercice 2025</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <PDFViewer width="100%" height="100%" showToolbar={true} className="border-none">
                    <LedgerPDF
                        data={data}
                        settings={{
                            name: "Cabinet Me Dia & Associés",
                            email: "contact@media-avocats.sn"
                        }}
                    />
                </PDFViewer>
            </div>
        </div>
    )
}
