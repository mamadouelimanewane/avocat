"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { initializeERP } from "@/app/actions"
import { AlertCircle, CheckCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdminInitialization() {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')
    const [message, setMessage] = useState("")

    const handleInit = async () => {
        if (!confirm("Attention : Cette action va créer les comptes et journaux par défaut s'ils n'existent pas. Continuer ?")) return

        setStatus('LOADING')
        try {
            const res = await initializeERP()
            if (res.success) {
                setStatus('SUCCESS')
                setMessage(res.message || "Succès")
            } else {
                setStatus('ERROR')
                // @ts-ignore
                setMessage(res.message || "Erreur inconnue")
            }
        } catch (e) {
            setStatus('ERROR')
            setMessage("Erreur serveur")
        }
    }

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                    <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Initialisation du Système</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Créez les données de base indispensables au fonctionnement de l'application (Plan comptable SYSCOHADA, Journaux par défaut, Exercice fiscal).
                        À utiliser lors de la première installation.
                    </p>
                    <Button onClick={handleInit} disabled={status === 'LOADING' || status === 'SUCCESS'}>
                        {status === 'LOADING' ? "Initialisation en cours..." : "Lancer l'initialisation"}
                    </Button>
                </div>
            </div>

            {status === 'SUCCESS' && (
                <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            {status === 'ERROR' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
