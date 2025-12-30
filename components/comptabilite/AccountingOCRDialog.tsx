
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScanLine, FileText, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react'
import { createTransaction, getAccounts, getJournals } from '@/app/actions'
import { toast } from '@/components/ui/use-toast'

export function AccountingOCRDialog() {
    const [isPromptOpen, setIsPromptOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scannedData, setScannedData] = useState<any>(null)
    const [accounts, setAccounts] = useState<any[]>([])
    const [journals, setJournals] = useState<any[]>([])

    const startScan = async () => {
        setIsScanning(true)
        // Simulation d'OCR
        setTimeout(async () => {
            const accs = await getAccounts()
            const jnls = await getJournals()
            setAccounts(accs)
            setJournals(jnls)

            setScannedData({
                description: "Fournitures de bureau (Papiers/Stylos)",
                amountHT: 12500,
                amountTVA: 2250,
                amountTTC: 14750,
                date: new Date().toISOString().split('T')[0],
                vendor: "LIBRAIRIE DU PARC",
                suggestedDebit: "6061", // Fournitures
                suggestedCredit: "4011" // Fournisseurs
            })
            setIsScanning(false)
        }, 2500)
    }

    const handleSave = async () => {
        const debitAcc = accounts.find(a => a.code.startsWith(scannedData.suggestedDebit))
        const creditAcc = accounts.find(a => a.code.startsWith(scannedData.suggestedCredit))
        const purchaseJournal = journals.find(j => j.code === 'AC')

        if (!debitAcc || !creditAcc || !purchaseJournal) {
            toast({ title: "Erreur", description: "Comptes ou Journal d'achats introuvables.", variant: "destructive" })
            return
        }

        const lines = [
            { accountId: debitAcc.id, debit: scannedData.amountHT, credit: 0 },
            { accountId: creditAcc.id, debit: 0, credit: scannedData.amountTTC }
        ]

        // On peut ajouter la ligne de TVA si elle existe
        const tvaAcc = accounts.find(a => a.code === '4451')
        if (tvaAcc && scannedData.amountTVA > 0) {
            lines.push({ accountId: tvaAcc.id, debit: scannedData.amountTVA, credit: 0 })
        }

        const res = await createTransaction(
            `ACHAT: ${scannedData.vendor} - ${scannedData.description}`,
            new Date(scannedData.date),
            lines,
            purchaseJournal.id,
            'VALIDATED'
        )

        if (res.success) {
            toast({ title: "Succès", description: "Facture d'achat enregistrée en comptabilité." })
            setIsPromptOpen(false)
            setScannedData(null)
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
    }

    return (
        <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all border-none">
                    <ScanLine className="mr-2 h-4 w-4" /> Saisie OCR (IA)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-indigo-500" /> Numérisation Comptable IA
                    </DialogTitle>
                    <DialogDescription>
                        Téléchargez une facture (JPG/PDF) pour en extraire l'écriture comptable automatiquement.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {!scannedData && !isScanning && (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50">
                            <input type="file" className="hidden" id="ocr-upload" onChange={startScan} />
                            <label htmlFor="ocr-upload" className="cursor-pointer space-y-4 block">
                                <div className="bg-indigo-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-bold">Cliquez pour ajouter une pièce justificative</p>
                                    <p className="text-xs text-slate-500">Format PDF, PNG, JPG (Max 5MB)</p>
                                </div>
                            </label>
                        </div>
                    )}

                    {isScanning && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                            <p className="text-sm font-medium animate-pulse text-indigo-800">L'IA analyse le document et extrait les montants...</p>
                        </div>
                    )}

                    {scannedData && (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="border-slate-200 bg-slate-50/50">
                                    <CardHeader className="py-2 px-4 border-b">
                                        <CardTitle className="text-xs font-bold uppercase text-slate-500">Données Extraites</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between text-xs"><span>Fournisseur:</span> <span className="font-bold">{scannedData.vendor}</span></div>
                                        <div className="flex justify-between text-xs"><span>Date:</span> <span className="font-bold">{scannedData.date}</span></div>
                                        <div className="flex justify-between text-xs"><span>Objet:</span> <span className="font-bold italic">{scannedData.description}</span></div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between text-xs"><span>Total HT:</span> <span className="font-bold font-mono text-slate-700">{scannedData.amountHT} XOF</span></div>
                                            <div className="flex justify-between text-xs"><span>TVA (18%):</span> <span className="font-bold font-mono text-slate-700">{scannedData.amountTVA} XOF</span></div>
                                            <div className="flex justify-between text-sm mt-1"><span>Total TTC:</span> <span className="font-bold font-mono text-indigo-600">{scannedData.amountTTC} XOF</span></div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-indigo-200 bg-indigo-50/30">
                                    <CardHeader className="py-2 px-4 border-b border-indigo-100">
                                        <CardTitle className="text-xs font-bold uppercase text-indigo-600">Affectation Comptable Suggestion</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="grid gap-1">
                                            <Label className="text-[10px]">Compte de Charge (Débit)</Label>
                                            <div className="flex items-center text-xs font-bold text-slate-900 bg-white p-2 rounded border border-indigo-100">
                                                <Check className="mr-2 h-3 w-3 text-emerald-500" /> {scannedData.suggestedDebit} - Frais Généraux
                                            </div>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-[10px]">Compte Tiers (Crédit)</Label>
                                            <div className="flex items-center text-xs font-bold text-slate-900 bg-white p-2 rounded border border-indigo-100">
                                                <Check className="mr-2 h-3 w-3 text-emerald-500" /> {scannedData.suggestedCredit} - Fournisseur Librairie
                                            </div>
                                        </div>
                                        <div className="bg-indigo-600 rounded p-2 text-white flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="text-[10px] leading-tight font-medium">L'IA a identifié ce fournisseur comme régulier.</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => { setScannedData(null); setIsPromptOpen(false); }}>Annuler</Button>
                    <Button
                        onClick={handleSave}
                        disabled={!scannedData}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                        Valider et Enregistrer l'écriture
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
