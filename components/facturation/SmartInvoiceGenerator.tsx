
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wand2, FileText, CheckCircle, Zap } from "lucide-react"
import { generateInvoiceItems } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"

export function SmartInvoiceGenerator({ onInvoiceGenerated }: { onInvoiceGenerated?: (items: any[]) => void }) {
    const [description, setDescription] = useState("")
    const [generating, setGenerating] = useState(false)
    const [generatedItems, setGeneratedItems] = useState<any[]>([])

    const handleGenerate = async () => {
        if (!description) return
        setGenerating(true)
        try {
            const result = await generateInvoiceItems(description)
            if (result.success && result.items) {
                setGeneratedItems(result.items)
                toast({
                    title: "Facture intelligente générée",
                    description: "Les lignes de facturation ont été créées par l'IA.",
                })
                if (onInvoiceGenerated) onInvoiceGenerated(result.items)
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de générer la facture.",
                variant: "destructive"
            })
        } finally {
            setGenerating(false)
        }
    }

    return (
        <Card className="border-indigo-100 bg-indigo-50/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <Wand2 className="h-5 w-5 text-indigo-600" />
                    Générateur de Facture IA
                </CardTitle>
                <CardDescription>
                    Décrivez le travail effectué (ex: "Procédure de divorce complète avec 3 audiences et rédaction de conclusions"), l'IA générera les lignes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Décrivez les prestations..."
                    className="min-h-[100px] border-indigo-200 focus-visible:ring-indigo-500 bg-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={generating || !description}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 transition-all"
                    >
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        {generating ? "Analyse du travail..." : "Générer Facture Tactique"}
                    </Button>
                </div>

                {generatedItems.length > 0 && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-700">Proposition IA</h4>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Optimisé</Badge>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="p-3 font-medium">Description</th>
                                        <th className="p-3 font-medium text-right">Montant</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {generatedItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 text-slate-700">{item.description}</td>
                                            <td className="p-3 text-slate-900 font-bold text-right">{item.totalPrice.toLocaleString('fr-FR')} F</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-400 italic text-center">
                            Ces montants sont basés sur le barème standard du cabinet et la complexité estimée.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
