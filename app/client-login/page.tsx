"use client"

import { useFormState, useFormStatus } from 'react-dom'
import { verifyClientAccessCode } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Globe, Lock } from 'lucide-react'

const initialState = {
    success: false,
    message: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={pending}>
            {pending ? "Vérification..." : "Accéder à mon espace"}
        </Button>
    )
}

// Wrapper for the server action to match useFormState signature if needed
async function clientLoginAction(prevState: any, formData: FormData) {
    const code = formData.get('code') as string
    const result = await verifyClientAccessCode(code)

    if (result.success) {
        return { success: true, message: 'Démarrage...' }
    } else {
        return { success: false, message: result.message || 'Erreur' }
    }
}

export default function ClientLoginPage() {
    const [state, formAction] = useFormState(clientLoginAction, initialState)

    if (state.success) {
        // Redirect to portal
        window.location.href = '/portal'
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center animate-pulse text-indigo-600 font-medium">Connexion sécurisée en cours...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-md shadow-xl border-indigo-100">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="bg-indigo-600 p-3 rounded-full">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Portail Client</CardTitle>
                    <CardDescription>Accédez à vos dossiers en toute sécurité</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code d'accès (reçu par email)</Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                placeholder="Ex: 123456"
                                className="text-center text-2xl tracking-[0.5em] font-mono"
                                maxLength={6}
                                required
                            />
                        </div>

                        {state.message && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded flex items-center gap-2 justify-center">
                                <Lock className="h-4 w-4" /> {state.message}
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-slate-500 justify-center flex-col gap-2">
                    <p>Sécurisé par chiffrement de bout en bout.</p>
                    <p className="text-xs">En cas de problème, contactez le cabinet.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
