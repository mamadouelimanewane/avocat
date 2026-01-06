"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, AlertTriangle, Download, FileText, Scale } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createDocumentFromTemplate } from "@/app/actions"
import {
    calculerMasseLiquidation,
    calculerMasseDeCalcul,
    calculerReserveHereditaire,
    calculerParts,
    calculerDroitsSuccession,
    valoriserDemembrement,
    verifierEtReduireLiberalites,
    type Heritier,
    type Donation,
    type Legs,
    type Patrimoine,
    type PartHeritier
} from "@/lib/succession"
import { PrismaClient } from "@prisma/client"

export function SuccessionCalculatorPro() {
    const { toast } = useToast()
    const [isGenerating, setIsGenerating] = useState(false)

    // Configuration
    const [regimeMatrimonial, setRegimeMatrimonial] = useState<'SEPARATION' | 'COMMUNAUTE' | 'PARTICIPATION'>('COMMUNAUTE')
    const [optionConjoint, setOptionConjoint] = useState<'USUFRUIT' | 'PLEINE_PROPRIETE'>('USUFRUIT')
    const [ageConjoint, setAgeConjoint] = useState(55)

    // Patrimoine
    const [patrimoine, setPatrimoine] = useState<Patrimoine>({
        actifs: 150000000,
        dettes: 30000000,
        biensPropres: 50000000,
        biensCommuns: 100000000
    })

    // Héritiers
    const [heritiers, setHeritiers] = useState<Heritier[]>([
        { id: '1', nom: 'Épouse Fatou', lien: 'CONJOINT', age: 55, sexe: 'F' },
        { id: '2', nom: 'Mamadou (Fils)', lien: 'ENFANT', age: 28, sexe: 'M' },
        { id: '3', nom: 'Aïssatou (Fille)', lien: 'ENFANT', age: 25, sexe: 'F' },
        { id: '4', nom: 'Aminata (Fille)', lien: 'ENFANT', age: 20, sexe: 'F' }
    ])

    // Donations
    const [donations, setDonations] = useState<Donation[]>([
        {
            id: 'd1',
            beneficiaire: 'Mamadou (Fils)',
            montant: 20000000,
            date: new Date('2020-01-15'),
            type: 'DONATION_NOTARIEE'
        }
    ])

    // Legs
    const [legs, setLegs] = useState<Legs[]>([
        {
            id: 'l1',
            beneficiaire: 'Aminata (Fille)',
            montant: 10000000,
            description: 'Villa Almadies',
            type: 'PARTICULIER'
        }
    ])

    const handleGenerateAct = async () => {
        setIsGenerating(true)
        try {
            // In a real app, we would fetch the template ID for "Convention de Partage Successoral"
            // For now, we simulate with a known category
            const variables = {
                DE_CUJUS: "Feu Amadou NDIAYE",
                DATE_DECES: "15 Janvier 2024",
                MASSE_SUCCESSORALE: `${masseLiquidation.toLocaleString('fr-FR')} FCFA`,
                HERITIERS: heritiers.map(h => h.nom).join(', '),
                RÉGIME: regimeMatrimonial
            }

            // Using a hardcoded ID for demo purposes or finding by name in a real action
            const result = await createDocumentFromTemplate(
                "677c7774e54823467f555555", // Simulated Dossier ID
                "ct_succession_001", // Simulated Template ID
                variables
            )

            if (result.success) {
                toast({
                    title: "Acte généré !",
                    description: "La convention de partage a été ajoutée au dossier."
                })
            }
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de lier l'acte au modèle."
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // ============ CALCULS ============

    // 1. Liquidation régime matrimonial
    const masseLiquidation = calculerMasseLiquidation(patrimoine, regimeMatrimonial)

    // 2. Masse de calcul (avec rapport donations)
    const masseDeCalcul = calculerMasseDeCalcul(masseLiquidation, donations)

    // 3. Réserve héréditaire
    const enfants = heritiers.filter(h => h.lien === 'ENFANT')
    const parents = heritiers.filter(h => h.lien === 'PERE' || h.lien === 'MERE')
    const { reserve, quotiteDisponible } = calculerReserveHereditaire(
        masseDeCalcul,
        enfants.length,
        parents.length > 0
    )

    // 4. Parts héréditaires
    const parts = calculerParts(heritiers, masseLiquidation, optionConjoint)

    // 5. Vérification libéralités excessives
    const { legsReduits, totalExces } = verifierEtReduireLiberalites(legs, donations, quotiteDisponible)

    // 6. Droits de succession
    const droitsParHeritier = parts.map(part => {
        const montantTotal = part.partEnPleineProprieteAbsolue + part.partEnUsufruit + part.partEnNuePropriete
        const { droits, taux, abattement } = calculerDroitsSuccession(montantTotal, part.heritier.lien)
        return { nom: part.heritier.nom, droits, taux, abattement, base: montantTotal }
    })

    const totalDroitsSuccession = droitsParHeritier.reduce((sum, d) => sum + d.droits, 0)

    // 7. Valorisation usufruit (si applicable)
    const conjoint = heritiers.find(h => h.lien === 'CONJOINT')
    let valeurUsufruit = 0
    let valeurNuePropriete = 0

    if (conjoint && optionConjoint === 'USUFRUIT') {
        const valorisation = valoriserDemembrement(masseLiquidation, conjoint.age || 60)
        valeurUsufruit = valorisation.valeurUsufruit
        valeurNuePropriete = valorisation.valeurNuePropriete
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Calculateur de Succession Professionnel</h1>
                    <p className="text-slate-500 mt-1">Méthodes conformes au Code de la Famille sénégalais</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Rapport Détaillé
                    </Button>
                    <Button className="bg-slate-900 gap-2">
                        <Download className="h-4 w-4" />
                        Générer Acte PDF
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="calculs" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                    <TabsTrigger value="calculs">📊 Calculs</TabsTrigger>
                    <TabsTrigger value="parts">⚖️ Partage</TabsTrigger>
                    <TabsTrigger value="fiscal">💰 Fiscalité</TabsTrigger>
                    <TabsTrigger value="liberalites">🎁 Libéralités</TabsTrigger>
                </TabsList>

                {/* ONGLET 1 : CALCULS */}
                <TabsContent value="calculs" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <CardContent className="p-6">
                                <p className="text-blue-100 text-sm mb-2">1. Masse de Liquidation</p>
                                <p className="text-3xl font-bold">{masseLiquidation.toLocaleString('fr-FR')} F</p>
                                <p className="text-xs text-blue-200 mt-2">
                                    {regimeMatrimonial === 'COMMUNAUTE' ? 'Après partage communauté' : 'Biens propres défunt'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <CardContent className="p-6">
                                <p className="text-purple-100 text-sm mb-2">2. Masse de Calcul</p>
                                <p className="text-3xl font-bold">{masseDeCalcul.toLocaleString('fr-FR')} F</p>
                                <p className="text-xs text-purple-200 mt-2">
                                    Avec rapport donations ({donations.length})
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <CardContent className="p-6">
                                <p className="text-emerald-100 text-sm mb-2">3. Réserve Héréditaire</p>
                                <p className="text-3xl font-bold">{reserve.toLocaleString('fr-FR')} F</p>
                                <p className="text-xs text-emerald-200 mt-2">
                                    {enfants.length} enfant(s) = {((reserve / masseDeCalcul) * 100).toFixed(0)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Détails des Calculs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Actifs Total</p>
                                    <p className="font-bold text-lg">{patrimoine.actifs.toLocaleString('fr-FR')} F</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Dettes</p>
                                    <p className="font-bold text-lg text-red-600">- {patrimoine.dettes.toLocaleString('fr-FR')} F</p>
                                </div>
                                {regimeMatrimonial === 'COMMUNAUTE' && (
                                    <>
                                        <div>
                                            <p className="text-slate-500">Biens Propres Défunt</p>
                                            <p className="font-bold">{patrimoine.biensPropres?.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Part Biens Communs (1/2)</p>
                                            <p className="font-bold">{((patrimoine.biensCommuns || 0) / 2).toLocaleString('fr-FR')} F</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-amber-700 font-medium">Quotité Disponible</p>
                                    <p className="text-xs text-amber-600">Libre disposition par testament</p>
                                </div>
                                <p className="text-2xl font-bold text-amber-700">{quotiteDisponible.toLocaleString('fr-FR')} F</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONGLET 2 : PARTAGE */}
                <TabsContent value="parts" className="space-y-4">
                    {optionConjoint === 'USUFRUIT' && conjoint && (
                        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
                            <CardHeader>
                                <CardTitle className="text-base text-violet-900">Démembrement de Propriété</CardTitle>
                                <CardDescription>Valorisation selon barème fiscal (âge : {conjoint.age} ans)</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-lg border border-violet-200">
                                    <p className="text-sm text-violet-700 font-medium mb-1">Usufruit ({conjoint.nom})</p>
                                    <p className="text-2xl font-bold text-violet-900">{valeurUsufruit.toLocaleString('fr-FR')} F</p>
                                    <p className="text-xs text-violet-600 mt-1">
                                        {((valeurUsufruit / masseLiquidation) * 100).toFixed(0)}% de la valeur
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg border border-violet-200">
                                    <p className="text-sm text-violet-700 font-medium mb-1">Nue-Propriété (Enfants)</p>
                                    <p className="text-2xl font-bold text-violet-900">{valeurNuePropriete.toLocaleString('fr-FR')} F</p>
                                    <p className="text-xs text-violet-600 mt-1">
                                        {((valeurNuePropriete / masseLiquidation) * 100).toFixed(0)}% de la valeur
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5 text-indigo-600" />
                                Répartition des Parts Héréditaires
                            </CardTitle>
                            <CardDescription>
                                Option conjoint : {optionConjoint === 'USUFRUIT' ? 'Usufruit total' : 'Pleine propriété 1/4'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {parts.map((part, index) => (
                                <div key={index} className="p-4 border rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-slate-900">{part.heritier.nom}</p>
                                            <p className="text-xs text-slate-500">{part.heritier.lien}</p>
                                        </div>
                                        <Badge className="bg-indigo-500">{part.pourcentage.toFixed(2)}%</Badge>
                                    </div>

                                    {part.partEnPleineProprieteAbsolue > 0 && (
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="text-slate-600">Pleine Propriété</span>
                                            <span className="font-bold text-slate-900">{part.partEnPleineProprieteAbsolue.toLocaleString('fr-FR')} F</span>
                                        </div>
                                    )}
                                    {part.partEnUsufruit > 0 && (
                                        <div className="flex justify-between text-sm mt-2 text-purple-700">
                                            <span>Usufruit</span>
                                            <span className="font-bold">{part.partEnUsufruit.toLocaleString('fr-FR')} F</span>
                                        </div>
                                    )}
                                    {part.partEnNuePropriete > 0 && (
                                        <div className="flex justify-between text-sm mt-2 text-blue-700">
                                            <span>Nue-Propriété</span>
                                            <span className="font-bold">{part.partEnNuePropriete.toLocaleString('fr-FR')} F</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONGLET 3 : FISCALITÉ */}
                <TabsContent value="fiscal" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                💰 Droits de Succession
                            </CardTitle>
                            <CardDescription>Calcul selon le Code Général des Impôts (Sénégal)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {droitsParHeritier.map((droit, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-slate-900">{droit.nom}</p>
                                        <Badge variant="outline">Taux: {(droit.taux * 100).toFixed(0)}%</Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mt-2">
                                        <div>
                                            <p>Part</p>
                                            <p className="font-bold text-slate-900">{droit.base.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <div>
                                            <p>Abattement</p>
                                            <p className="font-bold text-emerald-700">- {droit.abattement.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <div>
                                            <p>Droits dus</p>
                                            <p className="font-bold text-red-700">{droit.droits.toLocaleString('fr-FR')} F</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                                <p className="font-bold text-red-900">TOTAL DROITS DE SUCCESSION</p>
                                <p className="text-2xl font-bold text-red-700">{totalDroitsSuccession.toLocaleString('fr-FR')} F</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ONGLET 4 : LIBÉRALITÉS */}
                <TabsContent value="liberalites" className="space-y-4">
                    {totalExces > 0 && (
                        <Card className="bg-red-50 border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-900">
                                    <AlertTriangle className="h-5 w-5" />
                                    Libéralités Excessives Détectées
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-red-700 mb-3">
                                    Les donations et legs dépassent la quotité disponible de <strong>{totalExces.toLocaleString('fr-FR')} FCFA</strong>.
                                    Une réduction est nécessaire conformément à l'Art. 711 du Code de la Famille.
                                </p>
                                <div className="space-y-2">
                                    {legsReduits.map((lr, i) => (
                                        <div key={i} className="p-3 bg-white rounded-lg border border-red-200">
                                            <p className="font-semibold text-sm">{lr.legs.beneficiaire}</p>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>Legs initial : {lr.legs.montant?.toLocaleString('fr-FR')} F</span>
                                                <span className="text-red-700 font-bold">↓ Réduit à : {lr.montantReduit.toLocaleString('fr-FR')} F</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Donations Rapportables</CardTitle>
                                <CardDescription>{donations.length} donation(s)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {donations.map(don => (
                                    <div key={don.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-sm">{don.beneficiaire}</p>
                                                <p className="text-xs text-slate-500">{don.date.toLocaleDateString('fr-FR')}</p>
                                            </div>
                                            <p className="font-bold text-blue-700">{don.montant.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <Badge variant="outline" className="mt-2 text-xs">{don.type}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Legs Testamentaires</CardTitle>
                                <CardDescription>{legs.length} legs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {legs.map(leg => (
                                    <div key={leg.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-sm">{leg.beneficiaire}</p>
                                                <p className="text-xs text-slate-500">{leg.description}</p>
                                            </div>
                                            <p className="font-bold text-purple-700">{leg.montant?.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <Badge variant="outline" className="mt-2 text-xs">{leg.type}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
