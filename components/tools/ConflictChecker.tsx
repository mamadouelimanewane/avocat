
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShieldAlert, CheckCircle, Loader2, UserPlus, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ConflictChecker() {
    const [query, setQuery] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [results, setResults] = useState<any[] | null>(null)

    const handleScan = () => {
        if (!query) return
        setIsScanning(true)
        setResults(null)

        // Simulation d'une analyse IA approfondie dans la base de données
        setTimeout(() => {
            const mockData = [
                { id: 1, name: "Samba Diop", role: "Client Actuel", dossier: "2023-CIV-045", risk: "HIGH" },
                { id: 2, name: "Diop SARL", role: "Partie Adverse", dossier: "2024-COM-012", risk: "MEDIUM" },
            ]

            // On filtre pour la démo si le nom contient "Diop"
            if (query.toLowerCase().includes("diop")) {
                setResults(mockData)
            } else {
                setResults([])
            }
            setIsScanning(false)
        }, 2000)
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
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-semibold">ALERTE CONFLIT : Des correspondances critiques ont été détectées.</p>
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
                                <Button size="sm" className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                                    <UserPlus className="h-4 w-4 mr-2" /> Ouvrir Dossier en toute sécurité
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
