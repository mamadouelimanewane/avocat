"use client"

import {
    Mail,
    Search,
    Star,
    Inbox,
    Send,
    FileText,
    Trash2,
    Sparkles,
    ArrowRight,
    Clock,
    CheckCircle2,
    ShieldAlert
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const emails = [
    {
        id: "1",
        sender: "Amadou Sow",
        subject: "Pièces complémentaires - Dossier TGI/2026",
        preview: "Veuillez trouver ci-joint les relevés bancaires demandés pour l'audience du fond...",
        time: "10:45",
        isRead: false,
        priority: "High",
        aiTag: "ANALYSE DISPONIBLE",
        category: "Client"
    },
    {
        id: "2",
        sender: "Me. Fatou Ndiaye",
        subject: "Proposition de transaction - Affaire SIS",
        preview: "Cher confrère, suite à notre échange téléphonique, ma cliente est prête à verser...",
        time: "Hier",
        isRead: true,
        priority: "Normal",
        aiTag: "NÉGOCIATION",
        category: "Confrère"
    }
]

export default function MailPage() {
    const [selectedId, setSelectedId] = useState("1")

    return (
        <div className="flex h-[calc(100vh-2rem)] overflow-hidden">
            {/* Colonne de gauche - Liste */}
            <div className="w-1/3 border-r border-slate-100 bg-white flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Mails IA</h2>
                        <div className="p-2 bg-slate-900 rounded-xl text-white">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            placeholder="Rechercher par dossier or avocat..."
                            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {emails.map((email) => (
                        <button
                            key={email.id}
                            onClick={() => setSelectedId(email.id)}
                            className={cn(
                                "w-full p-6 text-left border-b border-slate-50 transition-all hover:bg-slate-50 relative group",
                                selectedId === email.id ? "bg-slate-50" : ""
                            )}
                        >
                            {selectedId === email.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900" />
                            )}
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-xs font-bold uppercase tracking-wider", email.isRead ? "text-slate-400" : "text-slate-900")}>
                                    {email.sender}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{email.time}</span>
                            </div>
                            <h4 className={cn("text-sm font-bold mb-1 truncate", email.isRead ? "text-slate-600" : "text-slate-900")}>
                                {email.subject}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 font-light leading-relaxed">
                                {email.preview}
                            </p>
                            <div className="mt-3 flex items-center gap-x-2">
                                <span className="text-[9px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full flex items-center gap-x-1">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {email.aiTag}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Colonne de droite - Contenu & Assistant */}
            <div className="flex-1 bg-slate-50/50 flex flex-col p-8 overflow-y-auto custom-scrollbar">
                {selectedId === "1" ? (
                    <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* En-tête du mail */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Pièces complémentaires - Dossier TGI/2026</h3>
                                    <div className="flex items-center gap-x-2">
                                        <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs font-bold">AS</div>
                                        <p className="text-sm text-slate-600 italic">De: <span className="font-bold text-slate-900">Amadou Sow</span> &lt;a.sow@email.com&gt;</p>
                                    </div>
                                </div>
                                <div className="flex gap-x-2">
                                    <button className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition"><Trash2 className="h-5 w-5 text-slate-600" /></button>
                                    <button className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition"><Clock className="h-5 w-5 text-slate-600" /></button>
                                </div>
                            </div>
                            <div className="text-slate-700 space-y-4 font-light leading-relaxed">
                                <p>Maître,</p>
                                <p>Veuillez trouver ci-joint les relevés bancaires demandés pour l'audience du fond de mardi. Je n'ai pas pu obtenir le relevé de décembre, la banque me dit qu'il y a un délai de 48h.</p>
                                <p>Cordialement,<br />Amadou Sow</p>
                            </div>
                        </div>

                        {/* Zone Magique LexAI */}
                        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex items-center gap-x-3 mb-6">
                                    <div className="p-2 bg-secondary rounded-xl">
                                        <Sparkles className="h-6 w-6 text-slate-900" />
                                    </div>
                                    <h4 className="text-xl font-bold">LexAI - Analyse & Réponse Automatique</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="flex items-center gap-x-2 text-emerald-400 mb-3">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Analyse Intelligente</span>
                                        </div>
                                        <p className="text-sm text-slate-300 font-light">
                                            Le client confirme l'approvisionnement des pièces. Cependant, le relevé de décembre manque.
                                        </p>
                                        <button className="mt-4 text-[10px] font-bold bg-white text-slate-900 px-3 py-2 rounded-lg hover:bg-secondary transition active:scale-95">
                                            AJOUTER AU DOSSIER TGI/2026
                                        </button>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="flex items-center gap-x-2 text-amber-400 mb-3">
                                            <ShieldAlert className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Action IA Suggérée</span>
                                        </div>
                                        <p className="text-sm text-slate-300 font-light">
                                            Rédiger un mail de confirmation au client et une note pour le tribunal sur le délai de 48h.
                                        </p>
                                        <div className="mt-4 flex gap-x-2">
                                            <button className="text-[10px] font-bold border border-white/20 px-3 py-2 rounded-lg hover:bg-white/10 transition">GÉNÉRER RÉPONSE</button>
                                            <button className="text-[10px] font-bold border border-white/20 px-3 py-2 rounded-lg hover:bg-white/10 transition">DÉCALER RAPPEL</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center h-full text-center space-y-4">
                        <Inbox className="h-16 w-16 text-slate-200" />
                        <h3 className="text-xl font-bold text-slate-400">Sélectionnez un mail pour voir l'analyse LexAI</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
