
"use client"

import { useState } from "react"
import { Plus, Box, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { createArchiveBox } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function NewArchiveBoxDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const code = formData.get('code') as string
        const location = formData.get('location') as string
        const description = formData.get('description') as string

        const res = await createArchiveBox({ code, location, description })
        setLoading(false)

        if (res) {
            toast({ title: "Boîte créee", description: `La boîte d'archives ${code} a été enregistrée.` })
            setIsOpen(false)
            router.refresh()
        } else {
            toast({ title: "Erreur", description: "Impossible de créer la boîte.", variant: "destructive" })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white shadow-lg hover:shadow-xl transition-all">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Boîte d'Archives
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Box className="w-6 h-6 text-slate-600" />
                    </div>
                    <DialogTitle>Nouvelle Boîte d'Archives</DialogTitle>
                    <DialogDescription>
                        Créez un nouvel emplacement physique pour le stockage de vos dossiers clos.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-xs font-bold uppercase text-slate-500">Code de la Boîte</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input id="code" name="code" placeholder="Ex: BOX-2025-001" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-xs font-bold uppercase text-slate-500">Localisation Physique</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input id="location" name="location" placeholder="Ex: Salle Archives B, Rayon 4" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase text-slate-500">Description / Contenu (Optionnel)</Label>
                            <Textarea id="description" name="description" placeholder="Détails sur le type de dossiers stockés..." className="min-h-[100px]" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={loading} className="bg-slate-900 text-white">
                            {loading ? 'Création...' : 'Enregistrer la boîte'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
