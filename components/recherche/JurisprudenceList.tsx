
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building, FileText, ExternalLink, Bot } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { generateAIResponse } from "@/app/actions"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export function JurisprudenceList({ results }: { results: any[] }) {
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [aiAnalysis, setAiAnalysis] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = async (item: any) => {
        setSelectedItem(item)
        setIsAnalyzing(true)
        setAiAnalysis("")

        try {
            const res = await generateAIResponse(`Peux-tu me résumer et expliquer la portée juridique de cet arrêt : ${item.title} (${item.reference}) - ${item.summary}`, 'RESEARCH')
            setAiAnalysis(res.text)
        } catch (e) {
            setAiAnalysis("Erreur lors de l'analyse IA.")
        }
        setIsAnalyzing(false)
    }

    if (results.length === 0) {
        return <div className="text-center py-12 text-slate-500">Aucun résultat trouvé.</div>
    }

    return (
        <div className="space-y-4">
            {results.map((item) => (
                <Card key={item.id} className="hover:border-slate-400 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 font-serif hover:underline decoration-emerald-500 underline-offset-4 cursor-pointer">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Badge variant="outline" className="bg-slate-50">{item.court}</Badge>
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {format(new Date(item.date), 'dd MMMM yyyy', { locale: fr })}</span>
                                    {item.reference && <span className="font-mono bg-slate-100 px-1 rounded">{item.reference}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => handleAnalyze(item)}>
                                            <Bot className="mr-2 h-4 w-4 text-emerald-600" /> Analyser (IA)
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[800px] sm:w-[540px]">
                                        <SheetHeader>
                                            <SheetTitle className="flex items-center">
                                                <Bot className="mr-2 h-5 w-5 text-emerald-600" /> Assistant Juridique AI
                                            </SheetTitle>
                                            <SheetDescription>
                                                Analyse générée automatiquement pour {selectedItem?.reference}
                                            </SheetDescription>
                                        </SheetHeader>
                                        <ScrollArea className="h-[85vh] mt-6 pr-4">
                                            {isAnalyzing ? (
                                                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                                    <p className="text-sm text-slate-500">Lecture de la jurisprudence en cours...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 text-sm leading-relaxed whitespace-pre-wrap font-serif text-slate-800">
                                                    {aiAnalysis}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        <p className="text-slate-700 mt-4 line-clamp-3">
                            {item.summary}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                            {item.keywords && JSON.parse(item.keywords).map((kw: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
