
"use client"

import { useState, useEffect } from "react"
import {
    Fingerprint,
    Cpu,
    Zap,
    UserPlus,
    Brain,
    History,
    Settings2,
    Sparkles,
    ShieldCheck,
    Bot,
    PenTool,
    MessageSquare,
    Globe,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LexTwinProps {
    dossierId: string
    onClose?: () => void
}

type TwinMode = "litigator" | "conciliator" | "scholar"

export function LexTwin({ dossierId, onClose }: LexTwinProps) {
    const [activeMode, setActiveMode] = useState<TwinMode>("litigator")
    const [trainingProgress, setTrainingProgress] = useState(82)
    const [isSyncing, setIsSyncing] = useState(false)

    const modes = [
        { id: "litigator", name: "Le Glaive", desc: "Style agressif, factuel, percutant. Idéal pour les conclusions en demande.", icon: Zap, color: "text-rose-500", bg: "bg-rose-500/10" },
        { id: "conciliator", name: "La Balance", desc: "Style diplomatique, tourné vers la solution et l'apaisement.", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { id: "scholar", name: "Le Grimoire", desc: "Style savant, riche en doctrine et références académiques.", icon: Brain, color: "text-amber-500", bg: "bg-amber-500/10" },
    ]

    useEffect(() => {
        if (isSyncing) {
            const timer = setTimeout(() => setIsSyncing(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [isSyncing])

    return (
        <div className="bg-[#f8fafc] text-slate-800 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden border-l border-cyan-500/20">
            {/* Header - Futuristic Identity Style */}
            <div className="p-8 border-b border-slate-200 bg-white sticky top-0 z-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full translate-x-32 -translate-y-32 blur-3xl" />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                <Fingerprint className="h-10 w-10 text-cyan-400 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                <div className="h-3 w-3 bg-cyan-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tighter flex items-center gap-2">
                                LEX<span className="text-cyan-600">TWIN</span> <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">BETA V2.0</span>
                            </h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-3 w-3 text-cyan-500" /> Digital Identity Proxy
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-10 w-10 text-slate-400">
                            <XIcon className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-10">

                    {/* Training Status Section */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Apprentissage du Style</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Basé sur vos 45 derniers dossiers et conclusions.</p>
                            </div>
                            <span className="text-2xl font-black text-cyan-600">{trainingProgress}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${trainingProgress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <StatCard label="Vocabulaire" value="Étendu" />
                            <StatCard label="Ton" value="Formel" />
                            <StatCard label="Juris-Ref" value="Auto-Sync" />
                        </div>
                    </section>

                    {/* Persona Selector */}
                    <section className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sélection du Persona Actif</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {modes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setActiveMode(mode.id as TwinMode)}
                                    className={cn(
                                        "p-5 rounded-[2rem] border-2 text-left transition-all relative group overflow-hidden",
                                        activeMode === mode.id
                                            ? "bg-white border-cyan-500 shadow-xl ring-1 ring-cyan-500 ring-offset-2 scale-[1.02]"
                                            : "bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white"
                                    )}
                                >
                                    <div className="flex gap-4 relative z-10">
                                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", mode.bg)}>
                                            <mode.icon className={cn("h-7 w-7", mode.color)} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-black text-slate-900 uppercase text-sm tracking-tight">{mode.name}</h5>
                                                {activeMode === mode.id && <Badge className="bg-cyan-500 h-4 text-[8px] font-black border-none animate-pulse">ACTIF</Badge>}
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed pr-4 font-medium">{mode.desc}</p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-6 -right-6 h-24 w-24 rounded-full transition-all group-hover:scale-110 opacity-10",
                                        mode.color.replace('text', 'bg')
                                    )} />
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Quick Actions for the Twin */}
                    <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
                            <Zap className="h-64 w-64 text-white" />
                        </div>

                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-cyan-400" /> Actions Autonomes
                        </h4>

                        <div className="space-y-3 relative z-10">
                            <ActionButton
                                icon={<PenTool className="h-4 w-4" />}
                                label="Rédaction en mon nom"
                                sub="Génère un projet de conclusions style 'Glaive'"
                            />
                            <ActionButton
                                icon={<MessageSquare className="h-4 w-4" />}
                                label="Réponse Mail Intelligente"
                                sub="Prépare une réponse au confrère adverse"
                            />
                            <ActionButton
                                icon={<ShieldCheck className="h-4 w-4" />}
                                label="Validation Éthique Twin"
                                sub="Vérifie la conformité déontologique"
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Bottom Sync Bar */}
            <div className="p-6 bg-white border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Twin Synchronisé</span>
                </div>
                <Button
                    onClick={() => setIsSyncing(true)}
                    disabled={isSyncing}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-black px-6 rounded-2xl h-12 shadow-lg shadow-cyan-200"
                >
                    {isSyncing ? "SYNCHRONISATION..." : "RE-SYNCHRONISER L'IDENTITÉ"}
                </Button>
            </div>
        </div>
    )
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-black text-slate-800">{value}</p>
        </div>
    )
}

function ActionButton({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) {
    return (
        <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-4 text-left group">
            <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-white uppercase tracking-tight">{label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
            </div>
        </button>
    )
}

function XIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
