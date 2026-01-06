"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Download, Receipt, Landmark, User, FileText, Info, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { createDocumentFromTemplate } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

export function LandTaxCalculator() {
    const [price, setPrice] = useState<number>(0)
    const [propertyType, setPropertyType] = useState<string>("TERRAIN")
    const [location, setLocation] = useState<string>("DAKAR")
    const [purchasePrice, setPurchasePrice] = useState<number>(0)
    const [yearsOwned, setYearsOwned] = useState<number>(0)
    const [isReducedRate, setIsReducedRate] = useState<boolean>(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()

    const handleGenerateCompromis = async () => {
        setIsGenerating(true)
        try {
            const variables = {
                VENDEUR: "M. Abdoulaye SARR",
                ACHETEUR: "Mme Bineta DIOP",
                PRIX_VENTE: `${price.toLocaleString('fr-FR')} FCFA`,
                DESCRIPTION_BIEN: `${propertyType} situé à ${location}`,
                TF_NUMERO: "TF 1234/DG",
                ZONE: location
            }

            const result = await createDocumentFromTemplate(
                "677c7774e54823467f555555", // Simulated Dossier
                "tpl_foncier_001", // Simulated Template (Compromis)
                variables
            )

            if (result.success) {
                toast({
                    title: "Compromis généré !",
                    description: "Le projet d'acte de vente a été créé."
                })
            }
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Échec de la génération."
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // Simulation de calculs fiscaux Sénégalais
    const registrationRightsRate = isReducedRate ? 0.03 : 0.05 // 3% si habitat social/primo-accédant agréé, sinon 5%
    const conservationRate = 0.01 // 1%

    // Barème Notaire (Simplifié pour la démo)
    const getNotaryFees = (p: number) => {
        if (p <= 10000000) return p * 0.03
        if (p <= 50000000) return 300000 + (p - 10000000) * 0.015
        return 900000 + (p - 50000000) * 0.01
    }

    // Plus-value Immobilière (Simplifié)
    // Au Sénégal, la taxe sur la plus-value peut être complexe (exonérations selon durée)
    const capitalGain = Math.max(0, price - purchasePrice)
    const isExempt = yearsOwned >= 10 // Exonération après 10 ans (exemple simplifié)
    const capitalGainTax = isExempt ? 0 : capitalGain * 0.15 // 15% flat pour la démo

    const registrationRights = price * registrationRightsRate
    const conservationFees = price * conservationRate
    const notaryFees = getNotaryFees(price)
    const vatOnNotary = notaryFees * 0.18 // TVA 18%
    const totalFees = registrationRights + conservationFees + notaryFees + vatOnNotary
    const totalWithTaxes = price + totalFees

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-indigo-600" />
                        Paramètres de la Transaction
                    </CardTitle>
                    <CardDescription>Saisissez les détails financiers de l'acte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Valeur de vente (FCFA)</Label>
                        <Input
                            type="number"
                            placeholder="Ex: 25000000"
                            value={price || ''}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="text-lg font-semibold text-indigo-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Type de bien</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TERRAIN">Terrain Nu</SelectItem>
                                <SelectItem value="BATIMENT">Bâtiment / Villa</SelectItem>
                                <SelectItem value="APPARTEMENT">Appartement (Titre Foncier)</SelectItem>
                                <SelectItem value="BAIL">Cession de Bail</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between space-y-0 pb-2 border-b border-slate-100">
                        <Label htmlFor="reduced-rate" className="flex flex-col space-y-1 cursor-pointer">
                            <span>Taux Réduit (3%)</span>
                            <span className="font-normal text-[10px] text-slate-500">Primo-accédant / Programme agréé</span>
                        </Label>
                        <Switch id="reduced-rate" checked={isReducedRate} onCheckedChange={setIsReducedRate} />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <Label className="text-slate-500 text-xs uppercase flex items-center gap-1">
                            Calcul Plus-Value <Badge variant="outline" className="text-[9px]">Optionnel</Badge>
                        </Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Prix d'acquisition</Label>
                                <Input type="number" size={1} value={purchasePrice || ''} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Années de détention</Label>
                                <Input type="number" size={1} value={yearsOwned || ''} onChange={(e) => setYearsOwned(Number(e.target.value))} className="h-8 text-xs" />
                            </div>
                        </div>
                    </div>

                    <Button className="w-full mt-4 bg-slate-900 text-white" variant="default">
                        Refaire le calcul
                    </Button>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-indigo-600 text-white shadow-lg border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Landmark className="h-40 w-40" />
                    </div>
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Total à prévoir par l'Acquéreur</p>
                                <h3 className="text-4xl font-bold">{totalWithTaxes.toLocaleString()} <span className="text-lg font-normal">FCFA</span></h3>
                            </div>
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">Simulation Pro</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-10">
                            <div>
                                <p className="text-indigo-200 text-xs mb-1">Montant Principal</p>
                                <p className="text-2xl font-semibold">{price.toLocaleString()} FCFA</p>
                            </div>
                            <div>
                                <p className="text-indigo-200 text-xs mb-1">Total Frais & Taxes</p>
                                <p className="text-2xl font-semibold">{totalFees.toLocaleString()} FCFA</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-emerald-600" />
                                Taxes de l'État (DGID)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Droits d'enregistrement ({isReducedRate ? '3%' : '5%'})</span>
                                <span className="font-semibold text-slate-800">{registrationRights.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Conservation Foncière (1%)</span>
                                <span className="font-semibold text-slate-800">{conservationFees.toLocaleString()}</span>
                            </div>
                            {capitalGainTax > 0 ? (
                                <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                                    <span className="text-red-600 flex items-center gap-1"><Info className="h-3 w-3" /> Plus-value (Vendeur)</span>
                                    <span className="font-bold text-red-600">{capitalGainTax.toLocaleString()}</span>
                                </div>
                            ) : yearsOwned > 0 && (
                                <div className="text-[10px] text-emerald-600 italic">Exonération de plus-value appliquée</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <User className="h-4 w-4 text-amber-600" />
                                Honoraires Notaire
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Émoluments HT</span>
                                <span className="font-semibold text-slate-800">{notaryFees.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">TVA sur honoraires (18%)</span>
                                <span className="font-semibold text-slate-800">{vatOnNotary.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-sm text-slate-400 italic">
                                <span>Note: Débours fixes non inclus</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Conseil LexAI</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Conformément à la Loi de Finances, les droits d'enregistrement au Sénégal peuvent être réduits à 3% dans certains cas de première acquisition ou de promotion immobilière agréée. Ce simulateur utilise le taux de droit commun.
                        </p>
                        <div className="mt-3 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-[10px] border-indigo-200 text-indigo-700 font-bold"
                                onClick={handleGenerateCompromis}
                                disabled={isGenerating}
                            >
                                {isGenerating ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <FileText className="h-3 w-3 mr-1" />}
                                {isGenerating ? "Traitement..." : "Générer Compromis"}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] text-slate-500">Voir barème officiel</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
