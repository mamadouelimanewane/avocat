"use client"

import { PDFDownloadLink } from '@react-pdf/renderer'
import { InvoicePDF } from './InvoicePDF'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

export default function PDFDownloadWrapper({ facture, settings }: { facture: any, settings?: any }) {
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
