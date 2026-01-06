"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Mic,
    Square,
    Loader2,
    Sparkles,
    FileText,
    ClipboardCopy,
    RefreshCw,
    Languages,
    Wind
} from 'lucide-react'
import { transcribeAudio } from '@/lib/voice-service'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'

export function VoiceDictation() {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [text, setText] = useState('')
    const [language, setLanguage] = useState<'fr' | 'wo'>('fr') // French or Wolof (simulated)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

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
        } catch (err) {
            console.error(err)
            toast({ title: "Erreur Micro", variant: "destructive" })
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
                // Append text instead of replacing
                setText(prev => prev ? prev + ' ' + result.text : result.text)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        toast({ title: "Texte copié !" })
    }

    return (
        <Card className="border-none shadow-xl overflow-hidden group">
            <CardHeader className="bg-slate-900 text-white border-none">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Dictée Juridique LexAI</CardTitle>
                            <CardDescription className="text-slate-400">Transcrivez vos conclusions et actes par la voix.</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            className={`text-white text-xs font-bold gap-2 ${language === 'fr' ? 'bg-blue-600/20' : ''}`}
                            onClick={() => setLanguage('fr')}
                        >
                            FR
                        </Button>
                        <Button
                            variant="ghost"
                            className={`text-white text-xs font-bold gap-2 ${language === 'wo' ? 'bg-blue-600/20' : ''}`}
                            onClick={() => setLanguage('wo')}
                        >
                            WO
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
                <div className="relative">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Cliquez sur le micro pour commencer à dicter vos conclusions..."
                        className="min-h-[300px] text-lg leading-relaxed p-6 border-2 border-slate-100 focus:border-blue-600 transition-all font-serif italic text-slate-700"
                    />
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                            <Wind className="h-8 w-8 text-blue-600 animate-pulse" />
                            <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Transcription LexAI...</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="font-bold border-2"
                            onClick={() => setText('')}
                            disabled={!text || isProcessing}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" /> Effacer
                        </Button>
                        <Button
                            variant="outline"
                            className="font-bold border-2"
                            onClick={copyToClipboard}
                            disabled={!text || isProcessing}
                        >
                            <ClipboardCopy className="h-4 w-4 mr-2" /> Copier
                        </Button>
                    </div>

                    <div className="flex items-center gap-6">
                        {isRecording && (
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 bg-red-500 rounded-full animate-ping" />
                                <span className="text-xs font-black text-red-600 uppercase">Enregistrement...</span>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${isRecording
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            onClick={() => isRecording ? stopRecording() : startRecording()}
                            disabled={isProcessing}
                        >
                            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* AI Polish Option */}
                {text && !isRecording && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-100 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-bold text-blue-900">Corriger & Formaliser avec LexAI</p>
                                <p className="text-[10px] text-blue-700">Appliquer une structure juridique et corriger les fautes.</p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Appliquer</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
