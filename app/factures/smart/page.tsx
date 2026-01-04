
"use client"

import { SmartInvoiceGenerator } from "@/components/facturation/SmartInvoiceGenerator"
import { FinancialXRay } from "@/components/ai/FinancialXRay"
import { Button } from "@/components/ui/button"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SmartInvoicePage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/factures"><ArrowLeft className="h-4 w-4 mr-2" /> Retour</Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-indigo-900">IA Facturation</h1>
                    <p className="text-slate-500">Générez des factures complexes à partir d'une simple description.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <SmartInvoiceGenerator onInvoiceGenerated={(items) => console.log("Items generated:", items)} />
                </div>
                <div className="space-y-6">
                    <FinancialXRay />
                </div>
            </div>

        </div>
    )
}
