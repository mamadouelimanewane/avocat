"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { updateUserPassword } from '@/app/actions'
import { Loader2, Check } from "lucide-react"

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false)
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        if (newPass !== confirmPass) {
            toast({
                title: "Erreur",
                description: "Les nouveaux mots de passe ne correspondent pas.",
                variant: "destructive"
            })
            setLoading(false)
            return
        }

        const res = await updateUserPassword(null, formData)

        if (res.success) {
            toast({
                title: "Succès",
                description: res.message,
            })
            // Reset form
            const form = document.querySelector('form') as HTMLFormElement
            form?.reset()
            setNewPass('')
            setConfirmPass('')
        } else {
            toast({
                title: "Erreur",
                description: res.message,
                variant: "destructive"
            })
        }
        setLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre compte.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input id="currentPassword" name="currentPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        Mettre à jour
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
