"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Upload,
    FileText,
    Scale,
    AlertCircle,
    CheckCircle2,
    Target,
    BookOpen,
    Gavel,
    FileSearch,
    Sparkles,
    Download,
    Copy
} from "lucide-react"
import { analyzeAdverseDocument } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

interface AnalysisResult {
    summary: string
    documentType: string
    claims: Array<{
        claim: string
        legalBasis: string
        weaknesses: string[]
    }>
    legalIssues: Array<{
        issue: string
        applicableLaw: string
        ourPosition: string
    }>
    defenseStrategy: {
        mainArguments: string[]
        counterClaims: string[]
        evidenceNeeded: string[]
    }
    pleadingDraft: string
    jurisprudenceReferences: Array<{
        title: string
        reference: string
        relevance: string
    }>
}

export function AdverseDocumentScanner() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentText, setDocumentText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const { toast } = useToast()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setIsAnalyzing(true)
        setProgress(10)

        try {
            toast({
                title: "🔍 Extraction en cours...",
                description: `Analyse de ${file.name} avec OCR réel`
            })

            // Import dynamique du module OCR
            const { extractTextFromFile, improveOCRText } = await import('@/lib/ocr')

            setProgress(30)

            // Extraction réelle du texte
            const ocrResult = await extractTextFromFile(file)

            setProgress(70)

            if (ocrResult.success && ocrResult.text) {
                // Amélioration du texte OCR
                const improvedText = improveOCRText(ocrResult.text)

                setDocumentText(improvedText)
                setProgress(100)

                toast({
                    title: "✅ Document extrait",
                    description: `${improvedText.length} caractères | Confiance: ${ocrResult.confidence.toFixed(0)}% | ${ocrResult.pages} page(s)`,
                    className: "bg-emerald-50 border-emerald-200"
                })
            } else {
                // Fallback si échec
                toast({
                    title: "⚠️ Extraction partielle",
                    description: ocrResult.error || "Veuillez coller le texte manuellement",
                    variant: "destructive"
                })
                setDocumentText("")
            }
        } catch (error) {
            console.error('Erreur extraction:', error)
            toast({
                title: "Erreur",
                description: "Impossible d'extraire le texte. Collez-le manuellement.",
                variant: "destructive"
            })
            setDocumentText("")
        } finally {
            setIsAnalyzing(false)
            setProgress(0)
        }
    }

    const handleAnalyze = async () => {
        if (!documentText) return

        setIsAnalyzing(true)
        setProgress(50)

        try {
            // Simulation de progression
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + 10, 90))
            }, 500)

            const result = await analyzeAdverseDocument(documentText)

            clearInterval(interval)
            setProgress(100)

            if (result.success && result.analysis) {
                setAnalysisResult(result.analysis)
                toast({
                    title: "✅ Analyse terminée",
                    description: "Stratégie de défense générée avec succès",
                    className: "bg-emerald-50 border-emerald-200"
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'analyser le document",
                variant: "destructive"
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: "Copié !", description: "Texte copié dans le presse-papier" })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <FileSearch className="h-8 w-8 text-indigo-600" />
                        Scanner de Documents Adverses
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Analyse IA pour préparer votre défense et plaidoirie
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card className="border-indigo-100">
                    <CardHeader className="bg-indigo-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-indigo-600" />
                            Document à Analyser
                        </CardTitle>
                        <CardDescription>
                            Assignation, conclusions, jugement ou tout document adverse
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 hover:bg-indigo-50/30 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".pdf,.docx,.txt,.jpg,.png"
                                onChange={handleFileUpload}
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <FileText className="h-12 w-12 text-indigo-400 mb-3" />
                                <span className="text-sm font-medium text-slate-700">
                                    Glisser-déposer ou cliquer pour téléverser
                                </span>
                                <span className="text-xs text-slate-500 mt-1">
                                    PDF, DOCX, Image (Max 10MB)
                                </span>
                            </label>
                        </div>

                        {selectedFile && (
                            <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                <FileText className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm font-medium text-slate-700 flex-1">
                                    {selectedFile.name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    {(selectedFile.size / 1024).toFixed(0)} KB
                                </Badge>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Ou coller le texte directement
                            </label>
                            <Textarea
                                className="min-h-[200px] font-mono text-xs"
                                placeholder="Collez le texte du document adverse ici..."
                                value={documentText}
                                onChange={(e) => setDocumentText(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !documentText}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                    Analyse en cours... {progress}%
                                </>
                            ) : (
                                <>
                                    <Scale className="mr-2 h-4 w-4" />
                                    Analyser avec LexAI
                                </>
                            )}
                        </Button>

                        {isAnalyzing && (
                            <Progress value={progress} className="h-2" />
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Card className="border-emerald-100">
                    <CardHeader className="bg-emerald-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-600" />
                            Analyse & Stratégie
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {analysisResult ? (
                            <Tabs defaultValue="summary" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                                    <TabsTrigger value="summary">Synthèse</TabsTrigger>
                                    <TabsTrigger value="defense">Défense</TabsTrigger>
                                    <TabsTrigger value="pleading">Plaidoirie</TabsTrigger>
                                    <TabsTrigger value="law">Droit</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="h-[600px]">
                                    <TabsContent value="summary" className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                                                {analysisResult.documentType}
                                            </Badge>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {analysisResult.summary}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                                Prétentions Adverses
                                            </h3>
                                            {analysisResult.claims.map((claim, i) => (
                                                <Card key={i} className="bg-amber-50/50 border-amber-100">
                                                    <CardContent className="p-4 space-y-2">
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {claim.claim}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Base légale : {claim.legalBasis}
                                                        </p>
                                                        <div className="space-y-1">
                                                            {claim.weaknesses.map((weakness, j) => (
                                                                <div key={j} className="flex items-start gap-2 text-xs text-red-600">
                                                                    <span>⚠️</span>
                                                                    <span>{weakness}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="defense" className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-emerald-700 flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Arguments Principaux
                                            </h3>
                                            {analysisResult.defenseStrategy.mainArguments.map((arg, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-md border border-emerald-100">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <p className="text-sm text-slate-700">{arg}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-indigo-700 flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                Demandes Reconventionnelles
                                            </h3>
                                            {analysisResult.defenseStrategy.counterClaims.map((claim, i) => (
                                                <div key={i} className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                                    <p className="text-sm text-slate-700">{claim}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Preuves à Collecter
                                            </h3>
                                            {analysisResult.defenseStrategy.evidenceNeeded.map((evidence, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span className="text-slate-400">•</span>
                                                    {evidence}
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="pleading" className="p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <Gavel className="h-4 w-4 text-purple-600" />
                                                Projet de Plaidoirie
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard(analysisResult.pleadingDraft)}
                                                >
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copier
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Export
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif text-slate-700 p-4 bg-slate-50 rounded-md border border-slate-200">
                                            {analysisResult.pleadingDraft}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="law" className="p-6 space-y-4">
                                        {analysisResult.legalIssues.map((issue, i) => (
                                            <Card key={i} className="border-blue-100">
                                                <CardContent className="p-4 space-y-2">
                                                    <h4 className="font-semibold text-blue-900">{issue.issue}</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <p className="text-slate-600">
                                                            <span className="font-medium">Texte applicable :</span>{' '}
                                                            {issue.applicableLaw}
                                                        </p>
                                                        <p className="text-emerald-700">
                                                            <span className="font-medium">Notre position :</span>{' '}
                                                            {issue.ourPosition}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <div className="space-y-3 mt-6">
                                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                                Jurisprudence Pertinente
                                            </h3>
                                            {analysisResult.jurisprudenceReferences.map((juris, i) => (
                                                <div key={i} className="p-3 bg-indigo-50 rounded-md border border-indigo-100 space-y-1">
                                                    <p className="text-sm font-medium text-indigo-900">{juris.title}</p>
                                                    <p className="text-xs text-slate-600">{juris.reference}</p>
                                                    <p className="text-xs text-slate-500 italic">{juris.relevance}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </ScrollArea>
                            </Tabs>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
                                <Scale className="h-16 w-16 mb-4 opacity-20" />
                                <p className="text-sm">En attente d'analyse...</p>
                                <p className="text-xs mt-2 max-w-xs text-center">
                                    Téléversez un document adverse et lancez l'analyse IA pour obtenir une stratégie de défense complète.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
