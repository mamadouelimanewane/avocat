
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { loginStaff } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Scale, Lock } from 'lucide-react'

const initialState = {
    success: false,
    message: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={pending}>
            {pending ? "Connexion..." : "Se connecter"}
        </Button>
    )
}

export default function LoginPage() {
    const [state, formAction] = useFormState(loginStaff, initialState)

    if (state.success) {
        // Redirect client-side to enforce full reload/navigation
        window.location.href = '/'
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center animate-pulse">Connexion réussie, redirection...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="bg-slate-900 p-3 rounded-full">
                            <Scale className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Cabinet LexPremium</CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                        <span>Espace Personnel / Collaborateurs</span>
                        <Link href="/portal/login" className="text-amber-600 hover:text-amber-700 font-medium text-xs underline decoration-amber-200 underline-offset-4">
                            Vous êtes client ? Accédez à votre portail ici
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Identifiant / Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="votre@email.com"
                                required
                                className="bg-white text-slate-900 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-white text-slate-900 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                            />
                        </div>
                        {state.message && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded flex items-center gap-2">
                                <Lock className="h-4 w-4" /> {state.message}
                            </div>
                        )}
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-slate-500 justify-center">
                    &copy; 2025 LexPremium ERP
                </CardFooter>
            </Card>
        </div>
    )
}
