
"use client"

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { loginClient } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Scale, ShieldCheck } from 'lucide-react'

const initialState = {
    success: false,
    message: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={pending}>
            {pending ? "Vérification..." : "Accéder à mon espace"}
        </Button>
    )
}

export default function PortalLoginPage() {
    const [state, formAction] = useFormState(loginClient, initialState)

    if (state.success) {
        window.location.href = '/portal'
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50">
                <div className="text-center animate-pulse text-indigo-800">Accès autorisé. Redirection vers votre espace...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
            <Card className="w-full max-w-md shadow-xl border-indigo-100">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="bg-indigo-600 p-3 rounded-full shadow-lg">
                            <Scale className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Espace Client Sécurisé</CardTitle>
                    <CardDescription>Consultez vos dossiers et factures en temps réel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Votre Email</Label>
                            <Input id="email" name="email" type="email" placeholder="client@exemple.com" required className="border-indigo-100 focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="code">Code d'accès</Label>
                                <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Code perdu ?</span>
                            </div>
                            <Input id="code" name="code" type="password" placeholder="••••" required className="border-indigo-100 focus:border-indigo-500 tracking-widest" />
                        </div>
                        {state.message && (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md flex items-center gap-2 border border-red-100">
                                <ShieldCheck className="h-4 w-4" /> {state.message}
                            </div>
                        )}
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-4 text-center text-sm text-slate-400">
                    <div className="flex items-center justify-center gap-2 w-full text-xs">
                        <ShieldCheck className="h-3 w-3" /> Connexion chiffrée SSL 256-bit
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
