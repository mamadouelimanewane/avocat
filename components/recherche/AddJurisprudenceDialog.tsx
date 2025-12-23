
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Gavel } from "lucide-react"
import { createJurisprudence } from "@/app/actions"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function AddJurisprudenceDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        court: 'CCJA',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        summary: '',
        keywords: ''
    })

    const handleSave = async () => {
        setIsLoading(true)
        await createJurisprudence({
            ...formData,
            keywords: formData.keywords.split(',').map(k => k.trim()),
            date: new Date(formData.date)
        })
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une décision
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Téléverser / Saisir une jurisprudence</DialogTitle>
                    <DialogDescription>Ajoutez un nouvel arrêt à la base de connaissances.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Titre de l'arrêt</Label>
                        <Input
                            placeholder="ex: Arrêt N°15/2024 - Affaire X c/ Y"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Juridiction</Label>
                            <Select
                                value={formData.court}
                                onValueChange={(v) => setFormData({ ...formData, court: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CCJA">CCJA (Abidjan)</SelectItem>
                                    <SelectItem value="COUR_SUPREME">Cour Suprême</SelectItem>
                                    <SelectItem value="TRIBUNAL_COMMERCE">Tribunal Commerce</SelectItem>
                                    <SelectItem value="CA_DAKAR">Cour d'Appel Dakar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Date de la décision</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Référence (N° RG ou Arrêt)</Label>
                        <Input
                            placeholder="ex: J-2024-001"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Résumé / Sommaire</Label>
                        <Textarea
                            placeholder="Copiez ici le sommaire ou l'attendus de principe..."
                            className="h-32"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Mots-clés (séparés par virgule)</Label>
                        <Input
                            placeholder="saisie, contrat, rupture..."
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" className="mr-2">
                        <Upload className="mr-2 h-4 w-4" /> Joindre PDF (Simulé)
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
