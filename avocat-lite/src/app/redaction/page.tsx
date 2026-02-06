"use client"

import { useState } from "react"
import {
    FileEdit,
    Sparkles,
    CheckCircle,
    Download,
    Eye,
    Copy,
    PenTool,
    Wand2
} from "lucide-react"
import { cn } from "@/lib/utils"

const templates = [
    { id: "1", title: "Assignation en paiement", category: "Civil" },
    { id: "2", title: "Conclusions en défense", category: "Civil" },
    { id: "3", title: "Contrat de Travail (CDI)", category: "Social" },
    { id: "4", title: "Mise en demeure", category: "Général" },
]

export default function RedactionPage() {
    const [step, setStep] = useState(1)
    const [selectedTemplate, setSelectedTemplate] = useState("")

    return (
        <div className="p-8">
            <div className="mb-8">
                <div className="flex items-center gap-x-3 mb-2">
                    <div className="p-2 bg-slate-900 rounded-lg">
                        <PenTool className="h-6 w-6 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold">Rédaction Assistée</h2>
                </div>
                <p className="text-muted-foreground font-light">
                    LexAI rédige vos projets d'actes en quelques secondes. Votre premier assistant juridique virtuel.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Étape 1 : Choix du modèle */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center">
                            <span className="w-6 h-6 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                            Sélection du Modèle
                        </h3>
                        <div className="space-y-2">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.title)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl text-sm transition border",
                                        selectedTemplate === t.title ? "border-slate-900 bg-slate-50 font-bold" : "border-transparent hover:bg-slate-50"
                                    )}
                                >
                                    <p>{t.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">{t.category}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
                        <h3 className="font-bold mb-4 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-secondary" />
                            Mode Auto-Remplissage
                        </h3>
                        <p className="text-xs font-light text-slate-400 mb-4">
                            LexAI peut importer les données directement depuis le dossier client sélectionné.
                        </p>
                        <button className="w-full bg-secondary text-slate-900 py-3 rounded-xl font-bold text-sm hover:scale-105 transition">
                            Activer l'IA
                        </button>
                    </div>
                </div>

                {/* Étape 2 : Édition / Aperçu */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-3xl shadow-sm h-full min-h-[500px] flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-x-2">
                                <Eye className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">Aperçu du projet</span>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <button className="p-2 hover:bg-slate-200 rounded-lg transition">
                                    <Copy className="h-4 w-4 text-slate-600" />
                                </button>
                                <button className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter .DOCX
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex-1">
                            {!selectedTemplate ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <Wand2 className="h-16 w-16 mb-4" />
                                    <p className="text-sm">Sélectionnez un modèle pour commencer la rédaction.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="text-center font-bold underline text-lg mb-8 uppercase">
                                        {selectedTemplate}
                                    </div>
                                    <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                                        <p>À l'attention de Monsieur le Président du Tribunal de Commerce de Dakar.</p>
                                        <p className="font-bold">POUR :</p>
                                        <p>Maitre **[Nom_Avocat]**, agissant pour le compte de **[Nom_Client]**...</p>
                                        <p className="font-bold">CONTRE :</p>
                                        <p>**[Partie_Adverse]**...</p>
                                        <p className="mt-8 italic">
                                            "C'est ici que l'IA génère les faits, les moyens et les prétentions en se basant sur la jurisprudence OHADA..."
                                        </p>
                                        <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
