'use client'

import { useState, useEffect } from 'react'
import { UserPlus } from 'lucide-react'
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
import { createClient } from '@/app/actions'
import { useSearchParams, useRouter } from 'next/navigation'

export function NewClientDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setOpen(true)
            // Remove the query param once opened
            const params = new URLSearchParams(searchParams.toString())
            params.delete('new')
            router.replace(`/clients?${params.toString()}`, { scroll: false })
        }
    }, [searchParams, router])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            type: formData.get('type') as string,
            address: formData.get('address') as string,
            status: formData.get('status') as string,
        }

        const result = await createClient(data)

        setLoading(false)
        if (result?.success) {
            setOpen(false)
            // Refresh path is handled by revalidatePath in action
        } else {
            setError(result?.message || "Une erreur est survenue")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouveau client</DialogTitle>
                    <DialogDescription>
                        Saisissez les coordonnées du client ou de l'entreprise.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nom complet
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Jean Dupont ou Entreprise SARL"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <div className="col-span-3">
                                <Select name="type" defaultValue="PARTICULIER">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PARTICULIER">Particulier</SelectItem>
                                        <SelectItem value="ENTREPRISE">Entreprise / PMO</SelectItem>
                                        <SelectItem value="ORGANISATION">Organisation / Association</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="contact@example.com"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Téléphone
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="+221 XX XXX XX XX"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Adresse
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Quartier, Rue, Ville"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Statut
                            </Label>
                            <div className="col-span-3">
                                <Select name="status" defaultValue="CLIENT">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Statut commercial" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PROSPECT">Prospect</SelectItem>
                                        <SelectItem value="CLIENT">Client Actif</SelectItem>
                                        <SelectItem value="ANCIEN_CLIENT">Ancien Client</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                            {loading ? 'Création...' : 'Créer le client'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
