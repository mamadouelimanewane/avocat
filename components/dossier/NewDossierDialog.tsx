'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { createDossier } from '@/app/actions' // We will link this soon
// For now, we simulate the action or import it if compatible

type ClientOption = {
    id: string
    name: string
}

export function NewDossierDialog({ clients, preSelectedClientId }: { clients: ClientOption[], preSelectedClientId?: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedClient, setSelectedClient] = useState(preSelectedClientId || "")

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await createDossier(null, formData)

        setLoading(false)
        if (result?.success) {
            setOpen(false)
            // Optional: Add toast notification here
        } else if (result?.errors) {
            setError("Veuillez vérifier les champs.")
        } else {
            setError(result?.message || "Une erreur est survenue")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Dossier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau dossier</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations principales pour ouvrir un nouveau dossier client.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reference" className="text-right">
                                Référence
                            </Label>
                            <Input
                                id="reference"
                                name="reference"
                                defaultValue={`DOS-${new Date().getFullYear()}-`}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Titre
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ex: Divorce Dupont c. Durand"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="client" className="text-right">
                                Client
                            </Label>
                            <div className="col-span-3">
                                <Select name="clientId" value={selectedClient} onValueChange={setSelectedClient} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Création...' : 'Créer le dossier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
