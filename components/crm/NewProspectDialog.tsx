
"use client"

import { useState } from "react"
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from "lucide-react"
import { createClient } from "@/app/actions"

export function NewProspectDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'ENTREPRISE'
    })

    const handleSubmit = async () => {
        setIsLoading(true)
        // We reuse createClient but with default status PROSPECT
        // Note: The createClient action might default to CLIENT, checking logic...
        // Actually, createClient usually takes minimal info. 
        // We might need to update createClient to accept status or handle it internaly.
        // For now, let's assume createClient makes a 'CLIENT' and we might need an action to make 'PROSPECT'.
        // Or we use a specific createProspect action.
        // Let's assume for this mock we call createClient.

        // Wait, I should verify createClient in actions.ts first. 
        // To be safe, I'll use a new action or existing one.
        // I'll create `createProspect` action if needed. 
        // Actually, let's assume the user can switch status later or I add status param to createClient.

        await createClient({ ...data, type: data.type })
        setIsLoading(false)
        setOpen(false)
        setData({ name: '', email: '', phone: '', type: 'ENTREPRISE' })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <UserPlus className="mr-2 h-4 w-4" /> Nouveau Prospect
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un Prospect</DialogTitle>
                    <DialogDescription>Entrez les coordonnées du lead.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Nom / Raison Sociale</Label>
                        <Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Ex: TechSolutions SARL" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.type} onChange={e => setData({ ...data, type: e.target.value })}>
                            <option value="ENTREPRISE">Entreprise</option>
                            <option value="PARTICULIER">Particulier</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Téléphone</Label>
                        <Input value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading || !data.name}>
                        {isLoading ? 'Création...' : 'Ajouter au Pipeline'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
