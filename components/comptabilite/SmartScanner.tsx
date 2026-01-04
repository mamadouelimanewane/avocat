"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScanLine, UploadCloud, FileText, CheckCircle2, Sparkles, ArrowRight, Calculator, FileCheck } from "lucide-react"

export function SmartScanner() {
    const [step, setStep] = useState<'UPLOAD' | 'SCANNING' | 'REVIEW' | 'SUCCESS'>('UPLOAD')
    const [progress, setProgress] = useState(0)

    // Mock Result
    const extractedData = {
        vendor: "SENELEC (Agence Dakar-Plateau)",
        invoiceId: "FAC-2024-00982X",
        date: "12/05/2026",
        items: [
            { desc: "Consommation Électrique (Période Avril)", amount: 145000 },
            { desc: "Redevance Fixe", amount: 5000 },
            { desc: "Taxe Communale", amount: 2500 }
        ],
        totalHT: 152500,
        tva: 27450,
        totalTTC: 179950,
        mappings: {
            debit: { code: "6052", name: "Électricité", conf: 99 },
            credit: { code: "4011", name: "Fournisseurs", conf: 98 },
            tva: { code: "4451", name: "TVA Récupérable", conf: 100 }
        }
    }

    const startScan = () => {
        setStep('SCANNING')
        let p = 0
        const interval = setInterval(() => {
            p += 2
            setProgress(p)
            if (p >= 100) {
                clearInterval(interval)
                setStep('REVIEW')
            }
        }, 50)
    }

    const confirmEntry = () => {
        setStep('SUCCESS')
    }

    const reset = () => {
        setStep('UPLOAD')
        setProgress(0)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: The "Physical" Document */}
            <div className="relative group">
                <Card className={`h-[500px] border-2 border-dashed flex items-center justify-center transition-all duration-500 overflow-hidden relative ${step === 'UPLOAD' ? 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100' :
                        'border-indigo-500 bg-slate-900 shadow-2xl'
                    }`}>

                    {step === 'UPLOAD' && (
                        <div className="text-center cursor-pointer" onClick={startScan}>
                            <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <UploadCloud className="h-10 w-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Glisser la Facture ici</h3>
                            <p className="text-slate-500 mt-2">ou cliquez pour parcourir (PDF, JPG, PNG)</p>
                            <Badge className="mt-6 bg-slate-200 text-slate-700 hover:bg-slate-300">
                                Snap-to-SYSCOHADA™ Ready
                            </Badge>
                        </div>
                    )}

                    {(step === 'SCANNING' || step === 'REVIEW' || step === 'SUCCESS') && (
                        <>
                            {/* Simulated Document Preview */}
                            <div className="absolute inset-4 bg-white rounded shadow-lg opacity-90 p-8 text-xs font-mono text-slate-400 select-none">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="font-bold text-lg text-slate-800">SENELEC</div>
                                    <div>FACT-2024-0000</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-100 w-1/3 rounded" />
                                    <div className="h-4 bg-slate-100 w-1/4 rounded" />
                                    <div className="h-32 bg-slate-50 rounded border border-slate-100 p-2" />
                                    <div className="flex justify-end">
                                        <div className="h-8 bg-slate-200 w-1/4 rounded" />
                                    </div>
                                </div>
                            </div>

                            {/* Scanning Laser Effect */}
                            {step === 'SCANNING' && (
                                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-20 animate-[scan_2s_ease-in-out_infinite]" />
                            )}

                            {/* Overlay during Review */}
                            {step === 'REVIEW' && (
                                <div className="absolute inset-0 bg-indigo-900/40 z-10 flex items-center justify-center">
                                    <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                        <span className="font-bold text-slate-800">Extraction Terminée</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>

            {/* Right: The AI Analysis & Control */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Snap-to-SYSCOHADA™</h2>
                        <p className="text-sm text-slate-500">Moteur OCR & Imputation Comptable Automatique.</p>
                    </div>
                </div>

                {step === 'SCANNING' && (
                    <div className="space-y-2 py-10">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                            <span>Analyse Structurelle</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" indicatorClassName="bg-indigo-600" />
                        <div className="text-center text-sm text-indigo-600 font-mono mt-4 animate-pulse">
                            Identification Tiers... Calcul TVA... Recherche Compte 6...
                        </div>
                    </div>
                )}

                {(step === 'REVIEW' || step === 'SUCCESS') && (
                    <Card className="border-indigo-100 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                            <CardTitle className="text-sm font-bold uppercase text-slate-500 flex justify-between items-center">
                                <span>Données Extraites</span>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Confiance IA: 99%</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Extracted Data List */}
                            <div className="p-4 space-y-4 font-mono text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-slate-500">Fournisseur</span>
                                    <span className="font-bold text-slate-900">{extractedData.vendor}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-slate-500">Total HT</span>
                                    <span className="font-bold text-slate-900">{extractedData.totalHT.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-slate-500">TVA (18%)</span>
                                    <span className="font-bold text-slate-900">{extractedData.tva.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center py-2 bg-indigo-50 p-2 rounded">
                                    <span className="text-indigo-700 font-bold">TOTAL TTC</span>
                                    <span className="font-bold text-indigo-700 text-lg">{extractedData.totalTTC.toLocaleString()} FCFA</span>
                                </div>
                            </div>

                            {/* Accounting Mapping Proposal */}
                            <div className="bg-slate-900 text-white p-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-3 flex items-center gap-2">
                                    <Calculator className="h-3 w-3" />
                                    Imputation Automatique (SYSCOHADA)
                                </p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-indigo-400 border-indigo-500/50 w-12 justify-center">Débit</Badge>
                                        <div className="flex-1 flex justify-between">
                                            <span>{extractedData.mappings.debit.code} - {extractedData.mappings.debit.name}</span>
                                            <span className="text-emerald-400">{extractedData.totalHT.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-indigo-400 border-indigo-500/50 w-12 justify-center">Débit</Badge>
                                        <div className="flex-1 flex justify-between">
                                            <span>{extractedData.mappings.tva.code} - {extractedData.mappings.tva.name}</span>
                                            <span className="text-emerald-400">{extractedData.tva.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-rose-400 border-rose-500/50 w-12 justify-center">Crédit</Badge>
                                        <div className="flex-1 flex justify-between">
                                            <span>{extractedData.mappings.credit.code} - {extractedData.mappings.credit.name}</span>
                                            <span className="text-rose-400">{extractedData.totalTTC.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                {step === 'REVIEW' ? (
                                    <>
                                        <Button variant="outline" className="flex-1" onClick={reset}>Rejeter</Button>
                                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={confirmEntry}>
                                            <FileCheck className="mr-2 h-4 w-4" /> Valider l'Écriture
                                        </Button>
                                    </>
                                ) : (
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={reset}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Écriture Comptabilisée ! (Scanner Suivant)
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
