"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Globe, UserCheck, FileJson } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CentifGuard() {
    const [amount, setAmount] = useState("")
    const [beneficiary, setBeneficiary] = useState("")
    const [country, setCountry] = useState("SN")
    const [status, setStatus] = useState<"IDLE" | "ANALYZING" | "SAFE" | "WARNING" | "CRITICAL">("IDLE")

    const handleScan = () => {
        setStatus("ANALYZING")
        setTimeout(() => {
            // Mock Logic
            const amt = parseFloat(amount)
            const riskyCountries = ['KP', 'IR', 'SY']
            const watchList = ['Diop Import', 'Global Trading', 'Offshore Ltd']

            if (riskyCountries.includes(country) || watchList.includes(beneficiary)) {
                setStatus("CRITICAL")
            } else if (amt > 10000000) {
                setStatus("WARNING")
            } else {
                setStatus("SAFE")
            }
        }, 1500)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg bg-slate-900 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="h-6 w-6" />
                        CENTIF Guard™
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Scanner Anti-Blanchiment (AML) & Conformité CARPA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Bénéficiaire / Donneur d'ordre</Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                className="pl-9 bg-slate-800 border-slate-700 text-white"
                                placeholder="Ex: Société X..."
                                value={beneficiary}
                                onChange={(e) => setBeneficiary(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Montant (FCFA)</Label>
                            <Input
                                className="bg-slate-800 border-slate-700 text-white"
                                placeholder="0"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pays Origine/Dest.</Label>
                            <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SN">Sénégal (SN)</SelectItem>
                                    <SelectItem value="FR">France (FR)</SelectItem>
                                    <SelectItem value="AE">Émirats Arabes Unis (AE)</SelectItem>
                                    <SelectItem value="KP">Corée du Nord (KP)</SelectItem>
                                    <SelectItem value="KY">Îles Caïmans (KY)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold mt-4"
                        onClick={handleScan}
                        disabled={status === 'ANALYZING'}
                    >
                        {status === 'ANALYZING' ? 'Analyse en cours...' : 'Lancer le Scan de Conformité'}
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {status === 'IDLE' && (
                    <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <ShieldAlert className="h-12 w-12 mb-2 opacity-20" />
                        <p>En attente d'analyse transactionnelle.</p>
                        <p className="text-xs mt-2 text-slate-500">Vérifie: Listes Sanctions (UN/EU), PEPs, Seuils de vigilance 10M FCFA.</p>
                    </div>
                )}

                {status === 'ANALYZING' && (
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="h-16 w-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="font-mono text-sm text-emerald-600">Interrogation des bases de données CENTIF...</p>
                    </div>
                )}

                {status === 'SAFE' && (
                    <Card className="bg-emerald-50 border-emerald-200 shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                Risque Faible (Low)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-emerald-700">Aucune alerte détectée sur cette entité ou ce montant.</p>
                            <div className="flex gap-2">
                                <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200">Whitelist</Badge>
                                <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200">Seuil OK</Badge>
                            </div>
                            <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100 mt-4">
                                <FileJson className="mr-2 h-4 w-4" /> Télécharger Certificat de Vigilance
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {status === 'WARNING' && (
                    <Card className="bg-amber-50 border-amber-200 shadow-md h-full">
                        <CardHeader>
                            <CardTitle className="text-amber-800 flex items-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-amber-600" />
                                Vigilance Requise (Medium)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-amber-700 font-bold">Le montant dépasse le seuil déclaratif de 10.000.000 FCFA.</p>
                            <ul className="text-xs text-amber-800 list-disc pl-4 space-y-1">
                                <li>Vérifier l'origine des fonds (Justificatifs requis).</li>
                                <li>Déclaration de Soupçon (DS) non requise à ce stade.</li>
                            </ul>
                            <div className="p-3 bg-white rounded border border-amber-100 mt-2">
                                <p className="text-[10px] text-amber-600">Recommandation IA : Demander les statuts de la société et la pièce d'identité du gérant.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {status === 'CRITICAL' && (
                    <Card className="bg-rose-50 border-rose-200 shadow-md h-full animate-in shake">
                        <CardHeader>
                            <CardTitle className="text-rose-800 flex items-center gap-2">
                                <ShieldAlert className="h-6 w-6 text-rose-600" />
                                ALERTE ROUGE (High Risk)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-rose-700 font-bold">Transaction bloquée préventivement.</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-100 p-2 rounded">
                                    <Globe className="h-4 w-4" /> Pays à haut risque (GAFI / FATF) détecté.
                                </div>
                                <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-100 p-2 rounded">
                                    <AlertTriangle className="h-4 w-4" /> Entité sous surveillance potentielle.
                                </div>
                            </div>
                            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-4 font-bold">
                                GÉNÉRER DÉCLARATION CENTIF
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

import { CheckCircle2 } from "lucide-react"
