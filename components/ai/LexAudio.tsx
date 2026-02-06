
"use client"

import { useState, useRef, useEffect } from "react"
import {
    Mic,
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Type,
    Languages,
    UploadCloud,
    FileAudio,
    Download,
    Search,
    TextCursorInput,
    Highlighter,
    MessageSquarePlus,
    CheckCircle2,
    Clock,
    User,
    Scissors,
    Save,
    Share2,
    Headphones,
    Volume2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexAudioProps {
    dossierId: string
    onClose?: () => void
}

export function LexAudio({ dossierId, onClose }: LexAudioProps) {
    const [activeTab, setActiveTab] = useState("transcribe")
    const [isProcessing, setIsProcessing] = useState(false)
    const [processProgress, setProcessProgress] = useState(0)
    const [audioFile, setAudioFile] = useState<string | null>(null)
    const [transcriptionComplete, setTranscriptionComplete] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const audioDuration = 145 // Mock duration in seconds

    // Mock Transcript Data
    const transcriptSegments = [
        { id: 1, time: "00:05", speaker: "Juge Président", text: "L'audience est ouverte. Veuillez décliner votre identité.", type: "JUDGE" },
        { id: 2, time: "00:12", speaker: "Témoin (M. DIOP)", text: "Je m'appelle Amadou Diop, né le 15 mai 1980 à Saint-Louis.", type: "WITNESS" },
        { id: 3, time: "00:18", speaker: "Me. Avocat", text: "Merci M. Diop. Pouvez-vous nous confirmer votre présence sur les lieux le jour de l'incident ?", type: "LAWYER" },
        { id: 4, time: "00:24", speaker: "Témoin (M. DIOP)", text: "Oui, j'y étais. C'était vers 14 heures, juste après la prière.", type: "WITNESS" },
        { id: 5, time: "00:30", speaker: "Juge Président", text: "Notez ce point au greffe. Continuez Maître.", type: "JUDGE" },
    ]

    const handleUpload = () => {
        setIsProcessing(true)
        setProcessProgress(0)

        const interval = setInterval(() => {
            setProcessProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsProcessing(false)
                    setAudioFile("audience_enregistrement.mp3")
                    setTranscriptionComplete(true)
                    setActiveTab("editor")
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    const togglePlay = () => setIsPlaying(!isPlaying)

    return (
        <div className="bg-white border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans">
            {/* Header - Sonix Style Clean & Professional */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-rose-500 p-2 rounded-lg shadow-md shadow-rose-200">
                        <Headphones className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-rose-500">Audio</span> Studio
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Transcription & Analyse Vocale</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="transcribe" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="px-4 pt-4 bg-slate-50/50">
                    <TabsList className="grid grid-cols-2 w-full bg-slate-200/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="transcribe" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm">
                            <UploadCloud className="h-3 w-3 mr-2" /> IMPORT & TRANSCRIPTION
                        </TabsTrigger>
                        <TabsTrigger value="editor" disabled={!transcriptionComplete} className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm">
                            <TextCursorInput className="h-3 w-3 mr-2" /> ÉDITEUR WYSIWYG
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 min-h-full space-y-6">
                        <AnimatePresence mode="wait">
                            <TabsContent value="transcribe" className="mt-0 outline-none space-y-6">
                                <div className="space-y-6 animate-in fade-in duration-500 py-4">
                                    {!isProcessing ? (
                                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-rose-50/10 hover:border-rose-200 transition-all cursor-pointer bg-slate-50/30">
                                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-500">
                                                <FileAudio className="h-10 w-10" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 mb-2">Déposez votre fichier audio/vidéo</h4>
                                            <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
                                                Audience, dictée ou entretien client. Formats supportés : MP3, WAV, MP4, M4A.
                                            </p>
                                            <div className="flex gap-4 w-full max-w-xs">
                                                <Button onClick={handleUpload} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-12 shadow-lg shadow-rose-100">
                                                    <UploadCloud className="h-4 w-4 mr-2" /> IMPORTER
                                                </Button>
                                                <Button variant="outline" className="flex-1 border-slate-200 bg-white font-bold rounded-xl h-12">
                                                    <Mic className="h-4 w-4 mr-2" /> ENREGISTRER
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full border-4 border-slate-100" />
                                                <motion.div
                                                    className="absolute inset-0 w-24 h-24 rounded-full border-4 border-rose-500 border-t-transparent"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-black text-slate-900">{processProgress}%</span>
                                                </div>
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-lg font-black text-slate-900 uppercase tracking-tight italic">LexAudio écoute...</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Identification des locuteurs en cours...</p>
                                            </div>
                                            <Progress value={processProgress} className="w-64 h-1 bg-slate-100 overflow-hidden" indicatorClassName="bg-rose-500" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <FeatureCard icon={<Languages className="h-4 w-4 text-indigo-500" />} title="Traduction" desc="40+ Langues" />
                                        <FeatureCard icon={<User className="h-4 w-4 text-emerald-500" />} title="Diarization" desc="Auto-Speaker ID" />
                                        <FeatureCard icon={<Search className="h-4 w-4 text-amber-500" />} title="Deep Search" desc="Recherche Audio" />
                                        <FeatureCard icon={<Type className="h-4 w-4 text-slate-500" />} title="Sous-Titres" desc="Export SRT/VTT" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="editor" className="mt-0 outline-none h-full flex flex-col">
                                {/* Audio Player Bar */}
                                <div className="bg-slate-900 text-white p-4 rounded-xl mb-4 shadow-lg sticky top-0 z-10">
                                    <div className="flex items-center gap-4 mb-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                                            onClick={togglePlay}
                                        >
                                            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current pl-0.5" />}
                                        </Button>
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-xs font-mono text-slate-400">00:14</span>
                                            <Slider defaultValue={[10]} max={100} step={1} className="flex-1" />
                                            <span className="text-xs font-mono text-slate-400">02:25</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><RotateCcw className="h-4 w-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><RotateCw className="h-4 w-4" /></Button>
                                            <Select defaultValue="1.0">
                                                <SelectTrigger className="w-16 h-8 bg-white/10 border-none text-xs font-bold text-white">
                                                    <SelectValue placeholder="1.0x" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0.5">0.5x</SelectItem>
                                                    <SelectItem value="1.0">1.0x</SelectItem>
                                                    <SelectItem value="1.5">1.5x</SelectItem>
                                                    <SelectItem value="2.0">2.0x</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="h-8 w-full bg-slate-800 rounded overflow-hidden flex items-end gap-[1px] opacity-50">
                                        {/* Mock Waveform */}
                                        {Array.from({ length: 60 }).map((_, i) => (
                                            <div key={i} className="flex-1 bg-rose-500" style={{ height: `${Math.random() * 100}%` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Transcript Content */}
                                <div className="flex-1 space-y-6 pb-20">
                                    <div className="flex items-center justify-between mb-2 px-2">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1"><Highlighter className="h-3 w-3" /> SURLIGNER</Button>
                                            <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1"><Scissors className="h-3 w-3" /> EXTRAIT</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="h-7 text-xs font-bold gap-1 text-slate-400"><Search className="h-3 w-3" /> CHERCHER</Button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
                                        {transcriptSegments.map((segment) => (
                                            <div key={segment.id} className="group relative pl-4 border-l-2 border-transparent hover:border-rose-300 transition-colors">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Badge variant={segment.type === 'JUDGE' ? 'default' : segment.type === 'LAWYER' ? 'secondary' : 'outline'} className="text-[9px] font-black uppercase tracking-wider">
                                                        {segment.time} • {segment.speaker}
                                                    </Badge>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Button size="icon" variant="ghost" className="h-5 w-5 rounded-full"><Play className="h-3 w-3 text-rose-500 fill-current" /></Button>
                                                        <Button size="icon" variant="ghost" className="h-5 w-5 rounded-full"><MessageSquarePlus className="h-3 w-3 text-slate-400" /></Button>
                                                    </div>
                                                </div>
                                                <p className="text-slate-800 leading-relaxed hover:bg-rose-50/30 rounded px-1 -ml-1 cursor-text transition-colors">
                                                    {segment.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                {activeTab === 'editor' && (
                    <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            Sauvegardé
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="font-bold gap-2">
                                <Share2 className="h-3.5 w-3.5" /> PARTAGER
                            </Button>
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-black font-bold gap-2 shadow-lg">
                                <Download className="h-3.5 w-3.5" /> EXPORTER WORD
                            </Button>
                        </div>
                    </div>
                )}
            </Tabs>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all hover:border-rose-100 cursor-default group">
            <div className="p-2 bg-slate-50 rounded-lg w-fit group-hover:scale-110 transition-transform">{icon}</div>
            <div>
                <p className="font-extrabold text-slate-900 text-sm">{title}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{desc}</p>
            </div>
        </div>
    )
}
