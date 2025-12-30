
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginClientPortal } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { Landmark, ShieldCheck, Mail, Key, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function ClientLoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const email = formData.get('email') as string
        const code = formData.get('code') as string

        setLoading(true)
        const res = await loginClientPortal(email, code)
        setLoading(false)

        if (res.success && res.clientId) {
            // Store simple session in localStorage for MVP
            localStorage.setItem('client_session', JSON.stringify({
                id: res.clientId,
                name: res.name
            }))
            toast({ title: "Connexion réussie", description: `Bienvenue, ${res.name}` })
            router.push('/portal')
        } else {
            toast({
                title: "Échec de connexion",
                description: res.message || "Email ou code incorrect.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Landmark className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Espace Client LexApp</h1>
                    <p className="text-slate-500 mt-2">Accédez à vos dossiers, documents et factures en toute sécurité.</p>
                </div>

                <Card className="border-slate-200 shadow-xl overflow-hidden">
                    <div className="h-1.5 bg-slate-900 w-full" />
                    <CardHeader>
                        <CardTitle>Connexion Sécurisée</CardTitle>
                        <CardDescription>
                            Utilisez l'email et le code d'accès fournis par votre avocat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Votre Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input id="email" name="email" type="email" placeholder="client@exemple.sn" className="pl-10" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-slate-700">Code d'accès (PIN)</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input id="code" name="code" type="password" placeholder="••••••" className="pl-10 tracking-widest" required />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 h-11 text-white shadow-lg">
                                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                Accéder à mon espace
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center space-y-4">
                    <p className="text-xs text-slate-400 italic">
                        © 2025 LexApp Avocat. Tous vos échanges sont protégés par le secret professionnel et le chiffrement de bout-en-bout.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#" className="text-xs text-slate-500 hover:underline">Support</a>
                        <a href="#" className="text-xs text-slate-500 hover:underline">Mentions Légales</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
