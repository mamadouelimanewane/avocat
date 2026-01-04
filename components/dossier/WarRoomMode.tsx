"use client"

import { useState, useEffect } from "react"
import {
    Gavel,
    Clock,
    FileText,
    Zap,
    Fullscreen,
    X,
    Play,
    Pause,
    RotateCcw,
    PenTool,
    Save,
    ChevronRight,
    Search,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface WarRoomProps {
    dossier: any
    onClose: () => void
}

export function WarRoomMode({ dossier, onClose }: WarRoomProps) {
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [notes, setNotes] = useState("")

    // Stopwatch logic
    useEffect(() => {
        let interval: any = null
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1)
            }, 1000)
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isActive, seconds])

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B] text-slate-100 flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Top Bar: Strategic Info */}
            <div className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-500 rounded text-black font-bold">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">{dossier.reference} - {dossier.title}</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{dossier.jurisdiction}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Stopwatch */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
                        <Clock className={cn("h-4 w-4", isActive ? "text-amber-500 animate-pulse" : "text-slate-500")} />
                        <span className="font-mono text-xl font-bold tabular-nums w-16">{formatTime(seconds)}</span>
                        <div className="flex gap-1 pl-2 border-l border-slate-800 ml-1">
                            <button onClick={() => setIsActive(!isActive)} className="hover:text-amber-500">
                                {isActive ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                            </button>
                            <button onClick={() => { setSeconds(0); setIsActive(false); }} className="hover:text-red-500">
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Main War Room Body */}
            <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">

                {/* Left Panel: Evidence & Documents (Quick Access) */}
                <div className="lg:w-1/3 border-r border-slate-800 flex flex-col shrink-0">
                    <div className="p-4 bg-slate-900/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Pièces Clés
                        </h3>
                        <Badge variant="outline" className="border-amber-500/50 text-amber-500">Drapeau d'Urgence</Badge>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {dossier.documents?.slice(0, 6).map((doc: any, i: number) => (
                                <button key={doc.id} className="w-full text-left p-4 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded text-slate-400 group-hover:text-amber-500">
                                            <span className="font-bold text-xs">P. {i + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm leading-tight text-white">{doc.title}</p>
                                            <p className="text-[10px] text-slate-500 uppercase mt-1">{doc.type} • 12/01/2026</p>
                                        </div>
                                    </div>
                                    <Zap className="h-4 w-4 text-slate-700 group-hover:text-amber-500" />
                                </button>
                            ))}

                            {/* Empty state or quick links */}
                            <div className="p-4 border border-dashed border-slate-800 rounded-lg text-slate-600 text-center text-sm">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                Rechercher une pièce spécifique...
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="p-4 bg-indigo-600/10 border-t border-indigo-500/20">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Shield className="h-4 w-4" /> Argumentaire de Riposte LexAI
                        </Button>
                    </div>
                </div>

                {/* Center Panel: Content Viewer / Reading Mode */}
                <div className="flex-1 flex flex-col bg-black">
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="max-w-3xl w-full h-full bg-slate-50 text-slate-900 rounded shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-3 bg-slate-800 text-slate-100 text-xs font-bold flex justify-between items-center">
                                <span>LECTURE : CONCLUSIONS_FINALES_V3.PDF</span>
                                <div className="flex gap-2">
                                    <Fullscreen className="h-3 w-3" />
                                </div>
                            </div>
                            <ScrollArea className="flex-1 p-12 font-serif leading-relaxed text-lg">
                                <div className="space-y-6">
                                    <p className="font-bold uppercase underline text-center text-xl">PLAIDOIRIE SUR LE FOND</p>
                                    <p>Monsieur LE PRESIDENT, Messieurs LES CONSEILLERS,</p>
                                    <p>Il est de jurisprudence constante que le trouble manifestement illicite ne peut être couvert par une simple allégation de droit de propriété, dès lors que celle-ci se heurte à un Titre Foncier inattaquable.</p>
                                    <p className="font-bold">I - SUR LA FORCE PROBANTE DU TITRE FONCIER N°14.782/R</p>
                                    <p>Le décret foncier du 26 juillet 1932 est clair : l'inscription au livre foncier épuise tout débat sur la propriété préexistante. La SCI Horizon Dakar détient un droit réel, définitif et inattaquable.</p>
                                    <p>...</p>
                                    {/* Placeholder for more text */}
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <p key={i} className="text-slate-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Express Notes & Directives */}
                <div className="lg:w-1/4 border-l border-slate-800 flex flex-col shrink-0 bg-slate-950">
                    <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-slate-200">Notes d'Audience</h3>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-xs text-slate-400 uppercase">Points de l'Adversaire</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <Textarea
                                    className="bg-slate-950 border-slate-800 text-white min-h-[150px] focus:ring-amber-500"
                                    placeholder="Notez ici les arguments de la partie adverse en temps réel..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Réflexes de riposte</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="cursor-pointer bg-slate-800 hover:bg-amber-600 transition-colors">Exception de nullité</Badge>
                                <Badge className="cursor-pointer bg-slate-800 hover:bg-amber-600 transition-colors">Contradiction factuelle</Badge>
                                <Badge className="cursor-pointer bg-slate-800 hover:bg-amber-600 transition-colors">Prescription</Badge>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-800">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                                <Save className="h-4 w-4" /> Enregistrer au Dossier
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Quick Bar */}
            <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 shrink-0 text-xs">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Session Live synchronisée
                    </span>
                </div>
                <div className="text-slate-500 flex items-center gap-2">
                    <Gavel className="h-3 w-3" /> LexPremium Auditor Mode
                </div>
            </div>
        </div>
    )
}
