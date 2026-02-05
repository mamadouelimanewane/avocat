"use client"

import { useState, useEffect, useRef } from "react"
import {
    Mic,
    MicOff,
    Waveform,
    Play,
    Pause,
    Square,
    Save,
    FileText,
    Sparkles,
    CheckCircle2,
    Settings,
    MoreHorizontal,
    Wand2,
    Send,
    Briefcase,
    Bot,
    Gavel,
    ChevronRight,
    Volume2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const SUGGESTED_TEMPLATES = [
    { title: "Conclusions en Réplique", icon: Gavel, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Mise en Demeure", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Mémoire en Défense", icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
]

export default function LexAudioDrafterPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [transcription, setTranscription] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleToggleRecording = () => {
        setIsRecording(!isRecording)
        if (!isRecording) {
            // Start simulation
            setTranscription("")
        } else {
            // Stop and process
            processAudio()
        }
    }

    const processAudio = () => {
        setIsProcessing(true)
        setProgress(0)
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsProcessing(false)
                    setTranscription("Maître, voici la synthèse de votre dictée : 'Dans l'affaire SGBTP vs Etat du Sénégal, les conclusions en réplique doivent souligner la violation de l'article 42 du Code des Marchés Publics. Les pièces jointes n°4 et 5 prouvent l'absence de notification préalable...'")
                    return 100
                }
                return prev + 5
            })
        }, 100)
    }

    return (
        <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-slate-100">

            {/* Header: Studio vibe */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-rose-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-rose-900/20 ring-4 ring-rose-600/20">
                        <Mic className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Lex<span className="text-rose-500">Audio</span> Drafter</h1>
                        <p className="text-slate-500 font-medium italic">Dictée vocale intelligente & Génération d&apos;actes multimodale.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6">
                        <Settings className="h-4 w-4 mr-2" /> Paramètres Audio
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Recording Control & Waveform (8 columns) */}
                <div className="xl:col-span-8 space-y-8">
                    <Card className="bg-slate-900/50 border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">
                        {/* Waveform Visualization Mockup */}
                        <div className="flex items-center gap-1 h-32 mb-12">
                            {[...Array(40)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-1.5 rounded-full transition-all duration-300",
                                        isRecording ? "bg-rose-500" : "bg-slate-700"
                                    )}
                                    style={{
                                        height: isRecording ? `${Math.random() * 100}%` : '5%',
                                        opacity: isRecording ? 0.5 + Math.random() * 0.5 : 0.3
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative group">
                            {isRecording && (
                                <div className="absolute inset-0 bg-rose-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
                            )}
                            <button
                                onClick={handleToggleRecording}
                                className={cn(
                                    "relative h-28 w-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden",
                                    isRecording ? "bg-rose-600 scale-110" : "bg-white hover:bg-slate-100"
                                )}
                            >
                                {isRecording ? (
                                    <Square className="h-10 w-10 text-white fill-white" />
                                ) : (
                                    <Mic className="h-10 w-10 text-slate-900" />
                                )}
                            </button>
                        </div>

                        <div className="mt-8 text-center space-y-2">
                            <p className={cn(
                                "text-lg font-black uppercase tracking-[0.2em]",
                                isRecording ? "text-rose-500 animate-pulse" : "text-slate-500"
                            )}>
                                {isRecording ? "Enregistrement en cours..." : "Prêt pour la dictée"}
                            </p>
                            <p className="text-slate-600 text-sm font-medium italic">
                                Parlez naturellement. L&apos;IA structure vos idées.
                            </p>
                        </div>

                        {/* Background glowing orbs */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-rose-600/5 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
                    </Card>

                    {/* Output / Transcription Card */}
                    <Card className="bg-white rounded-[2.5rem] border-none shadow-2xl p-8 text-slate-900">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-rose-500" />
                                Sortie Intelligente Nexus
                            </h3>
                            <div className="flex gap-2">
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black px-3 py-1 text-[10px]">MODE: PROCÉDURE CIVILE</Badge>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-3 py-1 text-[10px]">OHADA CERTIFIED</Badge>
                            </div>
                        </div>

                        {isProcessing ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                <div className="h-12 w-12 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin" />
                                <div className="text-center">
                                    <p className="font-black text-slate-900">Analyse Sémantique & Rédactionnelle...</p>
                                    <Progress value={progress} className="w-64 h-1.5 mt-4 bg-slate-100" />
                                </div>
                            </div>
                        ) : transcription ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-700 leading-relaxed font-medium">
                                    "{transcription}"
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button className="h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black flex gap-2">
                                        <FileText className="h-5 w-5 text-rose-500" /> GÉNÉRER LE PROJET WORD
                                    </Button>
                                    <Button variant="outline" className="h-14 border-slate-200 hover:bg-slate-50 rounded-2xl font-black flex gap-2">
                                        <Save className="h-5 w-5 text-blue-500" /> ARCHIVER LA NOTE VOCALE
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center opacity-30">
                                <Bot className="h-16 w-16 mx-auto mb-4" />
                                <p className="font-medium">Appuyez sur le micro pour commencer à dicter votre stratégie...</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar: Context / Templates (4 columns) */}
                <div className="xl:col-span-4 space-y-8">
                    <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 px-2">Modèles de Rédaction Rapide</h3>
                        <div className="space-y-3">
                            {SUGGESTED_TEMPLATES.map((tmpl, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-lg", tmpl.bg)}>
                                            <tmpl.icon className={cn("h-6 w-6", tmpl.color)} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">{tmpl.title}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <Badge className="bg-white/20 text-white border-none font-black text-[9px] px-2 py-0.5">INSIGHT IA</Badge>
                            <h4 className="text-xl font-black leading-tight">Transcription Multi-Dossiers</h4>
                            <p className="text-indigo-200 text-xs font-medium leading-relaxed">
                                Vous parlez de plusieurs affaires ? Notre IA détecte automatiquement les noms de dossiers cités et ventile vos notes dans les bonnes fiches GED.
                            </p>
                            <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-black h-11 text-xs uppercase tracking-widest mt-4">
                                Activer le mode Auto-Ventilation
                            </Button>
                        </div>
                        <Wand2 className="absolute bottom-[-20px] right-[-20px] h-32 w-32 text-white/5 rotate-12" />
                    </Card>

                    <div className="p-8 border border-white/10 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-3">
                            <Volume2 className="h-5 w-5 text-rose-500" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Dernières Dictées</h4>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Play className="h-4 w-4 text-slate-600 group-hover:text-rose-500" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-200">Affaire Banque Atlantique...</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Aujourd&apos;hui, 10:15 • 2m 45s</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
