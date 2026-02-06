
"use client"

import { useState, useRef, useEffect } from "react"
import {
    Mic,
    MicOff,
    BarChart3,
    Play,
    Square,
    Volume2,
    BrainCircuit,
    ThumbsUp,
    ThumbsDown,
    Zap,
    Timer,
    History,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface LexVoiceProps {
    dossierId: string
    onClose?: () => void
}

export function LexVoice({ dossierId, onClose }: LexVoiceProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [showResults, setShowResults] = useState(false)

    // Mock Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isRecording])

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false)
            setShowResults(true)
        } else {
            setIsRecording(true)
            setShowResults(false)
            setRecordingTime(0)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="bg-violet-950 border-l border-violet-800 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden text-white">
            {/* Header - Studio Style */}
            <div className="p-4 border-b border-violet-800 bg-violet-950 sticky top-0 z-20 flex items-center justify-between shadow-lg shadow-black/20">
                <div className="flex items-center gap-2">
                    <div className="bg-violet-500/20 p-2 rounded-full border border-violet-500/50">
                        <Mic className="h-5 w-5 text-violet-300" />
                    </div>
                    <div>
                        <h3 className="font-black text-white tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-violet-400">Voice</span> Coach
                        </h3>
                        <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Plaidoirie & Rhétorique</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-violet-900 rounded-full h-8 w-8 text-violet-400">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/grid-dot-dark.svg')] bg-center" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]" />

                {!showResults ? (
                    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                        {/* Audio Visualizer Mock */}
                        <div className="h-32 flex items-center justify-center gap-1 w-full">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-2 bg-gradient-to-t from-violet-600 to-indigo-400 rounded-full transition-all duration-100",
                                        isRecording ? "animate-pulse" : "h-2 opacity-30"
                                    )}
                                    style={{
                                        height: isRecording ? `${Math.random() * 100}%` : '8px',
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Status Text */}
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter tabular-nums text-white">
                                {formatTime(recordingTime)}
                            </h2>
                            <p className={cn("text-xs font-bold uppercase tracking-widest animate-pulse", isRecording ? "text-red-500" : "text-slate-500")}>
                                {isRecording ? "🔴 Enregistrement..." : "Prêt à plaider"}
                            </p>
                        </div>

                        {/* Record Button */}
                        <Button
                            onClick={toggleRecording}
                            className={cn(
                                "rounded-full w-24 h-24 shadow-2xl transition-all duration-300 border-4",
                                isRecording
                                    ? "bg-slate-900 border-red-500/50 hover:bg-slate-800 text-red-500"
                                    : "bg-violet-600 border-violet-400/50 hover:bg-violet-500 text-white hover:scale-110"
                            )}
                        >
                            {isRecording ? <Square className="fill-current h-8 w-8" /> : <Mic className="h-8 w-8" />}
                        </Button>
                    </div>
                ) : (
                    <ScrollArea className="w-full h-full">
                        <div className="w-full space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
                            {/* Results Dashboard */}
                            <div className="text-center space-y-1 mb-8">
                                <h2 className="text-2xl font-black text-white">Analyse Terminé</h2>
                                <p className="text-violet-300 font-medium">Session de 03:45 • Score Global : 85/100</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <ResultCard
                                    label="Persuasion"
                                    score={88}
                                    icon={<BrainCircuit className="h-4 w-4 text-emerald-400" />}
                                    color="bg-emerald-500"
                                />
                                <ResultCard
                                    label="Clarté"
                                    score={92}
                                    icon={<Volume2 className="h-4 w-4 text-blue-400" />}
                                    color="bg-blue-500"
                                />
                                <ResultCard
                                    label="Rythme"
                                    score={74}
                                    icon={<Timer className="h-4 w-4 text-amber-400" />}
                                    color="bg-amber-500"
                                />
                                <ResultCard
                                    label="Agressivité"
                                    score={45}
                                    icon={<Zap className="h-4 w-4 text-rose-400" />}
                                    color="bg-rose-500"
                                    lowIsGood
                                />
                            </div>

                            <Card className="bg-violet-900/50 border-violet-700/50">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <History className="h-4 w-4 text-violet-300" />
                                        <h4 className="font-bold text-sm text-white">Feedback IA</h4>
                                    </div>
                                    <FeedbackItem type="positive" text="Excellente structure de l'argument principal." />
                                    <FeedbackItem type="positive" text="Bonne modulation vocale sur les points clés." />
                                    <FeedbackItem type="negative" text="Ralentissez lors de l'énoncé des jurisprudences." />
                                </CardContent>
                            </Card>

                            <Button
                                onClick={toggleRecording}
                                variant="outline"
                                className="w-full h-12 border-violet-600 text-violet-200 hover:bg-violet-800 hover:text-white font-bold"
                            >
                                <Mic className="h-4 w-4 mr-2" /> NOUVELLE SESSION
                            </Button>
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    )
}

function ResultCard({ label, score, icon, color, lowIsGood }: { label: string, score: number, icon: React.ReactNode, color: string, lowIsGood?: boolean }) {
    return (
        <div className="bg-violet-900/40 p-3 rounded-xl border border-violet-800 flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-violet-300 uppercase">{label}</span>
                {icon}
            </div>
            <div className="space-y-1">
                <span className="text-2xl font-black text-white">{score}%</span>
                <Progress value={score} className="h-1.5 bg-violet-950" indicatorClassName={color} />
            </div>
        </div>
    )
}

function FeedbackItem({ type, text }: { type: 'positive' | 'negative', text: string }) {
    return (
        <div className="flex gap-3 items-start text-sm">
            <div className={cn("mt-0.5", type === 'positive' ? "text-emerald-400" : "text-rose-400")}>
                {type === 'positive' ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
            </div>
            <p className="text-violet-100 leading-tight">{text}</p>
        </div>
    )
}
