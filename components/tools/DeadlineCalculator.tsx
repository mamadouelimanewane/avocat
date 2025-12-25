
"use client"

import { useState } from "react"
import { Calendar, ArrowRight, AlertTriangle, CheckCircle, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, addMonths, format, isWeekend, isFriday, nextMonday } from "date-fns"
import { fr } from "date-fns/locale"

type ProcedureType = "APPEL_CIVIL" | "OPPOSITION" | "POURVOI_CASSATION" | "INJONCTION_PAYER" | "PREAVIS_BAIL"

const PROCEDURES: Record<ProcedureType, { label: string, duration: number, unit: 'days' | 'months', description: string }> = {
    "APPEL_CIVIL": { label: "Appel (Matière Civile)", duration: 1, unit: 'months', description: "Délai pour interjeter appel d'un jugement civil contradictoire (Art. 268 CPCC)." },
    "OPPOSITION": { label: "Opposition à Jugement", duration: 15, unit: 'days', description: "Délai pour former opposition à un jugement rendu par défaut." },
    "POURVOI_CASSATION": { label: "Pourvoi en Cassation", duration: 2, unit: 'months', description: "Délai pour saisir la Cour Suprême." },
    "INJONCTION_PAYER": { label: "Opposition Injonction de Payer", duration: 15, unit: 'days', description: "Délai après signification de l'IP (Acte Uniforme OHADA Recouvrement)." },
    "PREAVIS_BAIL": { label: "Préavis Congé Bail Commercial", duration: 6, unit: 'months', description: "Durée minimale du préavis (Acte Uniforme OHADA Droit Commercial)." },
}

import { createEvent, getDossiersList } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export function DeadlineCalculator() {
    const [procedure, setProcedure] = useState<ProcedureType | "">("")
    const [baseDate, setBaseDate] = useState<string>("")
    const [result, setResult] = useState<{ date: Date, isAdjusted: boolean } | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [dossiers, setDossiers] = useState<any[]>([])
    const [selectedDossier, setSelectedDossier] = useState<string>("")
    const { toast } = useToast()

    useEffect(() => {
        getDossiersList().then(setDossiers)
    }, [])

    const calculate = () => {
        if (!procedure || !baseDate) return

        const proc = PROCEDURES[procedure as ProcedureType]
        const start = new Date(baseDate)
        let end = proc.unit === 'months' ? addMonths(start, proc.duration) : addDays(start, proc.duration)

        let adjusted = false
        if (isWeekend(end)) {
            end = nextMonday(end)
            adjusted = true
        }

        setResult({ date: end, isAdjusted: adjusted })
    }

    const handleSaveToAgenda = async () => {
        if (!result) return
        setIsSaving(true)
        try {
            const procLabel = procedure ? PROCEDURES[procedure as ProcedureType].label : "Échéance"
            const res = await createEvent({
                title: `Échéance: ${procLabel}`,
                startDate: result.date,
                endDate: result.date,
                type: 'DEADLINE',
                description: `Calculé automatiquement. Date de départ: ${baseDate}`,
                dossierId: selectedDossier
            })

            if (res.success) {
                toast({
                    title: "Événement créé",
                    description: "L'échéance a été ajoutée à votre agenda.",
                    className: "bg-emerald-50 border-emerald-200"
                })
            }
        } catch (e) {
            toast({ title: "Erreur", description: "Impossible de sauvegarder l'événement.", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="h-full border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                    <CardTitle>Calculateur de Délais Procéduraux</CardTitle>
                </div>
                <CardDescription>Estimez vos dates limites selon le CPCC et l'OHADA.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Dossier lié (Optionnel)</Label>
                        <Select value={selectedDossier} onValueChange={setSelectedDossier}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un dossier..." />
                            </SelectTrigger>
                            <SelectContent>
                                {dossiers.map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.reference} - {d.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Type de Procédure / Acte</Label>
                        <Select value={procedure} onValueChange={(v) => setProcedure(v as ProcedureType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(PROCEDURES).map(([key, p]) => (
                                    <SelectItem key={key} value={key}>{p.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {procedure && (
                            <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
                                {PROCEDURES[procedure as ProcedureType].description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Date de départ (Signification/Jugement)</Label>
                        <Input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
                    </div>

                    <Button onClick={calculate} disabled={!procedure || !baseDate} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Calculer l'Échéance
                    </Button>
                </div>

                {result && (
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Date Limite Estimée</h4>
                        <div className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
                            {format(result.date, "dd MMMM yyyy", { locale: fr })}
                        </div>
                        {result.isAdjusted && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Ajusté au jour ouvrable suivant (Weekend).</span>
                            </div>
                        )}

                        <Button
                            onClick={handleSaveToAgenda}
                            disabled={isSaving}
                            variant="outline"
                            className="w-full mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {isSaving ? "Enregistrement..." : "Ajouter à l'Agenda"}
                        </Button>

                        <div className="mt-4 text-xs text-slate-500 border-t border-indigo-200 pt-2">
                            * Ce calcul est indicatif. Vérifiez toujours les jours fériés spécifiques au Sénégal.
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

