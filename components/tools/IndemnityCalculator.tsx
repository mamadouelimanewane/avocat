"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function IndemnityCalculator() {
    const [type, setType] = useState("licenciement")
    const [anciennete, setAnciennete] = useState(0)
    const [salaire, setSalaire] = useState(0)
    const [result, setResult] = useState<any>(null)

    const calculateLicenciement = () => {
        // Code du Travail Sénégalais : Indemnité de licenciement
        let taux = 0
        if (anciennete < 1) taux = 0
        else if (anciennete <= 5) taux = 0.25 // 25% par an
        else if (anciennete <= 10) taux = 0.30 // 30% par an
        else taux = 0.40 // 40% par an

        const indemnite = salaire * anciennete * taux
        const preavis = anciennete < 1 ? 0 : anciennete < 5 ? salaire : salaire * 2 // Simplification

        return {
            indemnite,
            preavis,
            total: indemnite + preavis,
            base: `Salaire: ${salaire.toLocaleString()} FCFA × ${anciennete} ans × ${taux * 100}%`
        }
    }

    const calculateRetraite = () => {
        // Indemnité de départ à la retraite
        const taux = anciennete < 5 ? 0 : anciennete / 12 // Minimum 5 ans
        const indemnite = salaire * taux

        return {
            indemnite,
            preavis: 0,
            total: indemnite,
            base: `Salaire: ${salaire.toLocaleString()} FCFA × (${anciennete}/12)`
        }
    }

    const calculatePrejudice = () => {
        // Dommages et intérêts (estimation indicative)
        const moral = salaire * 3 // 3 mois de préjudice moral (fourchette basse)
        const materiel = salaire * 6 // 6 mois de perte de revenus

        return {
            indemnite: moral,
            preavis: materiel,
            total: moral + materiel,
            base: "Estimation: Moral (3 mois) + Matériel (6 mois)"
        }
    }

    const handleCalculate = () => {
        if (!salaire || !anciennete) return

        let calculation
        switch (type) {
            case "licenciement":
                calculation = calculateLicenciement()
                break
            case "retraite":
                calculation = calculateRetraite()
                break
            case "prejudice":
                calculation = calculatePrejudice()
                break
            default:
                return
        }

        setResult(calculation)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-indigo-100">
                <CardHeader className="bg-indigo-50/50">
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-indigo-600" />
                        Calculateur d'Indemnités
                    </CardTitle>
                    <CardDescription>
                        Estimations basées sur le Code du Travail Sénégalais
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid gap-2">
                        <Label>Type d'Indemnité</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="licenciement">Licenciement (Art. 68 CT)</SelectItem>
                                <SelectItem value="retraite">Départ à la Retraite</SelectItem>
                                <SelectItem value="prejudice">Dommages & Intérêts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Salaire Mensuel Brut (FCFA)</Label>
                        <Input
                            type="number"
                            value={salaire || ''}
                            onChange={(e) => setSalaire(parseFloat(e.target.value) || 0)}
                            placeholder="Ex: 500000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Ancienneté (Années)</Label>
                        <Input
                            type="number"
                            step="0.5"
                            value={anciennete || ''}
                            onChange={(e) => setAnciennete(parseFloat(e.target.value) || 0)}
                            placeholder="Ex: 5"
                        />
                    </div>

                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleCalculate}
                        disabled={!salaire || !anciennete}
                    >
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculer
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {result ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <Card className="border-emerald-100 bg-emerald-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-emerald-800 text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Résultat du Calcul
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white rounded-md border border-emerald-100">
                                    <span className="text-sm text-slate-600">Indemnité Principale</span>
                                    <span className="text-lg font-bold text-emerald-700">
                                        {result.indemnite.toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-white rounded-md border border-emerald-100">
                                    <span className="text-sm text-slate-600">
                                        {type === "prejudice" ? "Préjudice Matériel" : "Indemnité de Préavis"}
                                    </span>
                                    <span className="text-lg font-bold text-slate-700">
                                        {result.preavis.toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-emerald-600 text-white rounded-md shadow-md">
                                    <span className="font-semibold">TOTAL ESTIMÉ</span>
                                    <span className="text-2xl font-bold">
                                        {result.total.toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>

                                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
                                    <AlertCircle className="h-3 w-3 inline mr-1" />
                                    Base de calcul : {result.base}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm">Notes Juridiques</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-slate-600 space-y-2">
                                {type === "licenciement" && (
                                    <>
                                        <p>• Code du Travail Sénégalais, Article 68 : Indemnité de licenciement</p>
                                        <p>• Taux progressif selon ancienneté (25%, 30%, 40%)</p>
                                        <p>• Préavis variable selon ancienneté et catégorie professionnelle</p>
                                    </>
                                )}
                                {type === "retraite" && (
                                    <>
                                        <p>• Indemnité minimale après 5 ans d'ancienneté</p>
                                        <p>• Calcul: 1/12e du salaire par année</p>
                                        <p>• Non cumulable avec l'indemnité de licenciement</p>
                                    </>
                                )}
                                {type === "prejudice" && (
                                    <>
                                        <p>• Estimation indicative (jurisprudence variable)</p>
                                        <p>• Préjudice moral: 3-6 mois de salaire en moyenne</p>
                                        <p>• Préjudice matériel: perte de revenus prouvée</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="h-full flex items-center justify-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                        <CardContent className="text-center p-12">
                            <Calculator className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-sm">
                                Configurez les paramètres pour voir le calcul détaillé
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
