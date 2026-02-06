"use client"

import {
    Users,
    Scale,
    Heart,
    ShieldCheck,
    TrendingUp,
    MessageSquare,
    Search,
    ChevronRight,
    Star,
    AlertCircle,
    Info,
    Sparkles
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const contacts = {
    clients: [
        { id: "c1", name: "Amadou Sow", health: "Satisfait", score: 95, lastContact: "Aujourd'hui", sentiment: "Positif", insight: "Réactif aux relances WhatsApp." },
        { id: "c2", name: "Fatoumata Diop", health: "À relancer", score: 65, lastContact: "Il y a 5 jours", sentiment: "Neutre", insight: "Attend le compte-rendu d'audience." },
    ],
    magistrats: [
        { id: "m1", name: "M. le Juge Ndiaye", title: "Président TGI Dakar", style: "Synthétique", focus: "Preuves factuelles", insight: "Préfère les plaidoiries courtes (max 15 mins)." },
        { id: "m2", name: "Mme la Présidente Fall", title: "2ème Chambre Civile", style: "Pointilleux", focus: "Procédures", insight: "Très vigilante sur les délais de signification." },
    ]
}

export default function RelationsPage() {
    const [tab, setTab] = useState<'clients' | 'magistrats'>('clients')

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Relations & Réseau</h2>
                    <p className="text-muted-foreground font-light text-lg mt-1">
                        Gérez vos partenaires de justice et la satisfaction de vos clients.
                    </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                    <button
                        onClick={() => setTab('clients')}
                        className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all", tab === 'clients' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        Clients & Fidélité
                    </button>
                    <button
                        onClick={() => setTab('magistrats')}
                        className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all", tab === 'magistrats' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        Magistrats & Confrères
                    </button>
                </div>
            </div>

            {tab === 'clients' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                            <h4 className="text-emerald-800 text-xs font-bold uppercase tracking-widest mb-2">Taux de Satisfaction</h4>
                            <div className="flex items-end gap-x-2">
                                <span className="text-4xl font-black text-emerald-900">92%</span>
                                <TrendingUp className="h-6 w-6 text-emerald-500 mb-1" />
                            </div>
                        </div>
                        <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100">
                            <h4 className="text-sky-800 text-xs font-bold uppercase tracking-widest mb-2">Santé du Portefeuille</h4>
                            <div className="flex items-end gap-x-2">
                                <span className="text-4xl font-black text-sky-900">Stable</span>
                                <ShieldCheck className="h-6 w-6 text-sky-500 mb-1" />
                            </div>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                            <h4 className="text-amber-800 text-xs font-bold uppercase tracking-widest mb-2">Urgences Relationnelles</h4>
                            <div className="flex items-end gap-x-2">
                                <span className="text-4xl font-black text-amber-900">03</span>
                                <AlertCircle className="h-6 w-6 text-amber-500 mb-1" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Annuaire de Fidélité</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input placeholder="Filtrer les clients..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-slate-100" />
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {contacts.clients.map((client) => (
                                <div key={client.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-x-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-[1.2rem] flex items-center justify-center font-bold text-slate-600">
                                            {client.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{client.name}</h4>
                                            <div className="flex items-center gap-x-2">
                                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                                    client.health === 'Satisfait' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                )}>
                                                    {client.health}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">Score: {client.score}/100</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block max-w-xs">
                                        <div className="flex items-center gap-x-2 text-indigo-600 mb-1">
                                            <Sparkles className="h-3 w-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Aide IA</span>
                                        </div>
                                        <p className="text-xs text-slate-500 italic">"{client.insight}"</p>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-900">{client.lastContact}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Dernier échange</p>
                                        </div>
                                        <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-x-3 mb-6">
                                <div className="p-2 bg-secondary rounded-xl">
                                    <Scale className="h-6 w-6 text-slate-900" />
                                </div>
                                <h3 className="text-xl font-bold text-white">L'IA connaît vos interlocuteurs</h3>
                            </div>
                            <p className="text-slate-400 font-light max-w-2xl leading-relaxed">
                                LexAI analyse l'historique de vos audiences pour vous donner le "profil comportemental" des magistrats. Préparez vos plaidoiries selon leurs préférences.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {contacts.magistrats.map((mag) => (
                            <div key={mag.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-x-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <Scale className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{mag.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{mag.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-x-3">
                                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Style de Jugement</p>
                                            <p className="text-sm font-bold text-slate-900">{mag.style}</p>
                                        </div>
                                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Focus Principal</p>
                                            <p className="text-sm font-bold text-slate-900">{mag.focus}</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-x-2 text-emerald-700 mb-1">
                                            <Info className="h-3 w-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Conseil LexAI</span>
                                        </div>
                                        <p className="text-xs text-emerald-900 font-medium italic">"{mag.insight}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
