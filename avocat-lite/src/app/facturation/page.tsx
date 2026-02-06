"use client"

import {
    Plus,
    FileText,
    Download,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Receipt,
    Wand2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { DocumentGenerator } from "@/components/document-generator"

const invoices = [
    {
        id: "FAC-2026-001",
        client: "M. Ibrahima Fall",
        date: "14 Jan 2026",
        amount: "450 000 FCFA",
        status: "PAYÉ",
        type: "Honoraires",
    },
    {
        id: "FAC-2026-002",
        client: "SCI Les Perles",
        date: "15 Jan 2026",
        amount: "1 250 000 FCFA",
        status: "ENVOYÉ",
        type: "Honoraires + Débours",
    },
    {
        id: "FAC-2026-003",
        client: "Mme Mariama Sarr",
        date: "16 Jan 2026",
        amount: "150 000 FCFA",
        status: "BROUILLON",
        type: "Consultation",
    }
]

export default function FacturationPage() {
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

    return (
        <div className="p-8 bg-background text-foreground min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Facturation Express</h2>
                    <p className="text-muted-foreground font-light text-sm">
                        Gérez vos honoraires et vos frais en toute simplicité.
                    </p>
                </div>
                <button className="flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-primary/20 font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Facture
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                    <div className="flex items-center gap-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Chiffre d'affaires (Mois)</span>
                    </div>
                    <p className="text-2xl font-bold">1 850 000 FCFA</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">+12% par rapport au mois dernier</p>
                </div>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                    <div className="flex items-center gap-x-2 text-amber-600 dark:text-amber-400 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">En attente de paiement</span>
                    </div>
                    <p className="text-2xl font-bold">1 250 000 FCFA</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">1 facture envoyée</p>
                </div>
                <div className="p-6 bg-muted border border-border rounded-3xl">
                    <div className="flex items-center gap-x-2 text-muted-foreground mb-2">
                        <Receipt className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Débours à refacturer</span>
                    </div>
                    <p className="text-2xl font-bold">75 000 FCFA</p>
                    <p className="text-xs text-muted-foreground mt-1">3 frais de greffe enregistrés</p>
                </div>
            </div>

            <div className="bg-background border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="font-bold">Factures Récentes</h3>
                    <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition">Tout voir</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Référence / Client</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Date</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Montant</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-muted/30 transition group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{invoice.id}</span>
                                            <span className="text-xs text-muted-foreground">{invoice.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md border border-border">
                                            {invoice.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-muted-foreground text-center font-mono">{invoice.date}</td>
                                    <td className="px-8 py-6 text-sm font-black">{invoice.amount}</td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                                            invoice.status === "PAYÉ" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                                                invoice.status === "ENVOYÉ" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {invoice.status === "PAYÉ" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {invoice.status === "ENVOYÉ" && <Send className="h-3 w-3 mr-1" />}
                                            {invoice.status === "BROUILLON" && <AlertCircle className="h-3 w-3 mr-1" />}
                                            {invoice.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-x-3">
                                            <button
                                                onClick={() => setSelectedInvoice({ title: `Note d'honoraires ${invoice.id}`, client: invoice.client, reference: invoice.id })}
                                                className="flex items-center gap-x-2 px-4 py-2 bg-secondary text-slate-900 rounded-xl font-bold text-[11px] hover:scale-105 transition shadow-sm"
                                            >
                                                <Wand2 className="h-3.5 w-3.5" />
                                                GÉNÉRER NOTE
                                            </button>
                                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-12 p-10 bg-[#0f172a] rounded-[3rem] text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-4">Automatisez vos relances</h3>
                        <p className="text-lg text-slate-400 font-light leading-relaxed">
                            Activez les relances intelligentes par email et WhatsApp pour les factures impayées depuis plus de 15 jours. Gagnez 30% de temps sur votre recouvrement.
                        </p>
                    </div>
                    <button className="bg-secondary text-slate-900 px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:scale-105 transition shadow-[0_0_30px_-10px_rgba(234,179,8,0.4)] whitespace-nowrap">
                        Activer l'IA Recouvrement
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-secondary/20 transition-all duration-700" />
            </div>

            {selectedInvoice && (
                <DocumentGenerator
                    dossier={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    )
}

