
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Plus } from "lucide-react"
import { addDirectoryContact } from "@/app/actions"
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

export function AddContactDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [category, setCategory] = useState("HUISSIER")
    const [speciality, setSpeciality] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [city, setCity] = useState("Dakar")
    const [notes, setNotes] = useState("")

    const handleSubmit = async () => {
        setIsLoading(true)
        const res = await addDirectoryContact({
            name,
            category,
            speciality,
            phone,
            email,
            city,
            notes
        })

        setIsLoading(false)
        if (res.success) {
            setIsOpen(false)
            // Reset
            setName("")
            setCategory("HUISSIER")
            setPhone("")
            setEmail("")
        } else {
            alert("Erreur")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un Contact
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nouveau Contact</DialogTitle>
                    <DialogDescription>Ajouter un partenaire à l'annuaire du cabinet.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Nom / Raison Sociale</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Me Ndiaye..." />
                    </div>

                    <div className="grid gap-2">
                        <Label>Catégorie</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HUISSIER">Huissier de Justice</SelectItem>
                                <SelectItem value="AVOCAT">Avocat / Confrère</SelectItem>
                                <SelectItem value="NOTAIRE">Notaire</SelectItem>
                                <SelectItem value="EXPERT">Expert Judiciaire</SelectItem>
                                <SelectItem value="GREFFE">Greffe / Juridiction</SelectItem>
                                <SelectItem value="AUTRE">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Spécialité (Optionnel)</Label>
                        <Input value={speciality} onChange={e => setSpeciality(e.target.value)} placeholder="Ex: Immobilier, Maritime..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Téléphone</Label>
                            <Input value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ville</Label>
                            <Input value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Notes</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Enregistrement...' : 'Ajouter'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
