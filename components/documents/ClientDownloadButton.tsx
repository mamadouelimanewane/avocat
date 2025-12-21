"use client"

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <Button disabled variant="default" size="sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Préparation...</Button>,
    }
);

import { InvoicePDF } from './InvoicePDF'

export default function ClientDownloadButton({ facture, settings }: { facture: any, settings?: any }) {
    return (
        <PDFDownloadLink
            document={<InvoicePDF data={facture} settings={settings} />}
            fileName={`Facture-${facture.number}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800" size="sm">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Télécharger PDF
                </Button>
            )}
        </PDFDownloadLink>
    )
}
