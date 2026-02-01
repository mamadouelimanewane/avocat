"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function EmailSender() {
    const [to, setTo] = useState("mamadouelimane@gmail.com")
    const [subject, setSubject] = useState("Test Communication - LexPremium Pro")
    const [message, setMessage] = useState(`Bonjour M. Wane,

Ceci est un email de test automatique depuis votre système LexPremium Pro.

Cette fonctionnalité permet d'envoyer des notifications clients, des rappels d'audiences, et des confirmations de rendez-vous directement depuis l'application.

Cordialement,
Le Cabinet LexPremium`)
    const [isSending, setIsSending] = useState(false)
    const { toast } = useToast()

    const handleSend = async () => {
        if (!to || !subject || !message) {
            toast({
                title: "Champs manquants",
                description: "Veuillez remplir tous les champs.",
                variant: "destructive"
            })
            return
        }

        setIsSending(true)

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to,
                    subject,
                    html: message.replace(/\n/g, '<br>')
                })
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "✅ Email envoyé",
                    description: "Le message a été transmis avec succès."
                })
                // Clear message after send
                setMessage("")
            } else if (result.fallback) {
                // Open mailto link as fallback
                window.location.href = result.mailtoLink
                toast({
                    title: "Ouverture du client email",
                    description: "Clé API non configurée. Utilisation du client email par défaut."
                })
            } else {
                throw new Error(result.error || "Échec de l'envoi")
            }
        } catch (error: any) {
            toast({
                title: "Erreur d'envoi",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Card className="border-blue-200">
            <CardHeader className="bg-blue-50/50 pb-3">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-full text-white shadow-sm">
                        <Mail className="h-4 w-4" />
                    </div>
                    Email Professional Sender
                </CardTitle>
                <CardDescription>Envoyez des notifications et rappels par email.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Destinataire</Label>
                    <Input
                        type="email"
                        placeholder="client@example.com"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Objet</Label>
                    <Input
                        placeholder="Objet du message..."
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Message</Label>
                    <Textarea
                        placeholder="Votre message..."
                        rows={8}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md"
                    onClick={handleSend}
                    disabled={isSending}
                >
                    {isSending ? "Envoi en cours..." : "Envoyer l'Email"}
                    <Send className="ml-2 h-4 w-4" />
                </Button>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700">
                        <strong>Configuration requise :</strong> Pour l'envoi réel, ajoutez votre clé API Resend dans le fichier .env (RESEND_API_KEY). Sinon, le système ouvrira votre client email par défaut.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
