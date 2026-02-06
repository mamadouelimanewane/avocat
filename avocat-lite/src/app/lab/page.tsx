"use client"

import {
    Mic,
    MessageCircle,
    ScanEye,
    Zap,
    Handshake,
    Play,
    Loader2,
    CheckCircle2,
    Sparkles
} from "lucide-react"
import { useState } from "react"

const assistants = [
    {
        id: "dictee",
        title: "Dictée Juridique & Transcription",
        description: "Enregistrez vos notes d'audience. LexAI les transforme en compte-rendu structuré.",
        icon: Mic,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        action: "Lancer l'écoute",
    },
    {
        id: "whatsapp",
        title: "Conciergerie WhatsApp Client",
        description: "Laissez l'assistant répondre aux questions basiques de vos clients 24h/24.",
        icon: MessageCircle,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        action: "Configurer le Bot",
    },
    {
        id: "scan",
        title: "Scan & Intelligence de Pièces",
        description: "Analysez un document adverse instantanément pour en extraire les failles or les délais.",
        icon: ScanEye,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        action: "Scanner un acte",
    },
    {
        id: "veille",
        title: "Sentinelle Jurisprudentielle",
        description: "Surveillance automatique du JO et de la CCJA pour vos dossiers en cours.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        action: "Activer la veille",
    },
    {
        id: "relance",
        title: "Relances 'Zéro Conflit'",
        description: "Déléguez la réclamation d'honoraires à l'assistant pour préserver votre lien client.",
        icon: Handshake,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        action: "Automatiser",
    }
]

export default function LabPage() {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const runDemo = (id: string) => {
        setActiveId(id)
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
        }, 3000)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-x-3 mb-2">
                    <div className="p-2 bg-amber-500 rounded-xl">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Lab IA - Assistants Innovants</h2>
                </div>
                <p className="text-muted-foreground font-light text-lg">
                    Démultipliez votre capacité de travail avec nos modules d'intelligence augmentée.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {assistants.map((ast) => (
                    <div
                        key={ast.id}
                        className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                        <div>
                            <div className={`p-4 w-fit rounded-2xl ${ast.bg} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <ast.icon className={`h-8 w-8 ${ast.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{ast.title}</h3>
                            <p className="text-slate-500 font-light leading-relaxed mb-8">
                                {ast.description}
                            </p>
                        </div>

                        <button
                            onClick={() => runDemo(ast.id)}
                            disabled={isProcessing && activeId === ast.id}
                            className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-x-2"
                        >
                            {isProcessing && activeId === ast.id ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Initialisation...
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4 fill-current" />
                                    {ast.action}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Zone de démonstration interactive (Simulation) */}
            {activeId && !isProcessing && (
                <div className="mt-12 p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-x-3 mb-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <h4 className="text-lg font-bold text-emerald-900">Démonstration Activée</h4>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-emerald-200 text-slate-700 font-light italic shadow-sm">
                        {activeId === 'dictee' && "Transcription activée : 'Maître, je résume votre intervention. Le juge a semblé réceptif à l'argument sur l'article 101...'"}
                        {activeId === 'whatsapp' && "Simulation : Votre client 'Amadou Sow' a reçu une réponse automatisée concernant le calendrier de procédure."}
                        {activeId === 'scan' && "Analyse OCR : 1 délai critique détecté (Appel avant le 20/01/2026). Événement ajouté à l'agenda."}
                        {activeId === 'veille' && "Veille active : surveillance en temps réel de 3 bases juridiques pour vos dossiers 'Bail Commercial'."}
                        {activeId === 'relance' && "Relance programmée : une notification courtoise sera envoyée à SIS demain à 09h00."}
                    </div>
                </div>
            )}
        </div>
    )
}
