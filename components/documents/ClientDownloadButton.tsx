"use client"

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const PDFDownloadWrapper = dynamic(
    () => import('./PDFDownloadWrapper'),
    {
        ssr: false,
        loading: () => <Button disabled variant="default" size="sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement PDF...</Button>,
    }
);

export default function ClientDownloadButton({ facture, settings }: { facture: any, settings?: any }) {
    return <PDFDownloadWrapper facture={facture} settings={settings} />
}
