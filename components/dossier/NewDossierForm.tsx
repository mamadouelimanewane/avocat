
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createDossier } from '@/app/actions'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

type ClientOption = {
    id: string
    name: string
}

export default function NewDossierForm({ clients }: { clients: ClientOption[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await createDossier(null, formData)

        setLoading(false)
        if (result?.success) {
            router.push('/dossiers')
            router.refresh()
        } else if (result?.errors) {
            setError("Veuillez vérifier les champs.")
        } else {
            setError(result?.message || "Une erreur est survenue")
        }
    }

    return (
        <form action={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Informations du Dossier</CardTitle>
                    <CardDescription>
                        Renseignez les détails initiaux pour l'ouverture du dossier.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="reference">Référence Interne</Label>
                            <Input
                                id="reference"
                                name="reference"
                                defaultValue={`DOS-${new Date().getFullYear()}-`}
                                placeholder="DOS-2024-001"
                                required
                            />
                            <p className="text-[0.8rem] text-slate-500">
                                Identifiant unique pour le classement.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Intitulé de l'affaire</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ex: Divorce Dupont c. Durand"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <Select name="clientId" required>
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

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/dossiers">Annuler</Link>
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
                            {loading ? (
                                'Création en cours...'
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Créer le Dossier
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
