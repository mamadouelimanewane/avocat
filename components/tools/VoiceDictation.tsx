
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, StopCircle, RefreshCw, Wand2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

declare global {
    interface Window {
        webkitSpeechRecognition: any
        SpeechRecognition: any
    }
}

interface VoiceDictationProps {
    onTranscript: (text: string) => void
    className?: string
}

export function VoiceDictation({ onTranscript, className }: VoiceDictationProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [interimTranscript, setInterimTranscript] = useState("")
    const recognitionRef = useRef<any>(null)
    const [isSupported, setIsSupported] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'fr-FR'

                recognition.onstart = () => {
                    setIsListening(true)
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognition.onresult = (event: any) => {
                    let finalTrans = ''
                    let interimTrans = ''

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTrans += event.results[i][0].transcript
                        } else {
                            interimTrans += event.results[i][0].transcript
                        }
                    }

                    if (finalTrans) {
                        setTranscript(prev => {
                            const newText = prev + (prev ? ' ' : '') + finalTrans
                            onTranscript(finalTrans) // Send chunk
                            return newText
                        })
                    }
                    setInterimTranscript(interimTrans)
                }

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error)
                    if (event.error === 'not-allowed') {
                        toast({ title: "Microphone non autorisé", variant: "destructive" })
                    }
                    setIsListening(false)
                }

                recognitionRef.current = recognition
            } else {
                setIsSupported(false)
            }
        }
    }, [onTranscript])

    const toggleListening = () => {
        if (!isSupported) {
            toast({ title: "Non supporté", description: "Votre navigateur ne supporte pas la dictée vocale.", variant: "destructive" })
            return
        }

        if (isListening) {
            recognitionRef.current?.stop()
        } else {
            try {
                recognitionRef.current?.start()
            } catch (err) {
                console.error("Failed to start", err)
            }
        }
    }

    const reset = () => {
        setTranscript("")
        setInterimTranscript("")
    }

    if (!isSupported) return null

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center gap-2">
                <Button
                    variant={isListening ? "destructive" : "default"}
                    size="sm"
                    className={`gap-2 transition-all ${isListening ? 'animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    onClick={toggleListening}
                >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isListening ? "Arrêter Dictée" : "Dictée Vocale"}
                </Button>
                {transcript && (
                    <Button variant="ghost" size="icon" onClick={reset} title="Effacer">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {(isListening || transcript) && (
                <div className="p-3 bg-slate-50 border rounded-md text-sm min-h-[60px] relative">
                    {isListening && <div className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-ping"></div>}
                    <p className="text-slate-800">{transcript}<span className="text-slate-400 italic">{interimTranscript}</span></p>
                </div>
            )}
        </div>
    )
}
