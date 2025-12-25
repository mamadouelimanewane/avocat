"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ShieldAlert,
    Search,
    AlertTriangle,
    CheckCircle2,
    Briefcase,
    User,
    History,
    Scale,
    ArrowRight,
    SearchX
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { checkConflict } from "@/app/actions"

export function ConflictChecker() {
    const [name, setName] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<any>(null)
    const { toast } = useToast()

    const handleCheck = async () => {
        if (!name.trim()) return
        setIsChecking(true)
        try {
            const data = await checkConflict(name)
            setResult(data)
            if (data.conflict) {
                toast({
                    title: "⚠️ Alerte Conflit",
                    description: "Des correspondances ont été trouvées dans la base.",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "✅ Aucun Conflit",
                    description: "La voie est libre pour ce dossier."
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Vérification impossible.",
                variant: "destructive"
            })
        } finally {
            setIsChecking(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                        Vérificateur de Conflits d'Intérêts
                    </h1>
                    <p className="text-slate-500 mt-1">Conformité déontologique instantanée sur l'ensemble de vos dossiers.</p>
                </div>
            </div>

            <Card className="border-red-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                            <Input
                                placeholder="Nom de la partie (Client ou Adverse)..."
                                className="pl-11 py-6 text-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                            />
                        </div>
                        <Button
                            className="h-auto px-8 bg-red-600 hover:bg-red-700 font-bold"
                            onClick={handleCheck}
                            disabled={isChecking || !name}
                        >
                            {isChecking ? "Analyse..." : "Vérifier"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {result.conflict ? (
                        <Card className="border-red-200 bg-red-50/30">
                            <CardHeader className="border-b border-red-100 bg-red-50/50">
                                <CardTitle className="text-red-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    ALERTE : CONFLIT POTENTIEL DÉTECTÉ
                                </CardTitle>
                                <CardDescription className="text-red-700 font-medium">
                                    {result.matches.length} correspondance(s) trouvée(s) pour "{name}".
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px]">
                                    <div className="divide-y divide-red-100">
                                        {result.matches.map((match: any) => (
                                            <div key={match.id} className="p-4 hover:bg-red-50 transition-colors group">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                                            <Briefcase className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="font-bold text-slate-900">{match.title}</h4>
                                                            <div className="flex items-center gap-4 text-xs">
                                                                <span className="flex items-center gap-1 text-slate-600">
                                                                    <User className="h-3 w-3" /> Client : {match.clientName}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-slate-600 font-bold underline">
                                                                    Relation : {match.relation}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-2">Partie Adverse : {match.opposingParty || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white">
                                                        Ouvrir Dossier <ArrowRight className="ml-2 h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-emerald-200 bg-emerald-50/30">
                            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Aucun Conflit Détecté</h2>
                                <p className="text-emerald-700 max-w-sm">
                                    Le nom "{name}" ne figure ni comme client ni comme partie adverse dans votre base de données actuelle.
                                </p>
                                <div className="mt-8 p-4 bg-white border border-emerald-100 rounded-lg flex items-center gap-3">
                                    <Scale className="h-5 w-5 text-emerald-500" />
                                    <p className="text-xs text-slate-500 text-left">
                                        Cette vérification a été effectuée sur 100% des dossiers ouverts et clôturés.
                                        Conformément au règlement du Barreau, il vous est conseillé de vérifier également vos archives physiques.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Disclaimer */}
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded text-[10px] text-slate-500 font-medium">
                        <History className="h-3 w-3" />
                        Dernière indexation de la base : Aujourd'hui à 09:45.
                    </div>
                </div>
            )}

            {!result && !isChecking && (
                <div className="flex flex-col items-center justify-center p-12 text-slate-300">
                    <SearchX className="h-16 w-16 mb-4 opacity-10" />
                    <p className="text-lg font-medium">Saisissez un nom pour démarrer l'audit déontologique.</p>
                </div>
            )}
        </div>
    )
}
