"use client"

import {
    Smartphone,
    MessageCircle,
    Lock,
    Link,
    CheckCircle2,
    Send,
    Share2,
    Globe,
    ShieldCheck,
    Eye,
    Bell,
    Users,
    Sparkles
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const portals = [
    {
        id: "p1",
        client: "Amadou Sow",
        dossier: "TGI/2026-Fonc",
        lastActivity: "Aujourd'hui, 09h15",
        status: "Actif",
        documents: 5,
        access: "Total"
    },
    {
        id: "p2",
        client: "Société SIS SA",
        dossier: "Bail-CCJA/2025",
        lastActivity: "Hier",
        status: "Actif",
        documents: 12,
        access: "Lecture seule"
    }
]

export default function ConnectPage() {
    const [isWhatsAppLinked, setIsWhatsAppLinked] = useState(true)

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-x-3">
                        <Smartphone className="h-8 w-8 text-sky-400" />
                        LexConnect - Portail & WhatsApp
                    </h2>
                    <p className="text-muted-foreground font-light text-lg mt-1">
                        Connectez vos clients à leur dossier via un espace sécurisé et WhatsApp.
                    </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-slate-900 shadow-sm">Dashboard Lawyer</button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700">Vue Client (Demo)</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* WhatsApp Bridge Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm text-emerald-900 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                <MessageCircle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Connecté</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Bridge WhatsApp</h3>
                        <p className="text-emerald-700 font-light text-sm leading-relaxed mb-8">
                            Votre numéro business est lié. Vos clients peuvent envoyer des photos de leurs pièces directement dans LexPremium.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-x-3 bg-white/50 p-4 rounded-2xl border border-emerald-200">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Auto-Répondeur IA</p>
                                    <p className="text-[10px] text-emerald-600">Activé (Questions basiques)</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition active:scale-95 shadow-lg shadow-emerald-500/20">
                                Tester le lien
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
                        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-x-2">
                            <Sparkles className="h-5 w-5 text-secondary" />
                            Conseil LexAI
                        </h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                            "Le Portail Client réduit de 40% les appels téléphoniques pour simples informations d'avancement. C'est votre meilleur allié productivité."
                        </p>
                    </div>
                </div>

                {/* Portails Clients Actifs */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Espaces Clients Sécurisés</h3>
                                <p className="text-xs text-slate-500 font-medium">Gérez qui voit quoi dans les dossiers.</p>
                            </div>
                            <button className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition shadow-xl">
                                Créer un nouvel accès
                            </button>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {portals.map((portal) => (
                                <div key={portal.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-start gap-x-6">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-sky-100 rounded-[1.2rem] flex items-center justify-center font-bold text-sky-700 text-lg">
                                                {portal.client[0]}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-lg shadow-sm">
                                                <Globe className="h-3 w-3 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{portal.client}</h4>
                                            <div className="flex items-center gap-x-3 mt-1 text-slate-500 text-sm">
                                                <span className="flex items-center gap-x-1">
                                                    <Lock className="h-3.5 w-3.5" />
                                                    {portal.dossier}
                                                </span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span>{portal.documents} docs partagés</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-x-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-bold text-slate-900">Dernier passage</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{portal.lastActivity}</p>
                                        </div>
                                        <div className="flex gap-x-2">
                                            <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100">
                                                <Eye className="h-4 w-4 text-slate-600" />
                                            </button>
                                            <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100">
                                                <Share2 className="h-4 w-4 text-slate-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Zone de partage rapide */}
                    <div className="bg-[#0f172a] text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Générez un lien magique</h3>
                                <p className="text-slate-400 font-light leading-relaxed mb-8">
                                    Besoin d'envoyer un document en urgence sans passer par un mail lourd ? Générez un lien sécurisé valable 24h.
                                </p>
                                <div className="flex gap-x-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                                    <div className="flex-1 px-4 py-3 text-sm text-slate-400 italic">
                                        lexconnect.app/share/x92...
                                    </div>
                                    <button className="bg-secondary text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm">
                                        Copier
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2rem] text-center">
                                <ShieldCheck className="h-12 w-12 text-secondary mb-4" />
                                <h4 className="font-bold mb-2 text-lg text-white">Chiffrement AES-256</h4>
                                <p className="text-xs text-slate-500 font-light">Toutes les données transitant par LexConnect sont chiffrées selon les normes de sécurité bancaire.</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
