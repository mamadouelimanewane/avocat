
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, ArrowRight, Check, Loader2 } from "lucide-react"
import { classifyTransaction } from "@/app/actions"
import { Card } from "@/components/ui/card"

interface AccountingAssistantDialogProps {
    onApply?: (data: any) => void
}

export function AccountingAssistantDialog({ onApply }: AccountingAssistantDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = async () => {
        if (!description) return
        setIsLoading(true)
        const response = await classifyTransaction(description)
        setIsLoading(false)
        if (response.success) {
            setResult(response.classification)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 gap-2">
                    <Sparkles className="h-4 w-4" /> Assistant Classification
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        Assistant Comptable IA
                    </DialogTitle>
                    <DialogDescription>
                        Décrivez l'opération (ex: "Achat de fournitures par chèque"), l'IA vous indiquera les comptes SYSCOHADA à utiliser.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Description de l'opération</Label>
                        <Textarea
                            placeholder="Ex: Paiement facture SENELEC mois de Mars par virement bancaire..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {result && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                                <span>Proposition d'écriture</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">SYSCOHADA</span>
                            </div>

                            <Card className="p-3 bg-slate-50 border-slate-200 grid gap-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-slate-500">Compte Débit (Emploi)</Label>
                                        <div className="font-mono font-bold text-indigo-700 text-sm">{result.debitAccount}</div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Compte Crédit (Ressource)</Label>
                                        <div className="font-mono font-bold text-emerald-700 text-sm">{result.creditAccount}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 italic border-t pt-2 mt-1">
                                    "{result.explanation}"
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!result ? (
                        <Button onClick={handleAnalyze} disabled={isLoading || !description} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Analyser
                        </Button>
                    ) : (
                        <div className="flex gap-2 w-full justify-end">
                            <Button onClick={() => { setDescription(""); setResult(null); }} variant="secondary">
                                Nouvelle recherche
                            </Button>
                            {onApply && (
                                <Button
                                    onClick={() => {
                                        onApply({
                                            debitAccount: result.debitAccount,
                                            creditAccount: result.creditAccount,
                                            explanation: result.explanation,
                                            description: description // Pass the user's description as the label
                                        })
                                        setIsOpen(false)
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Utiliser cette écriture
                                </Button>
                            )}
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
