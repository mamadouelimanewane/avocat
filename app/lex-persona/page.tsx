"use client"

import { useState } from "react"
import {
    UserSearch,
    Brain,
    Target,
    Zap,
    Scale,
    Gavel,
    TrendingUp,
    MessageCircle,
    ShieldAlert,
    ChevronRight,
    Search,
    Users,
    Activity,
    History,
    Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const PERSONA_PROFILES = [
    {
        id: 1,
        name: "Juge M. Diama",
        role: "Magistrat - TGI Dakar",
        tendency: "FORMALISTE STRICT",
        successRate: 42,
        psychology: "Sensible aux vices de forme initiaux. Préfère les conclusions concises (< 10 pages).",
        tags: ["Rigoureux", "Procédurier", "Expert OHADA"]
    },
    {
        id: 2,
        name: "Me A. Sylla",
        role: "Adversaire - Cabinet Sylla & Co",
        tendency: "OFFENSIF / DILATOIRE",
        successRate: 68,
        psychology: "Utilise systématiquement les incidents de procédure pour gagner du temps. Transige souvent à la 3ème audience.",
        tags: ["Négociateur", "Agressif", "Procédural"]
    }
]

export default function LexPersonaPage() {
    const [selectedPersona, setSelectedPersona] = useState(PERSONA_PROFILES[0])

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">

            {/* Header: Cyber-Psychology Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-fuchsia-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-fuchsia-900/40 ring-4 ring-fuchsia-600/20">
                        <Brain className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Lex<span className="text-fuchsia-500">Persona</span></h1>
                        <p className="text-slate-500 font-medium italic">Profilage Psychologique & Justice Comportementale IA.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button className="h-12 bg-fuchsia-600 text-white hover:bg-fuchsia-700 font-black rounded-2xl shadow-xl shadow-fuchsia-900/20 px-8">
                        <UserSearch className="h-5 w-5 mr-3" /> PROFILER UN ACTEUR
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Left: Actors List (4 columns) */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                            placeholder="Chercher un juge, avocat, expert..."
                        />
                    </div>

                    <div className="space-y-4">
                        {PERSONA_PROFILES.map((p) => (
                            <Card
                                key={p.id}
                                onClick={() => setSelectedPersona(p)}
                                className={cn(
                                    "bg-white/5 border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-all cursor-pointer group",
                                    selectedPersona?.id === p.id ? "ring-2 ring-fuchsia-500 bg-white/[0.08]" : ""
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-fuchsia-500 transition-colors">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-lg text-white group-hover:text-fuchsia-400 transition-colors">{p.name}</h3>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.role}</p>
                                    </div>
                                    <Badge className="bg-fuchsia-500/10 text-fuchsia-500 border-none">
                                        {p.tendency.split(' ')[0]}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-indigo-600/10 border-indigo-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            <h4 className="text-sm font-black uppercase text-indigo-300">Statistiques Globales</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-400">Précision IA</span>
                                <span className="text-white">94%</span>
                            </div>
                            <Progress value={94} className="h-1.5 bg-white/5" />
                        </div>
                        <p className="text-[10px] text-indigo-200/60 font-medium leading-relaxed italic mt-4">
                            Basé sur l&apos;analyse de 42.500 arrêts et 12.000 plaidoiries transcrites.
                        </p>
                    </Card>
                </div>

                {/* Right: Analytical Dashboard (8 columns) */}
                <div className="xl:col-span-8 space-y-8">
                    {selectedPersona && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Profile Hero */}
                            <Card className="bg-white/5 border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5">
                                    <Brain className="h-32 w-32" />
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Badge className="bg-fuchsia-500 text-white font-black px-4 py-1.5 rounded-lg mb-4 shadow-lg shadow-fuchsia-900/40">
                                                TENDANCE : {selectedPersona.tendency}
                                            </Badge>
                                            <h2 className="text-4xl font-black text-white">{selectedPersona.name}</h2>
                                            <p className="text-slate-400 font-bold">{selectedPersona.role}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPersona.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Taux de Transigeance</p>
                                        <div className="text-5xl font-black text-fuchsia-500 mb-2">{selectedPersona.successRate}%</div>
                                        <p className="text-xs text-slate-400 font-medium italic">Probabilité d&apos;accord amiable</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Insights Card */}
                                <Card className="bg-white text-slate-950 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                                    <h3 className="text-lg font-black flex items-center gap-3">
                                        <Zap className="h-6 w-6 text-fuchsia-600" />
                                        Points de Levier IA
                                    </h3>
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-700 leading-relaxed text-sm">
                                        "{selectedPersona.psychology}"
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                <Target className="h-4 w-4" />
                                            </div>
                                            <p className="text-xs font-bold">À privilégier : Arguments textuels OHADA</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                                                <ShieldAlert className="h-4 w-4" />
                                            </div>
                                            <p className="text-xs font-bold">À éviter : Plaidoiries trop émotionnelles</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Activity Chart Mockup */}
                                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 space-y-8">
                                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex justify-between">
                                        Réactivité en Audience
                                        <Activity className="h-4 w-4 text-fuchsia-500" />
                                    </h3>
                                    <div className="flex items-end gap-3 h-32 px-4">
                                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/10 rounded-t-lg relative group transition-all hover:bg-fuchsia-500/50" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
                                        <span>Début</span>
                                        <span>Pic</span>
                                        <span>Fin</span>
                                    </div>
                                </Card>
                            </div>

                            {/* Recent Decisions Table */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    <History className="h-6 w-6 text-slate-500" />
                                    Prises de Position Récentes
                                </h3>
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.08] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                                    <Scale className="h-5 w-5 text-fuchsia-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Affaire #009 - Nullité d&apos;Assignation</p>
                                                    <p className="text-[10px] font-black text-slate-600 uppercase">DÉCISION : IRRECEVABILITÉ (FORMALISME)</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white"><ChevronRight className="h-5 w-5" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
