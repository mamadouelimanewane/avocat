"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mic,
    Square,
    X,
    Loader2,
    Sparkles,
    Volume2,
    History,
    ChevronRight,
    Search,
    Plus,
    Calendar,
    Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { transcribeAudio, processVoiceCommand } from '@/lib/voice-service'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
    const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0))

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const animationFrameRef = useRef<number>()
    const router = useRouter()

    useEffect(() => {
        if (isRecording && analyser) {
            const updateData = () => {
                const data = new Uint8Array(analyser.frequencyBinCount)
                analyser.getByteFrequencyData(data)
                setAudioData(data)
                animationFrameRef.current = requestAnimationFrame(updateData)
            }
            updateData()
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [isRecording, analyser])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            // Set up audio analyzer for visualization
            const audioContext = new AudioContext()
            const source = audioContext.createMediaStreamSource(stream)
            const analyserNode = audioContext.createAnalyser()
            analyserNode.fftSize = 64
            source.connect(analyserNode)
            setAnalyser(analyserNode)

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data)
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                await handleTranscription(audioBlob)
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            setTranscript('')
        } catch (err) {
            console.error('Microphone access error:', err)
            toast({
                title: "Erreur Micro",
                description: "Veuillez autoriser l'accès au microphone pour utiliser l'assistant vocal.",
                variant: "destructive"
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const handleTranscription = async (blob: Blob) => {
        setIsProcessing(true)
        try {
            const result = await transcribeAudio(blob)
            if (result.text) {
                setTranscript(result.text)
                setHistory(prev => [result.text, ...prev].slice(0, 5))
                await executeCommand(result.text)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const executeCommand = async (text: string) => {
        const command = await processVoiceCommand(text)

        if (!command) return

        switch (command.intent) {
            case 'NAVIGATE':
                toast({ title: `Navigation vers ${command.page}` })
                router.push(`/${command.page}`)
                setIsOpen(false)
                break
            case 'CREATE_NOTE':
                toast({
                    title: "Note créée via LexAI Voice",
                    description: `Dossier: ${command.dossier || 'Général'} - ${command.content}`
                })
                break
            case 'CREATE_EVENT':
                toast({
                    title: "Nouvel événement planifié",
                    description: `${command.title} le ${new Date(command.date).toLocaleDateString()}`
                })
                break
            case 'SEARCH':
                toast({ title: "Recherche en cours...", description: command.query })
                router.push(`/recherche?q=${encodeURIComponent(command.query)}`)
                setIsOpen(false)
                break
            default:
                break
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4"
                    >
                        <Card className="w-80 shadow-2xl border-2 border-indigo-100 overflow-hidden bg-white/95 backdrop-blur-md">
                            <CardContent className="p-0">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold tracking-tight">LexAI Voice Assistant</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-4">
                                    {/* Waveform / Visualizer */}
                                    <div className="h-20 bg-slate-50 rounded-xl flex items-center justify-center gap-1 overflow-hidden">
                                        {isRecording ? (
                                            Array.from(audioData).map((val, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: Math.max(4, val / 4) }}
                                                    className="w-1 bg-indigo-500 rounded-full"
                                                />
                                            ))
                                        ) : isProcessing ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyse en cours...</span>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Volume2 className="h-6 w-6 text-slate-200 mx-auto" />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cliquez sur le micro</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Transcript Box */}
                                    {transcript && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                                        >
                                            <p className="text-sm font-medium text-indigo-900 italic">"{transcript}"</p>
                                        </motion.div>
                                    )}

                                    {/* Suggested Commands */}
                                    {!transcript && !isRecording && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                                <Sparkles className="h-3 w-3" /> Exemples de commandes
                                            </div>
                                            <div className="grid grid-cols-1 gap-1">
                                                <CommandTag icon={Briefcase} text="Dossiers en cours" />
                                                <CommandTag icon={Calendar} text="Rdv demain 10h" />
                                                <CommandTag icon={Plus} text="Note : Relancer Client X" />
                                                <CommandTag icon={Search} text="Chercher loi bail" />
                                            </div>
                                        </div>
                                    )}

                                    {/* History */}
                                    {history.length > 0 && !isRecording && (
                                        <div className="pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-2">
                                                <History className="h-3 w-3" /> Historique récent
                                            </div>
                                            <div className="space-y-1">
                                                {history.map((item, i) => (
                                                    <p key={i} className="text-[10px] text-slate-500 truncate font-medium flex items-center gap-1">
                                                        <ChevronRight className="h-2 w-2" /> {item}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5 }}
                            exit={{ scale: 0 }}
                            className="absolute -inset-1 bg-red-500/20 rounded-full blur-xl"
                        />
                    )}
                </AnimatePresence>
                <Button
                    size="icon"
                    className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110 shadow-indigo-200'
                        }`}
                    onClick={() => {
                        if (isRecording) stopRecording()
                        else {
                            if (!isOpen) setIsOpen(true)
                            startRecording()
                        }
                    }}
                >
                    {isRecording ? (
                        <Square className="h-6 w-6 text-white" />
                    ) : (
                        <Mic className="h-7 w-7 text-white" />
                    )}
                </Button>
            </div>
        </div>
    )
}

function CommandTag({ icon: Icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
            <div className="h-6 w-6 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                <Icon className="h-3 w-3" />
            </div>
            <span className="text-[11px] font-medium text-slate-600">{text}</span>
        </div>
    )
}
