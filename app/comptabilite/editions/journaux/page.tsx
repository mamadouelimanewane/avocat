"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getJournalEntries, getJournalStats } from "@/app/actions"
import { JournalPDF } from "@/components/documents/JournalPDF"
import { Loader2 } from "lucide-react"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Génération du Journal...</p>
    </div>,
})

export default function JournalEditionPage() {
    const searchParams = useSearchParams()
    const journalId = searchParams.get('id')

    const [transactions, setTransactions] = useState<any[]>([])
    const [journalInfo, setJournalInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!journalId) return

        Promise.all([
            getJournalEntries(journalId, 'VALIDATED'),
            getJournalStats().then(stats => stats.find(s => s.id === journalId))
        ]).then(([txs, info]) => {
            setTransactions(txs)
            setJournalInfo(info)
            setLoading(false)
        })
    }, [journalId])

    if (!journalId) return <div className="p-8 text-center text-red-500">ID Journal manquant.</div>
    if (loading) return <div className="flex items-center justify-center h-screen text-slate-500">Chargement des écritures...</div>

    return (
        <div className="h-screen w-full bg-slate-100 flex flex-col">
            <div className="p-4 bg-white border-b flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Édition : Journal {journalInfo?.code}</h1>
                <p className="text-sm text-slate-500">{journalInfo?.name}</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <PDFViewer width="100%" height="100%" className="border-none">
                    <JournalPDF
                        journalName={journalInfo?.name || "Journal"}
                        journalCode={journalInfo?.code || ""}
                        transactions={transactions}
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
