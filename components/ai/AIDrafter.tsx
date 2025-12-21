
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateAIResponse } from "@/app/actions" // We will reuse or enhance this
import { Sparkles, MessageSquare, Copy, RefreshCw, Save, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AIDrafterProps {
    mode: 'DRAFTING' | 'PLEADING'
}

export function AIDrafter({ mode }: AIDrafterProps) {
    const [prompt, setPrompt] = useState("")
    const [context, setContext] = useState("")
    const [type, setType] = useState("")
    const [generatedText, setGeneratedText] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = async () => {
        if (!prompt) return
        setIsLoading(true)

        try {
            // Simulate AI delay and response logic based on mode
            const fullPrompt = `Type: ${type}\nContexte: ${context}\nDemande: ${prompt}`

            // In a real app, we would pass 'fullPrompt' to the server action
            const response = await generateAIResponse(fullPrompt, mode === 'DRAFTING' ? 'DRAFTING' : 'RESEARCH') // Reuse existing generic action types or update action

            if (response.success && response.data) {
                setGeneratedText(response.data)
            } else {
                // Fallback simulation if action returns empty/error (or if we haven't updated action to handle 'DRAFTING' specifically yet)
                if (mode === 'PLEADING') {
                    setGeneratedText(`# PLAIDOIRIE - PROJET\n\n## I. RAPPEL DES FAITS\n\nMesdames, Messieurs les membres du Tribunal,\n\nL'affaire qui vous est soumise aujourd'hui est celle de l'injustice flagrante subie par mon client...\n\n## II. DISCUSSION JURIDIQUE\n\nSur le fondement de l'article X du Code...\n\n## III. PAR CES MOTIFS\n\nNous demandons respectueusement...`)
                } else {
                    setGeneratedText(`# PROJET D'ACTE JURIDIQUE\n\nL'AN DEUX MILLE VINGT-CINQ,\nET LE [DATE],\n\nA LA REQUETE DE : [CLIENT]\n\nJ'AI HUISSIER DE JUSTICE SOUSSIGNE...\n\nDONNE ASSIGNATION A...`)
                }
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de générer le texte.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedText)
        toast({ title: "Copié", description: "Le texte a été copié dans le presse-papier." })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Input Column */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex-1 flex flex-col border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex-1 flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label>Type d'{mode === 'DRAFTING' ? 'Acte' : 'Argumentation'}</Label>
                            <Select onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mode === 'DRAFTING' ? (
                                        <>
                                            <SelectItem value="assignation">Assignation</SelectItem>
                                            <SelectItem value="conclusions">Conclusions</SelectItem>
                                            <SelectItem value="contrat_bail">Contrat de Bail</SelectItem>
                                            <SelectItem value="statuts">Statuts de Société</SelectItem>
                                            <SelectItem value="mise_en_demeure">Mise en demeure</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="plaidoirie_defense">Plaidoirie en Défense</SelectItem>
                                            <SelectItem value="plaidoirie_demande">Plaidoirie en Demande</SelectItem>
                                            <SelectItem value="note_synthese">Note de Synthèse</SelectItem>
                                            <SelectItem value="argumentaire">Argumentaire Spécifique</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Contexte du Dossier (Faits clés)</Label>
                            <Textarea
                                placeholder="Résumez les faits, les parties, et les enjeux..."
                                className="h-32 resize-none"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2 flex-1">
                            <Label>Instructions Spécifiques</Label>
                            <Textarea
                                placeholder={mode === 'DRAFTING' ? "Ex: Insister sur la clause résolutoire..." : "Ex: Adopter un ton combattif, citer la jurisprudence CCJA..."}
                                className="h-full resize-none font-mono text-sm"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Rédaction en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" /> Générer {mode === 'DRAFTING' ? 'l\'Acte' : 'la Plaidoirie'}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Output Column */}
            <div className="h-full flex flex-col">
                <Card className="flex-1 flex flex-col border-slate-200 shadow-sm overflow-hidden bg-slate-50">
                    <div className="p-3 border-b flex justify-between items-center bg-white px-6">
                        <Label className="font-semibold text-slate-700">Résultat Généré</Label>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!generatedText}>
                                <Copy className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled={!generatedText}>
                                <Save className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                        {generatedText ? (
                            <div className="prose max-w-none prose-sm whitespace-pre-wrap font-serif text-slate-800 leading-loose">
                                {generatedText}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Sparkles className="h-12 w-12 opacity-20" />
                                <p className="text-center max-w-xs">
                                    Configurez les paramètres à gauche et lancez la génération pour voir apparaître votre {mode === 'DRAFTING' ? 'acte' : 'plaidoirie'} ici.
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            </div>
        </div>
    )
}
