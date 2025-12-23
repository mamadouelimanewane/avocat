
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Building, Gavel, Scale, AlertCircle } from "lucide-react"
import { updateDossierDetails } from "@/app/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function EditDossierDialog({ dossier }: { dossier: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        opposingParty: dossier.opposingParty || '',
        opposingCounsel: dossier.opposingCounsel || '',
        judge: dossier.judge || '',
        jurisdiction: dossier.jurisdiction || '',
        procedureType: dossier.procedureType || 'CIVIL',
        stage: dossier.stage || 'SAISINE',
        nextHearingDate: dossier.nextHearingDate ? new Date(dossier.nextHearingDate).toISOString().split('T')[0] : ''
    })

    const handleSave = async () => {
        await updateDossierDetails(dossier.id, {
            ...formData,
            nextHearingDate: formData.nextHearingDate ? new Date(formData.nextHearingDate) : undefined
        })
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Modifier la fiche</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Mise à jour du Dossier</DialogTitle>
                    <DialogDescription>Modifier les informations procédurales.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Type de Procédure</Label>
                        <Select
                            value={formData.procedureType}
                            onValueChange={(v) => setFormData({ ...formData, procedureType: v })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CIVIL">Civil</SelectItem>
                                <SelectItem value="PENAL">Pénal</SelectItem>
                                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                <SelectItem value="SOCIAL">Social</SelectItem>
                                <SelectItem value="ADMINISTRATIF">Administratif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Étape Actuelle (Statut)</Label>
                        <Select
                            value={formData.stage}
                            onValueChange={(v) => setFormData({ ...formData, stage: v })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SAISINE">Saisine / Assignation</SelectItem>
                                <SelectItem value="MISE_EN_ETAT">Mise en état</SelectItem>
                                <SelectItem value="PLAIDOIRIE">Plaidoirie</SelectItem>
                                <SelectItem value="DELIBERE">Délibéré</SelectItem>
                                <SelectItem value="EXECUTION">Exécution</SelectItem>
                                <SelectItem value="CLOTURE">Clôturé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Juridiction</Label>
                        <Input
                            placeholder="ex: Tribunal de Commerce de Dakar"
                            value={formData.jurisdiction}
                            onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Chambre / Juge</Label>
                        <Input
                            placeholder="ex: Chambre 2, Juge Faye"
                            value={formData.judge}
                            onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Partie Adverse</Label>
                        <Input
                            placeholder="Nom de l'adversaire"
                            value={formData.opposingParty}
                            onChange={(e) => setFormData({ ...formData, opposingParty: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Avocat Adverse</Label>
                        <Input
                            placeholder="Confrère"
                            value={formData.opposingCounsel}
                            onChange={(e) => setFormData({ ...formData, opposingCounsel: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label>Prochaine Audience</Label>
                        <Input
                            type="date"
                            value={formData.nextHearingDate}
                            onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
