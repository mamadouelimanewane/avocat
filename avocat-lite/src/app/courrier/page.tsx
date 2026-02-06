"use client"

import {
    Inbox,
    Scan,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileSearch,
    ArrowUpRight,
    Sparkles,
    Calendar,
    Paperclip,
    ExternalLink,
    Filter
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const courriers = [
    {
        id: "1",
        title: "Signification d'acte - Huissier de Justice",
        date: "16/01/2026",
        sender: "Me. Camara (Huissier)",
        status: "Urgent",
        priority: "Haute",
        aiInsight: "Assignation TGI : délai de réponse de 15 jours détecté. Date limite : 31/01/2026.",
        fileType: "PDF Scanné"
    },
    {
        id: "2",
        title: "Courrier Client - Pièces Originales",
        date: "15/01/2026",
        sender: "Amadou Sow",
        status: "Traité",
        priority: "Bas",
        aiInsight: "Contient 3 titres de propriété. Indexation automatique effectuée dans le dossier TGI/2026.",
        fileType: "Dossier Physique"
    },
    {
        id: "3",
        title: "Lettre Recommandée - Mise à pied",
        date: "14/01/2026",
        sender: "Clinique du Sud",
        status: "À analyser",
        priority: "Moyenne",
        aiInsight: "Lettre de rupture de contrat. Analyse des motifs en cours (Droit du Travail).",
        fileType: "Scan IA"
    }
]

export default function CourrierPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-x-3">
                        <Inbox className="h-8 w-8 text-orange-500" />
                        Courrier & Secrétariat IA
                    </h2>
                    <p className="text-muted-foreground font-light text-lg mt-1">
                        Numérisation, indexation et analyse intelligente de vos courriers physiques.
                    </p>
                </div>
                <div className="flex gap-x-3">
                    <button className="flex items-center gap-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                        <Scan className="h-5 w-5" />
                        Scanner un Courrier
                    </button>
                    <button className="flex items-center gap-x-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition">
                        <Filter className="h-5 w-5" />
                        Filtrer
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-x-3 mb-4">
                        <div className="p-3 bg-orange-100 rounded-2xl">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">Arrivées du Jour</h3>
                    </div>
                    <div className="flex items-end gap-x-2">
                        <span className="text-4xl font-black text-slate-900">08</span>
                        <span className="text-sm text-slate-400 font-bold mb-1">DOCUMENTS</span>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm text-emerald-700">
                    <div className="flex items-center gap-x-3 mb-4">
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">Traités par IA</h3>
                    </div>
                    <div className="flex items-end gap-x-2">
                        <span className="text-4xl font-black text-emerald-900">100%</span>
                        <span className="text-sm text-slate-400 font-bold mb-1">INDEXÉ</span>
                    </div>
                </div>
                <div className="bg-[#0f172a] rounded-[2.5rem] p-8 shadow-sm text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-x-3 mb-4">
                            <div className="p-3 bg-secondary rounded-2xl">
                                <AlertCircle className="h-6 w-6 text-slate-900" />
                            </div>
                            <h3 className="font-bold">Délais Critiques</h3>
                        </div>
                        <div className="flex items-end gap-x-2">
                            <span className="text-4xl font-black text-secondary">02</span>
                            <span className="text-sm text-slate-400 font-bold mb-1 uppercase tracking-tighter">Alertes Courrier</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-xl" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-xl font-bold text-slate-900">Flux de Courrier Numérisé</h3>
                    <div className="flex gap-x-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Automatisé par LexAI</span>
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {courriers.map((courrier) => (
                        <div key={courrier.id} className="p-8 hover:bg-slate-50 transition-all flex flex-col lg:flex-row gap-8 items-start group">
                            {/* Visual Indicator of the letter */}
                            <div className="w-16 h-20 bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200 group-hover:bg-white transition-colors relative overflow-hidden">
                                <Paperclip className="h-5 w-5 text-slate-400 mb-1" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase">SCAN</span>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 animate-pulse" />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-x-4">
                                    <h4 className="text-lg font-bold text-slate-900">{courrier.title}</h4>
                                    <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                                        courrier.status === 'Urgent' ? "bg-orange-100 text-orange-600" :
                                            courrier.status === 'Traité' ? "bg-emerald-100 text-emerald-600" : "bg-sky-100 text-sky-600"
                                    )}>
                                        {courrier.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-x-4 text-sm text-slate-500 font-light">
                                    <div className="flex items-center gap-x-1">
                                        <Calendar className="h-4 w-4" />
                                        {courrier.date}
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <FileSearch className="h-4 w-4" />
                                        {courrier.sender}
                                    </div>
                                </div>

                                {/* IA Magical Zone */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-x-4">
                                    <div className="p-2 bg-slate-900 rounded-lg shrink-0">
                                        <Sparkles className="h-4 w-4 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-x-2">
                                            Analyse IA Proactive
                                        </p>
                                        <p className="text-sm text-slate-600 font-light italic leading-relaxed">
                                            "{courrier.aiInsight}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-x-2 text-[10px] font-bold bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition active:scale-95">
                                    VOIR LE SCAN
                                    <ExternalLink className="h-3 w-3" />
                                </button>
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-x-2 text-[10px] font-bold border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 transition active:scale-95">
                                    LIER AU DOSSIER
                                    <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Assistant Help */}
            <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-center gap-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-xs text-orange-800 font-medium">
                    <span className="font-bold">Astuce LexAI :</span> Vous pouvez transférer vos scans directement par WhatsApp à votre adresse LexPremium. Ils seront analysés et classés automatiquement dans vos dossiers sans intervention manuelle.
                </p>
            </div>
        </div>
    )
}
