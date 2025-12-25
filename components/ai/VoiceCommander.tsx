
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { processVoiceInput } from '@/app/actions'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function VoiceCommander() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const recognitionRef = useRef<any>(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true // Permit long dictation
                recognition.interimResults = true
                recognition.lang = 'fr-FR'

                recognition.onresult = (event: any) => {
                    let interimTranscript = ''
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            setTranscript(prev => prev + event.results[i][0].transcript)
                        } else {
                            interimTranscript += event.results[i][0].transcript
                        }
                    }
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognitionRef.current = recognition
            }
        }
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop()
        }
    }, [])

    // Let's rely on manual stop or distinct event for safety in v1.

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast({ title: "Non supporté", description: "Votre navigateur ne supporte pas la dictée." })
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
            // Processing will be triggered by onend? 
            // Let's force it here to be sure, but we need the latest transcript.
            handleProcess(transcript)
        } else {
            setTranscript('')
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    const handleProcess = async (text: string) => {
        if (!text || text.length < 3) return

        setIsProcessing(true)
        try {
            const result = await processVoiceInput(text)

            if (result.success) {
                toast({
                    title: "Commande exécutée",
                    description: result.message,
                    className: "bg-emerald-50 border-emerald-200"
                })
                if (result.redirect) {
                    router.push(result.redirect)
                }
                setTranscript('') // Clear after success
            } else {
                toast({ title: "Erreur", description: result.message, variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Erreur", description: "Impossible de traiter la commande." })
        } finally {
            setIsProcessing(false)
        }
    }

    if (!recognitionRef.current && typeof window !== 'undefined') return null // Don't render if not supported

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-end gap-2">
            {/* Feedback Popover */}
            {(isListening || transcript) && (
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl mb-2 max-w-sm animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm font-medium">
                        {isListening ? "Je vous écoute..." : "Traitement..."}
                    </p>
                    {transcript && (
                        <p className="text-xs text-slate-300 mt-1 italic">"{transcript}"</p>
                    )}
                </div>
            )}

            {/* Mic Button */}
            <Button
                size="icon"
                onClick={toggleListening}
                disabled={isProcessing}
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 border-2",
                    isListening
                        ? "bg-red-500 hover:bg-red-600 border-red-200 animate-pulse"
                        : "bg-indigo-600 hover:bg-indigo-700 border-white",
                    isProcessing && "opacity-80"
                )}
            >
                {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : isListening ? (
                    <StopCircle className="h-6 w-6" />
                ) : (
                    <Mic className="h-6 w-6" />
                )}
            </Button>
        </div>
    )
}
