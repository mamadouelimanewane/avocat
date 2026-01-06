"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Users, Home, DollarSign, FileText, Heart, Scale, AlertTriangle, Download, Calculator } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Heritier {
    id: string
    nom: string
    lien: 'CONJOINT' | 'ENFANT' | 'PERE' | 'MERE' | 'FRERE' | 'SOEUR' | 'AUTRE'
    age?: number
}

interface Bien {
    id: string
    type: 'IMMOBILIER' | 'FINANCIER' | 'MOBILIER' | 'AUTRE'
    description: string
    valeur: number
}

interface Dette {
    id: string
    description: string
    montant: number
}

export function SuccessionCalculator() {
    const { toast } = useToast()

    // État du défunt
    const [regimeMatrimonial, setRegimeMatrimonial] = useState<'SEPARATION' | 'COMMUNAUTE' | 'PARTICIPATION'>('COMMUNAUTE')
    const [conjointSurvivant, setConjointSurvivant] = useState(true)
    const [testamentExiste, setTestamentExiste] = useState(false)

    // Héritiers
    const [heritiers, setHeritiers] = useState<Heritier[]>([
        { id: '1', nom: 'Conjoint', lien: 'CONJOINT' },
        { id: '2', nom: 'Enfant 1', lien: 'ENFANT', age: 25 },
        { id: '3', nom: 'Enfant 2', lien: 'ENFANT', age: 18 }
    ])

    // Patrimoine
    const [actifs, setActifs] = useState<Bien[]>([
        { id: '1', type: 'IMMOBILIER', description: 'Villa Almadies', valeur: 150000000 },
        { id: '2', type: 'FINANCIER', description: 'Compte bancaire', valeur: 25000000 }
    ])

    const [dettes, setDettes] = useState<Dette[]>([
        { id: '1', description: 'Prêt immobilier', montant: 30000000 }
    ])

    // Calculs
    const totalActifs = actifs.reduce((sum, bien) => sum + bien.valeur, 0)
    const totalDettes = dettes.reduce((sum, dette) => sum + dette.montant, 0)
    const actifNet = totalActifs - totalDettes

    const enfants = heritiers.filter(h => h.lien === 'ENFANT')
    const conjoint = heritiers.find(h => h.lien === 'CONJOINT')

    // Calcul selon la loi sénégalaise (Code de la Famille)
    const calculateParts = () => {
        const parts: { nom: string, part: number, pourcentage: number }[] = []

        // Si présence de conjoint ET enfants (Art. 567 Code de la Famille)
        if (conjoint && enfants.length > 0) {
            // Conjoint : 1/4 en usufruit (ou 1/4 en pleine propriété si opte)
            // Enfants : 3/4 en pleine propriété (réserve héréditaire)
            const partConjoint = actifNet * 0.25
            const partEnfants = actifNet * 0.75
            const partParEnfant = partEnfants / enfants.length

            parts.push({
                nom: conjoint.nom,
                part: partConjoint,
                pourcentage: 25
            })

            enfants.forEach(enfant => {
                parts.push({
                    nom: enfant.nom,
                    part: partParEnfant,
                    pourcentage: (75 / enfants.length)
                })
            })
        }
        // Si uniquement conjoint (pas d'enfants)
        else if (conjoint && enfants.length === 0) {
            const parents = heritiers.filter(h => h.lien === 'PERE' || h.lien === 'MERE')
            const freresSoeurs = heritiers.filter(h => h.lien === 'FRERE' || h.lien === 'SOEUR')

            if (parents.length > 0 || freresSoeurs.length > 0) {
                // Conjoint : 1/2, Ascendants/Collatéraux : 1/2
                parts.push({ nom: conjoint.nom, part: actifNet * 0.5, pourcentage: 50 })

                const partAutres = actifNet * 0.5
                const nbAutres = parents.length + freresSoeurs.length;
                [...parents, ...freresSoeurs].forEach(h => {
                    parts.push({
                        nom: h.nom,
                        part: partAutres / nbAutres,
                        pourcentage: (50 / nbAutres)
                    })
                })
            } else {
                // Conjoint seul : 100%
                parts.push({ nom: conjoint.nom, part: actifNet, pourcentage: 100 })
            }
        }
        // Si uniquement enfants (pas de conjoint)
        else if (enfants.length > 0 && !conjoint) {
            const partParEnfant = actifNet / enfants.length
            enfants.forEach(enfant => {
                parts.push({
                    nom: enfant.nom,
                    part: partParEnfant,
                    pourcentage: (100 / enfants.length)
                })
            })
        }
        // Ordre subsidiaire (parents, frères/soeurs)
        else {
            const tousHeritiers = heritiers.filter(h => h.lien !== 'CONJOINT')
            if (tousHeritiers.length > 0) {
                const partPar = actifNet / tousHeritiers.length
                tousHeritiers.forEach(h => {
                    parts.push({
                        nom: h.nom,
                        part: partPar,
                        pourcentage: (100 / tousHeritiers.length)
                    })
                })
            }
        }

        return parts
    }

    const parts = calculateParts()

    // Calcul réserve héréditaire vs quotité disponible
    let reserveHereditaire = 0
    let quotiteDisponible = 0

    if (enfants.length > 0) {
        // Avec enfants : réserve = 3/4 (pour les enfants)
        reserveHereditaire = actifNet * 0.75
        quotiteDisponible = actifNet * 0.25
    } else if (heritiers.some(h => h.lien === 'PERE' || h.lien === 'MERE')) {
        // Sans enfants mais avec parents : réserve = 1/3
        reserveHereditaire = actifNet * (1 / 3)
        quotiteDisponible = actifNet * (2 / 3)
    } else {
        // Aucun réservataire : quotité disponible = 100%
        quotiteDisponible = actifNet
    }

    const addHeritier = () => {
        const newId = String(Date.now())
        setHeritiers([...heritiers, { id: newId, nom: `Héritier ${heritiers.length + 1}`, lien: 'AUTRE' }])
    }

    const addActif = () => {
        const newId = String(Date.now())
        setActifs([...actifs, { id: newId, type: 'AUTRE', description: '', valeur: 0 }])
    }

    const addDette = () => {
        const newId = String(Date.now())
        setDettes([...dettes, { id: newId, description: '', montant: 0 }])
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Calculateur de Succession</h1>
                    <p className="text-slate-500 mt-1">Liquidation et partage successoral (Loi sénégalaise)</p>
                </div>
                <Button className="bg-slate-900 gap-2">
                    <Download className="h-4 w-4" />
                    Générer Acte de Partage
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne Gauche : Configuration */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Heart className="h-5 w-5 text-rose-500" />
                                Situation Familiale
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs">Régime Matrimonial</Label>
                                <Select value={regimeMatrimonial} onValueChange={(v: any) => setRegimeMatrimonial(v)}>
                                    <SelectTrigger className="h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COMMUNAUTE">Communauté de Biens</SelectItem>
                                        <SelectItem value="SEPARATION">Séparation de Biens</SelectItem>
                                        <SelectItem value="PARTICIPATION">Participation aux Acquêts</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Conjoint Survivant</Label>
                                <input
                                    type="checkbox"
                                    checked={conjointSurvivant}
                                    onChange={(e) => setConjointSurvivant(e.target.checked)}
                                    className="h-4 w-4"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Testament Existant</Label>
                                <input
                                    type="checkbox"
                                    checked={testamentExiste}
                                    onChange={(e) => setTestamentExiste(e.target.checked)}
                                    className="h-4 w-4"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    Héritiers ({heritiers.length})
                                </CardTitle>
                                <Button size="sm" variant="outline" onClick={addHeritier} className="h-7">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-2">
                                    {heritiers.map((heritier, index) => (
                                        <div key={heritier.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <Input
                                                    value={heritier.nom}
                                                    onChange={(e) => {
                                                        const updated = [...heritiers]
                                                        updated[index].nom = e.target.value
                                                        setHeritiers(updated)
                                                    }}
                                                    className="h-7 text-sm font-semibold"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setHeritiers(heritiers.filter(h => h.id !== heritier.id))}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                            </div>
                                            <Select
                                                value={heritier.lien}
                                                onValueChange={(v: any) => {
                                                    const updated = [...heritiers]
                                                    updated[index].lien = v
                                                    setHeritiers(updated)
                                                }}
                                            >
                                                <SelectTrigger className="h-7 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CONJOINT">Conjoint</SelectItem>
                                                    <SelectItem value="ENFANT">Enfant</SelectItem>
                                                    <SelectItem value="PERE">Père</SelectItem>
                                                    <SelectItem value="MERE">Mère</SelectItem>
                                                    <SelectItem value="FRERE">Frère</SelectItem>
                                                    <SelectItem value="SOEUR">Sœur</SelectItem>
                                                    <SelectItem value="AUTRE">Autre</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne Centre : Patrimoine */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Home className="h-5 w-5 text-emerald-500" />
                                    Actifs ({actifs.length})
                                </CardTitle>
                                <Button size="sm" variant="outline" onClick={addActif} className="h-7">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[250px]">
                                <div className="space-y-2">
                                    {actifs.map((bien, index) => (
                                        <div key={bien.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <Select
                                                    value={bien.type}
                                                    onValueChange={(v: any) => {
                                                        const updated = [...actifs]
                                                        updated[index].type = v
                                                        setActifs(updated)
                                                    }}
                                                >
                                                    <SelectTrigger className="h-7 text-xs w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="IMMOBILIER">Immobilier</SelectItem>
                                                        <SelectItem value="FINANCIER">Financier</SelectItem>
                                                        <SelectItem value="MOBILIER">Mobilier</SelectItem>
                                                        <SelectItem value="AUTRE">Autre</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setActifs(actifs.filter(a => a.id !== bien.id))}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                            </div>
                                            <Input
                                                value={bien.description}
                                                onChange={(e) => {
                                                    const updated = [...actifs]
                                                    updated[index].description = e.target.value
                                                    setActifs(updated)
                                                }}
                                                placeholder="Description"
                                                className="h-7 text-xs mb-2"
                                            />
                                            <Input
                                                type="number"
                                                value={bien.valeur}
                                                onChange={(e) => {
                                                    const updated = [...actifs]
                                                    updated[index].valeur = Number(e.target.value)
                                                    setActifs(updated)
                                                }}
                                                placeholder="Valeur (FCFA)"
                                                className="h-7 text-xs font-bold text-emerald-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <Separator className="my-3" />
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Total Actifs</p>
                                <p className="text-2xl font-bold text-emerald-700">{totalActifs.toLocaleString('fr-FR')} F</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Dettes ({dettes.length})
                                </CardTitle>
                                <Button size="sm" variant="outline" onClick={addDette} className="h-7">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[150px]">
                                <div className="space-y-2">
                                    {dettes.map((dette, index) => (
                                        <div key={dette.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <Input
                                                    value={dette.description}
                                                    onChange={(e) => {
                                                        const updated = [...dettes]
                                                        updated[index].description = e.target.value
                                                        setDettes(updated)
                                                    }}
                                                    placeholder="Description"
                                                    className="h-7 text-xs"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDettes(dettes.filter(d => d.id !== dette.id))}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                            </div>
                                            <Input
                                                type="number"
                                                value={dette.montant}
                                                onChange={(e) => {
                                                    const updated = [...dettes]
                                                    updated[index].montant = Number(e.target.value)
                                                    setDettes(updated)
                                                }}
                                                placeholder="Montant (FCFA)"
                                                className="h-7 text-xs font-bold text-red-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <Separator className="my-3" />
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Total Dettes</p>
                                <p className="text-2xl font-bold text-red-700">- {totalDettes.toLocaleString('fr-FR')} F</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne Droite : Résultats */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-indigo-100 text-sm font-medium uppercase">Actif Net Successoral</p>
                                <Calculator className="h-5 w-5 text-indigo-200" />
                            </div>
                            <p className="text-4xl font-bold">{actifNet.toLocaleString('fr-FR')} F</p>
                            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-white/10 p-2 rounded">
                                    <p className="text-indigo-200">Actifs</p>
                                    <p className="font-bold">{totalActifs.toLocaleString('fr-FR')}</p>
                                </div>
                                <div className="bg-white/10 p-2 rounded">
                                    <p className="text-indigo-200">Dettes</p>
                                    <p className="font-bold">- {totalDettes.toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Scale className="h-5 w-5 text-amber-500" />
                                Répartition Légale
                            </CardTitle>
                            <CardDescription className="text-xs">Selon Code de la Famille (Sénégal)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-3">
                                    {parts.map((part, index) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-sm text-slate-900">{part.nom}</p>
                                                <Badge className="bg-indigo-500">{part.pourcentage.toFixed(2)}%</Badge>
                                            </div>
                                            <p className="text-2xl font-bold text-indigo-700">{part.part.toLocaleString('fr-FR')} F</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50 border-amber-200">
                        <CardHeader>
                            <CardTitle className="text-sm text-amber-900">Réserve Héréditaire & Quotité Disponible</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-amber-700 mb-1">Réserve (Héritiers Réservataires)</p>
                                <p className="text-lg font-bold text-amber-900">{reserveHereditaire.toLocaleString('fr-FR')} F</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs text-amber-700 mb-1">Quotité Disponible (Testament)</p>
                                <p className="text-lg font-bold text-emerald-700">{quotiteDisponible.toLocaleString('fr-FR')} F</p>
                            </div>
                            {testamentExiste && (
                                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                                    <FileText className="h-4 w-4 inline mr-1" />
                                    Testament détecté : la quotité disponible peut être attribuée librement.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
