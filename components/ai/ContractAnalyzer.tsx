
"use client"

import { useState } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, Search, BrainCircuit, ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { analyzeContract } from '@/app/actions'
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useRef } from 'react'

export function ContractAnalyzer() {
    const [text, setText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsAnalyzing(true)
        // Simulate OCR
        await new Promise(resolve => setTimeout(resolve, 1500))

        setText(`CONTRAT DE PRESTATION DE SERVICES
        
ENTRE LES SOUSSIGNÉS :
Société Alpha, SARL au capital de 1.000.000 FCFA, dont le siège social est situé à Dakar, représentée par M. Directeur Général.
Ci-après dénommée "Le Prestataire"

ET :
M. Dupont, demeurant à Dakar, Plateau.
Ci-après dénommé "Le Client"

IL A ÉTÉ CONVENU CE QUI SUIT :

Article 1 - Objet
Le Prestataire s'engage à fournir une mission de conseil stratégique.

Article 12 - Non-concurrence
Le Client s'interdit d'exercer toute activité concurrente pendant une durée de 5 ans sur tout le territoire de la CEDEAO.

Article 15 - Loi Applicable
Le présent contrat est régi par les usages du commerce.`)

        setIsAnalyzing(false)
        toast({ title: "OCR Terminé", description: "Texte extrait avec succès du fichier " + file.name })
    }

    const handleAnalyze = async () => {
        if (!text) return
        setIsAnalyzing(true)
        setProgress(10)

        // Simulation of progress steps
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) return 90;
                return p + 15
            })
        }, 400)

        const analysis = await analyzeContract(text)

        clearInterval(interval)
        setProgress(100)
        setTimeout(() => {
            setResult(analysis)
            setIsAnalyzing(false)
        }, 500)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Section */}
            <Card className="flex flex-col h-full border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        Texte du Contrat
                    </CardTitle>
                    <CardDescription>Collez le texte ou téléversez un PDF (simulé) pour analyse.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-4 flex flex-col gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                        />
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Glisser-déposer un fichier ici</span>
                        <span className="text-xs">PDF, DOCX (Max 10MB)</span>
                    </div>
                    <div className="relative flex-1">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            placeholder="... ou collez le texte de la clause ou du contrat ici."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={!text || isAnalyzing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white relative overflow-hidden"
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <BrainCircuit className="h-4 w-4 animate-spin" />
                                Analyse sémantique en cours...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ScanSearch className="h-4 w-4" />
                                Analyser avec LexAI
                            </span>
                        )}
                        {isAnalyzing && (
                            <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${progress}%` }} />
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
                {result ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Summary Card */}
                        <Card className="border-emerald-100 bg-emerald-50/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-emerald-800 text-lg flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" /> Synthèse
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-emerald-900/80 leading-relaxed text-sm">
                                    {result.summary}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Risks Card */}
                        <Card className="border-amber-100 bg-amber-50/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Points de Vigilance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {result.risks.map((risk: any, i: number) => (
                                    <div key={i} className="flex gap-3 items-start bg-white p-3 rounded-md border border-amber-100 shadow-sm">
                                        <Badge variant={risk.severity === 'HIGH' ? 'destructive' : 'outline'} className="shrink-0">
                                            {risk.severity}
                                        </Badge>
                                        <p className="text-sm text-slate-700">{risk.text}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Key Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="py-3"><CardTitle className="text-sm">Parties Identifiées</CardTitle></CardHeader>
                                <CardContent className="py-2 text-sm space-y-1">
                                    {result.parties.map((p: string, i: number) => <div key={i} className="font-medium text-slate-700">• {p}</div>)}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3"><CardTitle className="text-sm">Dates Clés</CardTitle></CardHeader>
                                <CardContent className="py-2 text-sm space-y-2">
                                    {result.dates.map((d: any, i: number) => (
                                        <div key={i} className="flex justify-between">
                                            <span className="text-slate-500">{d.label}</span>
                                            <span className="font-medium">{d.value || d.date}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <BrainCircuit className="h-12 w-12 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">En attente de contenu</h3>
                        <p className="text-sm max-w-xs text-center mt-2">
                            L'IA analysera le texte pour détecter les risques juridiques, les clauses abusives et les échéances clés.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
