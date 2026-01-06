
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShieldAlert, CheckCircle, Loader2, UserPlus, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createDocumentFromTemplate } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { FileCheck, FileX } from "lucide-react"

import { checkConflict } from "@/app/actions"

export function ConflictChecker() {
    const [query, setQuery] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [results, setResults] = useState<any[] | null>(null)
    const { toast } = useToast()

    const handleGenerateConflictReport = async (found: boolean) => {
        setIsGenerating(true)
        try {
            const templateSlug = found ? 'PROCEDURE_conflit_detecte' : 'PROCEDURE_certificat_non_conflit'
            const result = await createDocumentFromTemplate(
                "677c7774e54823467f555555", // Simulated Dossier
                templateSlug,
                {
                    PARTIE_VERIFIEE: query,
                    DATE_VERIFICATION: new Date().toLocaleDateString('fr-FR'),
                    RESULTAT: found ? "CONFLIT DETECTE" : "AUCUN CONFLIT",
                    DETAILS: found ? `Match trouvé pour ${results?.map(r => r.name).join(', ')}` : "Recherche exhaustive effectuée dans la base LexPremium."
                }
            )

            if (result.success) {
                toast({
                    title: found ? "Rapport de conflit généré" : "Certificat généré",
                    description: "Le document a été ajouté au dossier administratif du cabinet."
                })
            }
        } catch (e) {
            toast({ variant: "destructive", title: "Erreur", description: "Échec de l'automatisation." })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleScan = async () => {
        if (!query) return
        setIsScanning(true)
        setResults(null)

        try {
            const res = await checkConflict(query)
            if (res.success && res.conflict) {
                setResults(res.matches || [])
            } else {
                setResults([])
            }
        } catch (error) {
            console.error("Conflict check error:", error)
        } finally {
            setIsScanning(false)
        }
    }

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="h-5 w-5 text-indigo-600" />
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Nouveau Module IA</Badge>
                </div>
                <CardTitle>Contrôle des Conflits d'Intérêts</CardTitle>
                <CardDescription>Vérifiez instantanément si un nouveau client ou une partie a déjà un historique avec le cabinet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Nom de la personne ou de l'entreprise..."
                            className="pl-10 h-10"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                        />
                    </div>
                    <Button
                        onClick={handleScan}
                        disabled={isScanning || !query}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isScanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                        Scanner
                    </Button>
                </div>

                {isScanning && (
                    <div className="py-12 text-center animate-pulse">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Analyse IA des dossiers et pièces en cours...</p>
                        <p className="text-xs text-slate-400 mt-1">Vérification de la base de données LexPremium et de la jurisprudence interne.</p>
                    </div>
                )}

                {!isScanning && results !== null && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {results.length > 0 ? (
                            <>
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-red-800">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 shrink-0" />
                                        <p className="text-sm font-semibold">ALERTE CONFLIT : Correspondances détectées.</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 text-[10px]"
                                        onClick={() => handleGenerateConflictReport(true)}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <FileX className="h-3 w-3 mr-1" />}
                                        Générer Rapport
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {results.map((res) => (
                                        <div key={res.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${res.risk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {res.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{res.name}</p>
                                                    <p className="text-xs text-slate-500">{res.role} • Dossier {res.dossier}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={res.risk === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}>Risque {res.risk}</Badge>
                                                <Button size="sm" variant="outline" className="text-[11px] h-8">Voir Dossier</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-400 italic text-center">Note : Conformément à la déontologie du barreau, un examen humain approfondi reste nécessaire avant acceptation du dossier.</p>
                            </>
                        ) : (
                            <div className="py-12 text-center bg-emerald-50/50 border border-dashed border-emerald-200 rounded-3xl">
                                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-emerald-900">Aucun Conflit Détecté</h4>
                                <p className="text-emerald-700/70 text-sm max-w-xs mx-auto">Le nom "{query}" n'apparaît dans aucun dossier actif ou passé en tant que partie adverse ou tiers incohérent.</p>
                                <div className="mt-6 flex justify-center gap-2">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                        <UserPlus className="h-4 w-4 mr-2" /> Ouvrir Dossier
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-emerald-200 text-emerald-700"
                                        onClick={() => handleGenerateConflictReport(false)}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <FileCheck className="h-3 w-3 mr-1" />}
                                        Générer Certificat
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
