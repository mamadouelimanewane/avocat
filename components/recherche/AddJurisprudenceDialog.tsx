
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Gavel, Book } from "lucide-react"
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
        type: 'JURISPRUDENCE',
        court: 'CCJA',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        content: '', // Replaces summary for wider use
        keywords: ''
    })

    const handleSave = async () => {
        setIsLoading(true)
        await createJurisprudence({
            title: formData.title,
            type: formData.type,
            court: formData.type === 'JURISPRUDENCE' ? formData.court : 'LEGISLATEUR',
            date: new Date(formData.date),
            reference: formData.reference,
            summary: formData.content.substring(0, 200) + "...", // Auto-summary
            content: formData.content, // Full text for RAG
            keywords: formData.keywords.split(',').map(k => k.trim()),
        })
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter Document (RAG)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Enrichir la Base de Connaissance</DialogTitle>
                    <DialogDescription>Ajoutez une jurisprudence, une loi ou un acte uniforme pour alimenter l'IA.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Type de Document</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="JURISPRUDENCE">Jurisprudence (Arrêt)</SelectItem>
                                    <SelectItem value="LOI">Loi / Code / Acte Uniforme</SelectItem>
                                    <SelectItem value="DOCTRINE">Doctrine / Article</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Date (Décision/Promulgation)</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>{formData.type === 'LOI' ? 'Titre de la Loi / Acte' : "Titre de l'arrêt"}</Label>
                        <Input
                            placeholder={formData.type === 'LOI' ? "ex: Acte Uniforme portant droit commercial général" : "ex: Arrêt N°15 - Affaire X c/ Y"}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {formData.type === 'JURISPRUDENCE' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Juridiction</Label>
                                <Select
                                    value={formData.court}
                                    onValueChange={(v) => setFormData({ ...formData, court: v })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CCJA">CCJA (Abidjan)</SelectItem>
                                        <SelectItem value="COUR_SUPREME">Cour Suprême</SelectItem>
                                        <SelectItem value="TRIBUNAL_COMMERCE">Tribunal Commerce</SelectItem>
                                        <SelectItem value="CA_DAKAR">Cour d'Appel Dakar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Référence (N° RG)</Label>
                                <Input
                                    placeholder="ex: J-2024-001"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Contenu Intégral (Texte brut ou Extrait)</Label>
                        <Textarea
                            placeholder="Copiez ici le texte de loi ou l'arrêt complet pour que l'IA puisse l'analyser..."
                            className="h-48 font-mono text-xs"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <p className="text-xs text-slate-500">C'est ce texte qui servira de base aux réponses de l'IA (RAG).</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Mots-clés / Tags</Label>
                        <Input
                            placeholder="transport, maritime, ohada, saisie..."
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" className="mr-2">
                        <Upload className="mr-2 h-4 w-4" /> Import PDF (OCR)
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>Enregistrer dans la Base</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
