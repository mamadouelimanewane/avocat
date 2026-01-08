"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, Loader2 } from "lucide-react"

export default function CreateUserPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        role: "AVOCAT"
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                toast({
                    title: "✅ Utilisateur créé",
                    description: `${formData.name} peut maintenant se connecter avec ${formData.email}`
                })

                // Reset form
                setFormData({
                    email: "",
                    password: "",
                    name: "",
                    role: "AVOCAT"
                })
            } else {
                toast({
                    title: "❌ Erreur",
                    description: data.message || "Impossible de créer l'utilisateur",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "❌ Erreur réseau",
                description: "Impossible de contacter le serveur",
                variant: "destructive"
            })
        }

        setLoading(false)
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-6 w-6" />
                        Créer un Nouvel Utilisateur
                    </CardTitle>
                    <CardDescription>
                        Ajouter un utilisateur qui pourra se connecter à l'application
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="utilisateur@exemple.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe *</Label>
                            <Input
                                id="password"
                                type="text"
                                required
                                minLength={8}
                                placeholder="Minimum 8 caractères"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                L'utilisateur pourra changer son mot de passe après la première connexion
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                placeholder="Prénom Nom"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Rôle *</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                                    <SelectItem value="AVOCAT">Avocat</SelectItem>
                                    <SelectItem value="ASSISTANT">Assistant</SelectItem>
                                    <SelectItem value="COMPTABLE">Comptable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Créer l'Utilisateur
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
