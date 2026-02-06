"use client"

import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Wand2,
    Download,
    CheckCircle2
} from "lucide-react"
import { useState } from "react"
import { DocumentGenerator } from "@/components/document-generator"

const dossiersList = [
    {
        id: "1",
        title: "Affaire Fall c. État du Sénégal",
        reference: "DAK-2024-001",
        client: "M. Ibrahima Fall",
        status: "En cours",
        date: "12 Jan 2024",
    },
    {
        id: "2",
        title: "Litige Foncier Almadies",
        reference: "DAK-2024-008",
        client: "SCI Les Perles",
        status: "En cours",
        date: "15 Jan 2024",
    },
    {
        id: "3",
        title: "Divorce Sarr / Diallo",
        reference: "CIV-2024-045",
        client: "Mme Mariama Sarr",
        status: "Clos",
        date: "10 Jan 2024",
    },
]

export default function DossiersPage() {
    const [generating, setGenerating] = useState<string | null>(null)
    const [selectedDossier, setSelectedDossier] = useState<any>(null)

    const handleGenerate = (dossier: any) => {
        setGenerating(dossier.id)
        setTimeout(() => {
            setGenerating(null)
            setSelectedDossier(dossier)
        }, 1500)
    }


    return (
        <div className="p-8 bg-background text-foreground min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Gestion des Dossiers</h2>
                    <p className="text-muted-foreground font-light">
                        Retrouvez et gérez l'ensemble de vos dossiers clients.
                    </p>
                </div>
                <button className="flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/20">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Dossier
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher un dossier, un client ou une référence..."
                        className="w-full pl-12 p-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-light"
                    />
                </div>
                <button className="flex items-center border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres avancés
                </button>
            </div>

            <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dossier</th>
                            <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Référence</th>
                            <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</th>
                            <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                            <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {dossiersList.map((dossier) => (
                            <tr key={dossier.id} className="hover:bg-muted/30 transition group">
                                <td className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-primary/10 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm">{dossier.title}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-muted-foreground font-mono">{dossier.reference}</td>
                                <td className="p-6 text-sm font-medium">{dossier.client}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${dossier.status === "En cours"
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                        : "bg-muted text-muted-foreground"
                                        }`}>
                                        {dossier.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-x-3">
                                        <button
                                            onClick={() => handleGenerate(dossier)}
                                            disabled={generating === dossier.id}
                                            className={`flex items-center gap-x-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${generating === dossier.id
                                                    ? "bg-primary/50 text-white"
                                                    : "bg-secondary text-slate-900 hover:scale-105 active:scale-95 shadow-md shadow-secondary/10"
                                                }`}
                                        >
                                            {generating === dossier.id ? (
                                                <>
                                                    <Wand2 className="h-3.5 w-3.5 animate-spin" />
                                                    GENERATION...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="h-3.5 w-3.5" />
                                                    GÉNÉRER ACTE
                                                </>
                                            )}
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-lg transition">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AI Generation Message */}
            <div className="mt-8 flex items-center justify-center gap-x-2 text-[10px] text-muted-foreground font-light uppercase tracking-[0.2em]">
                <div className="h-px w-12 bg-border"></div>
                L'IA analyse les données du dossier pour pré-remplir les actes
                <div className="h-px w-12 bg-border"></div>
            </div>

            {selectedDossier && (
                <DocumentGenerator
                    dossier={selectedDossier}
                    onClose={() => setSelectedDossier(null)}
                />
            )}
        </div>
    )
}
