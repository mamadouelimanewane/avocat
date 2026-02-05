"use client"

import { useState, useEffect, useRef } from "react"
import {
    Mic,
    StopCircle,
    FileText,
    Wand2,
    Sparkles,
    Save,
    Share2,
    Play,
    Pause,
    History,
    CheckCircle2,
    Loader2,
    AlignLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Simulated Speech Data
const SIMULATED_TRANSCRIPT = [
    "Je souhaite rédiger un contrat de bail à usage professionnel.",
    "Le bailleur est la SCI Teranga, représentée par Monsieur Fall.",
    "Le preneur est la société Tech Solutions SARL.",
    "Le local est situé au 45 Avenue de la République, Dakar.",
    "Loyer mensuel de 1.500.000 FCFA hors taxes.",
    "Durée de 3 ans renouvelable.",
    "Dépôt de garantie de 3 mois."
]

export default function LexAudioPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState<string[]>([])
    const [currentText, setCurrentText] = useState("")
    const [extractedData, setExtractedData] = useState<any>({})
    const [processingStep, setProcessingStep] = useState(0)

    // Simulation Logic
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const indexRef = useRef(0)

    const startRecording = () => {
        setIsRecording(true)
        setTranscript([])
        setExtractedData({})
        setCurrentText("")
        indexRef.current = 0
        setProcessingStep(0)

        // Typewriter effect validation
        let charIndex = 0
        let sentenceIndex = 0

        intervalRef.current = setInterval(() => {
            if (sentenceIndex >= SIMULATED_TRANSCRIPT.length) {
                stopRecording()
                return
            }

            const sentence = SIMULATED_TRANSCRIPT[sentenceIndex]
            const char = sentence[charIndex]

            setCurrentText(prev => prev + char)
            charIndex++

            if (charIndex >= sentence.length) {
                // End of sentence
                setTranscript(prev => [...prev, sentence])
                setCurrentText("")
                charIndex = 0
                sentenceIndex++

                // Real-time Extraction Simulation
                extractData(sentence)
            }
        }, 50) // Speed of typing
    }

    const stopRecording = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsRecording(false)
        setCurrentText("")
        setProcessingStep(1) // Start post-processing

        // Simulate Processing Steps
        setTimeout(() => setProcessingStep(2), 1500) // Drafting
        setTimeout(() => setProcessingStep(3), 3000) // Compliance
        setTimeout(() => setProcessingStep(4), 4500) // Ready
    }

    const extractData = (sentence: string) => {
        // Simple heuristic extraction for demo
        if (sentence.includes("bailleur")) setExtractedData((prev: any) => ({ ...prev, bailleur: "SCI Teranga" }))
        if (sentence.includes("preneur")) setExtractedData((prev: any) => ({ ...prev, preneur: "Tech Solutions SARL" }))
        if (sentence.includes("Loyer")) setExtractedData((prev: any) => ({ ...prev, loyer: "1.500.000 FCFA" }))
        if (sentence.includes("situé")) setExtractedData((prev: any) => ({ ...prev, adresse: "45 Avenue de la République, Dakar" }))
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-slate-100 flex flex-col md:flex-row gap-8">

            {/* LEFT PANEL: VOICE INTERFACE */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden relative shadow-2xl">

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Mic className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white">LexAudio</h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Dictée Juridique Générative</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={cn(
                        "transition-all duration-500",
                        isRecording ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse" : "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                        {isRecording ? "ENREGISTREMENT..." : "PRÊT"}
                    </Badge>
                </div>

                {/* Visualizer Area (Simulation) */}
                <div className="flex-1 flex flex-col items-center justify-center relative p-8">
                    {/* Ambient Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 pointer-events-none" />

                    {/* Main Button */}
                    <div className="relative group cursor-pointer" onClick={isRecording ? stopRecording : startRecording}>
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-3xl transition-all duration-500 opacity-20 group-hover:opacity-40",
                            isRecording ? "bg-red-600 scale-150 animate-pulse" : "bg-indigo-600 scale-100"
                        )} />
                        <div className={cn(
                            "h-40 w-40 rounded-full flex items-center justify-center border-8 shadow-2xl transition-all duration-300 relative z-10",
                            isRecording
                                ? "bg-slate-900 border-red-500/50 text-red-500 scale-110"
                                : "bg-slate-800 border-indigo-500/20 text-white hover:border-indigo-500 hover:scale-105"
                        )}>
                            {isRecording ? <StopCircle className="h-16 w-16" /> : <Mic className="h-16 w-16" />}
                        </div>
                    </div>

                    <p className="mt-8 text-slate-500 font-mono text-sm tracking-widest uppercase">
                        {isRecording ? "Écoute en cours - Whisper V3" : "Appuyez pour dicter un acte"}
                    </p>
                </div>

                {/* Live Transcript Stream */}
                <div className="h-64 bg-slate-950 p-6 overflow-y-auto space-y-4 border-t border-white/5 font-mono text-sm relative">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
                    {transcript.map((line, i) => (
                        <div key={i} className="text-slate-300 animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-indigo-500 mr-3">{(i + 1).toString().padStart(2, '0')}</span>
                            {line}
                        </div>
                    ))}
                    {currentText && (
                        <div className="text-white border-l-2 border-indigo-500 pl-3 animate-pulse">
                            {currentText}_
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: GENERATION & EXTRACTION */}
            <div className="w-full md:w-1/2 space-y-6">

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Type Acte</p>
                                <p className="text-indigo-400 font-black">Bail Commercial</p>
                            </div>
                            <FileText className="h-8 w-8 text-slate-700" />
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Confiance IA</p>
                                <p className="text-emerald-400 font-black">98.5%</p>
                            </div>
                            <Sparkles className="h-8 w-8 text-emerald-900" />
                        </CardContent>
                    </Card>
                </div>

                {/* Live Extraction Form */}
                <Card className="bg-white text-slate-900 rounded-[2rem] shadow-xl border-none overflow-hidden h-[600px] flex flex-col relative">

                    {/* Processing Overlay */}
                    {processingStep > 0 && processingStep < 4 && (
                        <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center text-white space-y-6 backdrop-blur-sm animate-in fade-in">
                            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-bold">Génération en cours...</h3>
                                <div className="flex flex-col gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                                    <span className={processingStep >= 1 ? "text-emerald-400" : ""}>1. Analyse Sémantique {processingStep >= 1 && "✓"}</span>
                                    <span className={processingStep >= 2 ? "text-emerald-400" : ""}>2. Rédaction Clauses {processingStep >= 2 && "✓"}</span>
                                    <span className={processingStep >= 3 ? "text-emerald-400" : ""}>3. Contrôle OHADA {processingStep >= 3 && "✓"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-indigo-600" />
                            Document Généré
                        </h2>
                        {processingStep === 4 && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 pl-2">
                                <CheckCircle2 className="h-3 w-3" /> PRÊT
                            </Badge>
                        )}
                    </div>

                    <ScrollArea className="flex-1 p-8">
                        <div className="space-y-8 max-w-lg mx-auto draft-content font-serif leading-relaxed text-slate-800">

                            <div className="text-center space-y-4 border-b pb-8 border-slate-200">
                                <h1 className="text-2xl font-bold uppercase decoration-double underline decoration-slate-300 underline-offset-4">Contrat de Bail Commercial</h1>
                                <p className="text-sm italic text-slate-500">Soumis aux dispositions de l'Acte Uniforme OHADA</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-400 tracking-widest">I. Les Parties</h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                                    <p><span className="font-bold text-indigo-600">Bailleur:</span> {extractedData.bailleur || "..."}</p>
                                    <p><span className="font-bold text-indigo-600">Preneur:</span> {extractedData.preneur || "..."}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-400 tracking-widest">II. L'Objet</h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                                    <p><span className="font-bold text-indigo-600">Localisation:</span> {extractedData.adresse || "..."}</p>
                                    <p>Le Bailleur donne en location à titre professionnel les locaux désignés ci-dessus.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-sm uppercase text-slate-400 tracking-widest">III. Conditions Financières</h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                                    <p><span className="font-bold text-indigo-600">Loyer Mensuel:</span> {extractedData.loyer || "..."}</p>
                                    <p>Payable d'avance le 5 de chaque mois.</p>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>

                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                        <Button className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200" disabled={processingStep !== 4}>
                            <Save className="h-4 w-4 mr-2" /> ENREGISTRER L'ACTE
                        </Button>
                        <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200" disabled={processingStep !== 4}>
                            <Share2 className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>

                </Card>
            </div>

        </div>
    )
}
