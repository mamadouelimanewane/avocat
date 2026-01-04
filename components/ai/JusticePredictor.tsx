"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Scale, TrendingUp, AlertTriangle, CheckCircle2, Gavel } from "lucide-react"

import { getJusticePrediction } from "@/app/actions"

// ... imports ...

export function JusticePredictor({ initialDescription = "" }: { initialDescription?: string }) {
    const [caseDescription, setCaseDescription] = useState(initialDescription || "Litige commercial : Recouvrement de créances impayées (Facture N° 2024-056) d'un montant de 15.000.000 FCFA contre la société 'Bâtisseurs du Sahel'. Le débiteur conteste la qualité du ciment livré, mais a signé le bon de livraison sans réserve. Mise en demeure infructueuse envoyée le 10/11/2024.")
    const [jurisdiction, setJurisdiction] = useState("dakar_commerce")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handlePredict = async () => {
        if (!caseDescription || !jurisdiction) return
        setIsAnalyzing(true)
        setResult(null)

        try {
            const response = await getJusticePrediction(caseDescription, jurisdiction)

            if (response.success && response.data) {
                setResult(response.data)
            } else {
                // If specific error message
                console.error("Prediction Error:", response.message)
                alert("Erreur lors de l'analyse : " + (response.message || "Vérifiez votre connexion."))
            }
        } catch (e) {
            console.error("UI Prediction Error", e)
            alert("Une erreur est survenue.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 space-y-4">
                <Card className="h-full border-indigo-100">
                    <CardHeader className="bg-indigo-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-indigo-600" />
                            Paramètres du Dossier
                        </CardTitle>
                        <CardDescription>Définissez les contours de l'affaire pour l'IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Juridiction Compétente</label>
                            <Select onValueChange={setJurisdiction}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dakar_commerce">Tribunal de Commerce (Dakar)</SelectItem>
                                    <SelectItem value="dakar_travail">Tribunal du Travail (Dakar)</SelectItem>
                                    <SelectItem value="ccja">CCJA (Abidjan)</SelectItem>
                                    <SelectItem value="cour_supreme">Cour Suprême</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Résumé des Faits</label>
                            <Textarea
                                placeholder="Décrivez le litige (montant, parties, fondement juridique, preuves...)"
                                className="min-h-[200px]"
                                value={caseDescription}
                                onChange={(e) => setCaseDescription(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={isAnalyzing || !caseDescription || !jurisdiction}
                            onClick={handlePredict}
                        >
                            {isAnalyzing ? "Calcul des probabilités..." : "Lancer la Prédiction"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                {result ? (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        {/* Score Card */}
                        <Card className="border-emerald-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90">Probabilité de Succès Estimée</h3>
                                    <div className="text-5xl font-bold mt-1">{result.successProbability}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-75">Niveau de Risque</div>
                                    <Badge variant="secondary" className="mt-1 bg-white/20 hover:bg-white/30 text-white border-0">
                                        {result.riskLevel}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6 grid grid-cols-2 gap-6 bg-emerald-50/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Scale className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Jurisprudence Similaire</p>
                                        <p className="font-bold text-slate-900">{result.similarCases} arrêts analysés</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <ClockIcon className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Durée Moyenne Procédure</p>
                                        <p className="font-bold text-slate-900">{result.avgDuration}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Pros */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Facteurs Gagnants
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {result.winningFactors.map((f: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-1">•</span>{f}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Cons */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-rose-700">
                                        <AlertTriangle className="h-5 w-5" />
                                        Points de Vigilance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {result.riskFactors.map((f: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-rose-500 mt-1">•</span>{f}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Strategy */}
                        <Card className="bg-slate-900 text-white border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-400">
                                    <TrendingUp className="h-5 w-5" />
                                    Recommandation Stratégique IA
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300 leading-relaxed">
                                    {result.recommendedStrategy}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        {isAnalyzing ? (
                            <div className="text-center space-y-4">
                                <BrainCircuit className="h-16 w-16 mx-auto animate-pulse text-indigo-400" />
                                <div className="space-y-2">
                                    <p className="font-medium text-slate-700">Analyse Jurimétrique en cours...</p>
                                    <Progress value={45} className="w-[200px] mx-auto h-2" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Gavel className="h-16 w-16 mb-4 opacity-20" />
                                <p>Remplissez les paramètres pour obtenir une prédiction.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
