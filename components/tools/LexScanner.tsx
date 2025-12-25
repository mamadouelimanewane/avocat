
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ScanSearch,
    UploadCloud,
    FileText,
    Calendar,
    AlertTriangle,
    Lightbulb,
    Scale,
    CheckCircle2,
    Loader2,
    PenTool,
    Sparkles
} from "lucide-react"
import { analyzeDocument } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

export function LexScanner() {
    const [content, setContent] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [isDrafting, setIsDrafting] = useState(false)
    const [draftContent, setDraftContent] = useState("")
    const [activeTab, setActiveTab] = useState("overview")
    const { toast } = useToast()

    // Mock analysis until backend is fully hooked up
    const handleAnalyze = async () => {
        if (!content.trim()) return

        setIsAnalyzing(true)
        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // In a real scenario, this would call openai via server action
            // const result = await analyzeDocument(content)

            // Mock Result based on input for demo
            setAnalysis({
                summary: "Conclusions en réponse sollicitant le débouté de toutes les demandes de la partie adverse au motif de la prescription triennale.",
                dates: [
                    { date: "2024-03-15", label: "Date de signification", type: "CRITICAL" },
                    { date: "2024-03-30", label: "Délai de réplique (est.)", type: "WARNING" }
                ],
                arguments: [
                    {
                        point: "Prescription de l'action",
                        strength: "HAUTE",
                        counter: "Vérifier la date du dernier acte interruptif (ex: reconnaissance de dette)."
                    },
                    {
                        point: "Absence de preuve du préjudice",
                        strength: "MOYENNE",
                        counter: "Produire les factures et attestations de perte de chiffre d'affaires."
                    }
                ],
                laws: ["Article 233 de l'Acte Uniforme portant Droit Commercial Général", "Article 118 du COCC"]
            })

            toast({ title: "Analyse terminée", description: "Le document a été scanné avec succès." })
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible d'analyser le document." })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleGenerateDraft = async () => {
        setIsDrafting(true)
        setActiveTab("draft")
        try {
            // Mock draft generation
            await new Promise(resolve => setTimeout(resolve, 3000))

            const draft = `
CABINET LEXPREMIUM
Avocats à la Cour
Dakar, le ${new Date().toLocaleDateString('fr-FR')}

CONCLUSIONS EN RÉPONSE

POUR : 
Monsieur Moussa DIALLO, demeurant à Dakar...
Ayant pour Conseil : Le Cabinet LEXPREMIUM

CONTRE : 
La Société CONSTRUCTION SA...
Ayant pour Conseil : Maître...

PLAISE AU TRIBUNAL

I. RAPPEL DES FAITS ET DE LA PROCÉDURE

Attendu que par exploit en date du... la société CONSTRUCTION SA a assigné le concluant en paiement de...

II. DISCUSSION JURIDIQUE

A. Sur la prescription de l'action

Attendu qu'aux termes de l'article 233 de l'Acte Uniforme portant Droit Commercial Général, les actions nées à l'occasion de la vente commerciale se prescrivent par deux ans...

Or, il est constant que la dernière facture date du... soit plus de trois ans avant l'assignation.
L'action est donc manifestement prescrite.

B. Sur l'absence de preuve

Attendu qu'il appartient à celui qui réclame l'exécution d'une obligation de la prouver (Art. 9 du COCC)...
La demanderesse ne verse aucune pièce probante aux débats.

PAR CES MOTIFS

Il plaira au Tribunal de :

- CONSTATER la prescription de l'action de la société CONSTRUCTION SA ;
- DÉCLARER l'action irrecevable ;
- DÉBOUTER la société CONSTRUCTION SA de toutes ses demandes ;
- CONDAMNER la requérante aux dépens.

SOUS TOUTES RÉSERVES
            `
            setDraftContent(draft)
            toast({ title: "Brouillon généré", description: "Le projet de conclusions a été rédigé avec succès." })
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de générer le brouillon." })
        } finally {
            setIsDrafting(false)
        }
    }

    return (
        <Card className="h-full border-indigo-100 shadow-md flex flex-col bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <ScanSearch className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">LexScanner™</CardTitle>
                            <CardDescription>Audit IA de conclusions & pièces adverses</CardDescription>
                        </div>
                    </div>
                    {analysis && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Analyse Complète
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
                {!analysis ? (
                    <div className="p-6 flex flex-col h-full">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl flex-1 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/30 transition-colors p-8 text-center space-y-4">
                            <div className="bg-white p-4 rounded-full shadow-sm">
                                <UploadCloud className="h-8 w-8 text-indigo-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900">Collez ou Importez un texte</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Copiez-collez le texte des conclusions adverses ou d'un contrat pour détecter failles et délais.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <Textarea
                                placeholder="Collez le texte juridique ici..."
                                className="min-h-[150px] resize-none font-mono text-sm"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base font-medium"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !content.trim()}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse en cours par LexAI...
                                    </>
                                ) : (
                                    <>
                                        <ScanSearch className="mr-2 h-4 w-4" /> Lancer l'Analyse
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <div className="border-b px-4">
                                <TabsList className="bg-transparent w-full justify-start h-12 p-0 space-x-6">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 pt-2">
                                        Vue d'ensemble
                                    </TabsTrigger>
                                    <TabsTrigger value="dates" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 pt-2">
                                        Dates & Délais
                                    </TabsTrigger>
                                    <TabsTrigger value="args" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 pt-2">
                                        Arguments & Failles
                                    </TabsTrigger>
                                    <TabsTrigger value="draft" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 pt-2">
                                        Projet (Bêta)
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-6">
                                    <TabsContent value="overview" className="mt-0 space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-900">
                                                <FileText className="h-4 w-4 text-indigo-500" /> Synthèse du Document
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed">
                                                {analysis.summary}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2 font-semibold text-slate-900">
                                                <Scale className="h-4 w-4 text-amber-500" /> Textes Cités
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.laws.map((law: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">
                                                        {law}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="dates" className="mt-0">
                                        <div className="space-y-4">
                                            {analysis.dates.map((d: any, i: number) => (
                                                <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${d.type === 'CRITICAL' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                                                    <div className={`p-2 rounded-full ${d.type === 'CRITICAL' ? 'bg-red-100' : 'bg-amber-100'}`}>
                                                        <Calendar className={`h-5 w-5 ${d.type === 'CRITICAL' ? 'text-red-600' : 'text-amber-600'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${d.type === 'CRITICAL' ? 'text-red-700' : 'text-amber-700'}`}>
                                                            {d.date}
                                                        </p>
                                                        <p className="font-medium text-slate-900">{d.label}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Ajouter à l'agenda</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="args" className="mt-0 space-y-4">
                                        {analysis.arguments.map((arg: any, i: number) => (
                                            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center">
                                                    <span className="font-semibold text-slate-800">{arg.point}</span>
                                                    <Badge className={arg.strength === 'HAUTE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                                        Force: {arg.strength}
                                                    </Badge>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <div className="flex items-start gap-3">
                                                        <Lightbulb className="h-5 w-5 text-emerald-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Piste de Contre-Attaque</p>
                                                            <p className="text-sm text-slate-600">{arg.counter}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="draft" className="mt-0 h-full">
                                        {isDrafting ? (
                                            <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
                                                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                                                <div className="text-center">
                                                    <h3 className="text-lg font-medium text-slate-900">Rédaction en cours...</h3>
                                                    <p className="text-slate-500">LexAI rédige les conclusions à partir des points analysés.</p>
                                                </div>
                                            </div>
                                        ) : draftContent ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-indigo-600" /> Projet de Réplique
                                                    </h4>
                                                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(draftContent)}>
                                                        Copier
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    className="font-mono text-sm min-h-[400px] leading-relaxed"
                                                    value={draftContent}
                                                    readOnly
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                                                <div className="bg-indigo-50 p-4 rounded-full">
                                                    <PenTool className="h-8 w-8 text-indigo-600" />
                                                </div>
                                                <div className="max-w-xs">
                                                    <h3 className="font-medium text-slate-900">Générer un premier jet</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Laissez l'IA rédiger une ébauche de conclusions basée sur l'analyse des failles adverses.</p>
                                                </div>
                                                <Button onClick={handleGenerateDraft} className="bg-indigo-600 hover:bg-indigo-700">
                                                    <Sparkles className="mr-2 h-4 w-4" /> Générer Réplique
                                                </Button>
                                            </div>
                                        )}
                                    </TabsContent>
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
                                <Button variant="ghost" className="text-slate-500" onClick={() => setAnalysis(null)}>
                                    Nouvelle analyse
                                </Button>
                                <div className="flex gap-2">
                                    {(activeTab !== 'draft' && !draftContent) && (
                                        <Button variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" onClick={handleGenerateDraft}>
                                            <PenTool className="mr-2 h-4 w-4" /> Générer Réplique
                                        </Button>
                                    )}
                                    <Button variant="outline" className="gap-2">
                                        <FileText className="h-4 w-4" /> Exporter Rapport
                                    </Button>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
