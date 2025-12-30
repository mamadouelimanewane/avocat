
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getAccounts } from "@/app/actions"
import { AccountingPDF } from "@/components/documents/AccountingPDF"
import { Loader2 } from "lucide-react"

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Préparation de l'édition...</div>,
})

export default function BalanceEditionPage() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAccounts().then(res => {
            setData(res)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="p-8 text-center">Chargement des comptes...</div>

    const columns = [
        { header: 'Compte', accessorKey: 'code', width: '15%' },
        { header: 'Intitulé', accessorKey: 'name', width: '45%' },
        { header: 'Type', accessorKey: 'type', width: '15%' },
        {
            header: 'Solde',
            accessorKey: 'balance',
            width: '25%',
            align: 'right' as const,
            format: (val: number) => val.toLocaleString('fr-FR') + ' F'
        },
    ]

    return (
        <div className="h-[calc(100vh-100px)] w-full bg-slate-100 p-4">
            <h1 className="text-xl font-bold mb-4 text-slate-800">Aperçu Balance Générale</h1>
            <PDFViewer width="100%" height="100%" className="rounded-lg shadow-lg">
                <AccountingPDF
                    title="Balance Générale des Comptes"
                    subtitle={`Arrêtée au ${new Date().toLocaleDateString('fr-FR')}`}
                    columns={columns}
                    data={data}
                    settings={{
                        name: "Cabinet Me Dia & Associés",
                        email: "contact@media-avocats.sn"
                    }}
                />
            </PDFViewer>
        </div>
    )
}
