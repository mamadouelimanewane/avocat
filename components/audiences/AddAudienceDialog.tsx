
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Gavel, Calendar } from "lucide-react"
import { createAudience } from "@/app/actions"
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

export function AddAudienceDialog({ dossiers }: { dossiers: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [title, setTitle] = useState("Audience de Mise en État")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("09:00")
    const [location, setLocation] = useState("Tribunal de Dakar")
    const [dossierId, setDossierId] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = async () => {
        setIsLoading(true)
        // Combine date and time
        const fullDate = new Date(`${date}T${time}:00`)

        await createAudience({
            title,
            date: fullDate,
            location,
            dossierId: dossierId || undefined,
            description
        })

        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Gavel className="mr-2 h-4 w-4" /> Nouvelle Audience
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une audience au Rôle</DialogTitle>
                    <DialogDescription>Planifiez une nouvelle date pour un dossier.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Type d'audience</Label>
                        <Select value={title} onValueChange={setTitle}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Audience de Mise en État">Mise en État</SelectItem>
                                <SelectItem value="Audience de Plaidoirie">Plaidoirie</SelectItem>
                                <SelectItem value="Délibéré">Délibéré</SelectItem>
                                <SelectItem value="Référé">Référé</SelectItem>
                                <SelectItem value="Conciliation">Conciliation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Dossier Concerné</Label>
                        <Select value={dossierId} onValueChange={setDossierId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un dossier..." />
                            </SelectTrigger>
                            <SelectContent>
                                {dossiers.map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.reference} - {d.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Heure (Appel)</Label>
                            <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Juridiction / Salle</Label>
                        <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Tribunal de Commerce, Salle 2" />
                    </div>

                    <div className="grid gap-2">
                        <Label>Notes / Instructions</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions pour l'avocat..." />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Planification...' : 'Inscrire au Rôle'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
