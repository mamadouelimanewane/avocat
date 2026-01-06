"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Square, Trash2, FileText, Sparkles, Wand2, History, Save, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { structureLegalNote, createDocumentFromTemplate } from "@/app/actions"

export function LegalTranscription() {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [structuredNote, setStructuredNote] = useState<string | null>(null)
    const { toast } = useToast()

    const recognitionRef = useRef<any>(null)

    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            toast({
                variant: "destructive",
                title: "Non pris en charge",
                description: "Votre navigateur ne supporte pas la reconnaissance vocale."
            })
            return
        }

        setIsRecording(true)
        setStructuredNote(null)

        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "fr-FR"

        recognitionRef.current.onresult = (event: any) => {
            let currentTranscript = ""
            for (let i = 0; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript + " "
            }
            setTranscript(currentTranscript.trim())
        }

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error)
            stopRecording()
        }

        recognitionRef.current.onend = () => {
            setIsRecording(false)
        }

        recognitionRef.current.start()
    }

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        setIsRecording(false)
    }

    const processWithAI = async () => {
        if (!transcript) return
        setIsProcessing(true)

        try {
            const result = await structureLegalNote(transcript)
            if (result.success && result.note) {
                setStructuredNote(result.note)
                toast({
                    title: "Analyse terminée",
                    description: "La note d'audience a été structurée par LexAI."
                })
            } else {
                throw new Error(result.message || "Erreur inconnue")
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Erreur Analyse",
                description: e.message || "Impossible de structurer la note."
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Card className="shadow-lg border-slate-200 h-[650px] flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-900 text-white py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`}>
                            <Mic className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Dictée Juridique LexAI</CardTitle>
                            <CardDescription className="text-slate-400">Notes d'audiences et mémos vocaux structurés</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-indigo-400 text-indigo-400">V3.0 High-Precision</Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
                {/* Section Gauche: Enregistrement & Texte Brut */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <History className="h-4 w-4 text-slate-400" /> Transcription en direct
                        </h4>
                        <div className="flex gap-2">
                            {isRecording ? (
                                <Button size="sm" variant="destructive" onClick={stopRecording} className="h-8 gap-2">
                                    <Square className="h-3 w-3" /> Arrêter
                                </Button>
                            ) : (
                                <Button size="sm" onClick={startRecording} className="h-8 bg-indigo-600 gap-2">
                                    <Mic className="h-3 w-3" /> Lancer la dictée
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => setTranscript("")} className="h-8 text-slate-400"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        <div className={`text-lg leading-relaxed ${isRecording ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                            {transcript || "Le texte retranscrit s'affichera ici lors de votre dictée..."}
                            {isRecording && <span className="inline-block w-2 h-6 bg-red-500 ml-1 animate-pulse" />}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                        <Button
                            disabled={!transcript || isRecording || isProcessing}
                            onClick={processWithAI}
                            className="bg-slate-900 hover:bg-black text-white px-8 h-12 shadow-md gap-3"
                        >
                            {isProcessing ? <Sparkles className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 text-amber-500" />}
                            Structurer avec LexAI
                        </Button>
                    </div>
                </div>

                {/* Section Droite: Résultat IA */}
                <div className="flex-1 flex flex-col bg-slate-50/50">
                    <div className="p-4 border-b border-slate-50 bg-white">
                        <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Note Structurée & Actions
                        </h4>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        <AnimatePresence mode="wait">
                            {isProcessing ? (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center py-20"
                                >
                                    <div className="relative">
                                        <div className="h-20 w-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                        <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
                                    </div>
                                    <p className="mt-6 font-medium text-slate-700">LexAI analyse le contexte juridique...</p>
                                    <p className="text-xs text-slate-400 mt-1">Identification des parties et des réquisitions</p>
                                </motion.div>
                            ) : structuredNote ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="prose prose-sm prose-slate max-w-none"
                                >
                                    <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                                        {structuredNote}
                                    </div>
                                    <div className="mt-6 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-9 bg-white gap-2"
                                            onClick={async () => {
                                                setIsProcessing(true)
                                                try {
                                                    const result = await createDocumentFromTemplate(
                                                        "677c7774e54823467f555555", // Simulated Dossier
                                                        "PROCEDURE_conclusion", // Using a general template
                                                        {
                                                            CONTENU: structuredNote || "",
                                                            CLIENT_NOM: "M. Ndiaye",
                                                            DATE: new Date().toLocaleDateString('fr-FR')
                                                        }
                                                    )
                                                    if (result.success) {
                                                        toast({ title: "Note sauvegardée", description: "La note a été ajoutée au dossier." })
                                                    }
                                                } finally {
                                                    setIsProcessing(false)
                                                }
                                            }}
                                            disabled={isProcessing}
                                        >
                                            <Save className="h-4 w-4" /> Enregistrer
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 h-9 bg-white gap-2 text-indigo-600"><FileText className="h-4 w-4" /> Export Docx</Button>
                                    </div>
                                    <Button className="w-full mt-2 h-10 bg-indigo-600 text-white gap-2"><Send className="h-4 w-4" /> WhatsApp Client</Button>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30">
                                    <FileText className="h-16 w-16 text-slate-300 mb-4" />
                                    <p className="text-sm font-medium">Aucune note générée</p>
                                    <p className="text-xs mt-1 max-w-[200px]">Lancez la dictée puis demandez une structuration IA.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
