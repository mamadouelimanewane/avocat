
"use client"

import { useState, useEffect, useRef } from "react"
import {
    Mic,
    MicOff,
    Zap,
    AlertCircle,
    MessageSquare,
    CheckCircle2,
    Timer,
    Gavel,
    Triangle,
    ArrowRight,
    Search,
    ShieldAlert,
    Cpu,
    Wifi
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LexLiveProps {
    dossierId: string
    onClose?: () => void
}

export function LexLive({ dossierId, onClose }: LexLiveProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcripts, setTranscripts] = useState<Array<{ id: number, speaker: 'OPPONENT' | 'SYSTEM', text: string, type: 'ALERT' | 'INFO' | 'CONTRADICTION' }>>([
        { id: 1, speaker: 'OPPONENT', text: "La partie adverse prétend n'avoir jamais reçu la mise en demeure du 14 mars...", type: 'INFO' },
    ])
    const [rebuttals, setRebuttals] = useState<Array<{ id: number, text: string, source: string }>>([])
    const [persuasionScore, setPersuasionScore] = useState(65)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [transcripts])

    const toggleListening = () => {
        setIsListening(!isListening)
        if (!isListening) {
            // Simulate live detection
            setTimeout(() => {
                const newMsg = { id: Date.now(), speaker: 'OPPONENT' as const, text: "Nous affirmons que le contrat n'a été signé que le 20 mars, rendant la clause caduque.", type: 'CONTRADICTION' as const }
                setTranscripts(prev => [...prev, newMsg])

                setTimeout(() => {
                    setRebuttals([
                        { id: 1, text: "CONTRADICTION DÉTECTÉE : Le Document d'Expertise (DOC.12) prouve une signature électronique le 18 mars à 14h22.", source: "DOC.12 - Expertise Numérique" },
                        { id: 2, text: "Jurisprudence OHADA : La caducité ne peut être invoquée si l'exécution a commencé (Art. 110 CC).", source: "Jurisprudence 2023 - Cour Suprême" }
                    ])
                }, 1000)
            }, 3000)
        }
    }

    return (
        <div className="bg-[#020617] text-slate-100 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden border-l border-rose-500/20">
            {/* Header - Glass/Live Aesthetic */}
            <div className="p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2.5 rounded-xl shadow-lg transition-all duration-500 ring-2 ring-white/10",
                        isListening ? "bg-rose-600 animate-pulse shadow-rose-500/50" : "bg-slate-700 shadow-slate-500/20"
                    )}>
                        {isListening ? <Wifi className="h-6 w-6 text-white" /> : <MicOff className="h-6 w-6 text-slate-300" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-xl text-white tracking-tighter">LEX LIVE</h3>
                            {isListening && <Badge className="bg-rose-500 text-white animate-pulse text-[8px] font-black border-none px-1.5 h-4">LIVE</Badge>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assistant d'Audience en Temps Réel</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Score Persuasion</p>
                        <p className={cn("text-lg font-black", persuasionScore > 70 ? "text-emerald-400" : "text-amber-400")}>{persuasionScore}%</p>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/5 rounded-full h-10 w-10 text-slate-500 hover:text-white">
                            <XIcon className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#020617]">
                {/* Left Panel: Live Transcription */}
                <div className="flex-1 border-r border-white/5 flex flex-col relative">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Transcription Adverse
                        </span>
                        <div className="flex gap-2">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                            <div className="h-1.5 w-1.5 bg-slate-700 rounded-full" />
                            <div className="h-1.5 w-1.5 bg-slate-700 rounded-full" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6">
                            {transcripts.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "p-4 rounded-2xl relative group transition-all border",
                                        msg.type === 'CONTRADICTION'
                                            ? "bg-rose-500/10 border-rose-500/30 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                                            : "bg-white/5 border-white/5"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge className={cn(
                                            "text-[8px] font-black border-none",
                                            msg.speaker === 'OPPONENT' ? "bg-slate-700 text-slate-300" : "bg-indigo-600 text-white"
                                        )}>
                                            {msg.speaker}
                                        </Badge>
                                        <span className="text-[9px] text-slate-600 font-bold">14:02:45</span>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        msg.type === 'CONTRADICTION' ? "text-rose-100 font-bold" : "text-slate-300"
                                    )}>
                                        {msg.text}
                                    </p>
                                    {msg.type === 'CONTRADICTION' && (
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
                                    )}
                                </motion.div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Persuasion Meter Dashboard (Mobile) */}
                    <div className="md:hidden p-4 border-t border-white/5 bg-slate-900/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Impact Judiciaire</span>
                            <span className="text-xs font-black text-emerald-400">FAVORABLE</span>
                        </div>
                        <Progress value={persuasionScore} className="h-2 bg-white/5" indicatorClassName="bg-emerald-500" />
                    </div>
                </div>

                {/* Right Panel: Rebuttals & Evidence */}
                <div className="w-full md:w-[320px] bg-slate-950/50 flex flex-col">
                    <div className="p-4 bg-white/5 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-2">
                            <Zap className="h-3 w-3" /> Cartes de Rédaction
                        </span>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            <AnimatePresence>
                                {rebuttals.length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Cpu className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                                            En attente d'arguments <br /> adverse à contrer...
                                        </p>
                                    </div>
                                ) : (
                                    rebuttals.map((reb, idx) => (
                                        <motion.div
                                            key={reb.id}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Card className="bg-slate-900 border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden group shadow-xl">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-lg bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center shrink-0">
                                                            <Triangle className="h-3 w-3 text-indigo-400 fill-current" />
                                                        </div>
                                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">RÉPLIQUE FLASH</span>
                                                    </div>
                                                    <p className="text-xs text-white font-bold leading-relaxed">{reb.text}</p>
                                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                        <span className="text-[8px] font-black text-slate-500 uppercase">{reb.source}</span>
                                                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[8px] font-black text-white hover:bg-indigo-600 transition-colors">VOIR PIÈCE</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>

                    {/* Quick Timer for Pleading */}
                    <div className="p-4 bg-slate-900 border-t border-white/5">
                        <div className="flex items-center justify-between mb-3 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Timer className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Temps de Parole</span>
                            </div>
                            <span className="text-xs font-black text-white">04:22 / 15:00</span>
                        </div>
                        <Progress value={28} className="h-1.5 bg-white/5" />
                    </div>
                </div>
            </div>

            {/* Bottom Global Action Area */}
            <div className="p-6 bg-slate-950 border-t border-white/5 flex gap-4">
                <Button
                    onClick={toggleListening}
                    className={cn(
                        "flex-1 h-14 rounded-2xl font-black tracking-[0.2em] text-xs transition-all uppercase shadow-2xl",
                        isListening
                            ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40"
                            : "bg-white text-slate-950 hover:bg-slate-100"
                    )}
                >
                    {isListening ? (
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            ARRÊTER L'ÉCOUTE LIVE
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Mic className="h-5 w-5" /> ACTIVER LE SCAN D'AUDIENCE
                        </div>
                    )}
                </Button>
                <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5 text-white">
                    <ShieldAlert className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}

function XIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
