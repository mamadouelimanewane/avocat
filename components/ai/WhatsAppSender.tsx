"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    MessageCircle,
    Send,
    User,
    Briefcase,
    ShieldCheck,
    Smartphone,
    ExternalLink
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { logCommunication } from "@/app/actions"

export function WhatsAppSender() {
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [clientName, setClientName] = useState("")
    const { toast } = useToast()

    const handleSend = () => {
        if (!phone || !message) {
            toast({
                title: "Champs manquants",
                description: "Veuillez saisir un numéro et un message.",
                variant: "destructive"
            })
            return
        }

        // Format phone number: remove spaces and handle +221 or start with 7
        let formattedPhone = phone.replace(/\s/g, "")
        if (formattedPhone.startsWith("7")) {
            formattedPhone = "221" + formattedPhone
        } else if (formattedPhone.startsWith("00221")) {
            formattedPhone = formattedPhone.substring(2)
        }

        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
        window.open(url, "_blank")

        logCommunication({
            type: "WHATSAPP",
            direction: "OUTBOUND",
            content: message,
            dossierId: null // Optional in this quick sender
        })

        toast({
            title: "WhatsApp ouvert",
            description: "Le message a été préparé dans WhatsApp."
        })
    }

    const setQuickTemplate = (type: string) => {
        const name = clientName || "[Nom du Client]"
        switch (type) {
            case 'RDV':
                setMessage(`Bonjour Maître, je vous confirme notre rendez-vous au cabinet LexPremium le [Date] à [Heure]. Cordialement, Me Ndiaye.`)
                break
            case 'DOCS':
                setMessage(`Bonjour ${name}, nous sommes toujours en attente des pièces complémentaires pour votre dossier [Référence]. Pouvez-vous nous les transmettre par email ou WhatsApp ? Merci.`)
                break
            case 'AUDIENCE':
                setMessage(`Bonjour ${name}, je vous informe que l'audience pour votre affaire a été renvoyée au [Date]. Je reviens vers vous rapidement. Cordialement.`)
                break
        }
    }

    return (
        <Card className="border-[#25D366]/30 shadow-sm">
            <CardHeader className="bg-[#25D366]/5 pb-3">
                <CardTitle className="text-[#075E54] flex items-center gap-2">
                    <div className="bg-[#25D366] p-2 rounded-full text-white shadow-sm">
                        <MessageCircle className="h-4 w-4" />
                    </div>
                    WhatsApp Quick-Sender Professional
                </CardTitle>
                <CardDescription>Envoyez des mises à jour rapides et sécurisées.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500">Destinataire (Nom)</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="M. Sarr..."
                                className="pl-9"
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500">Numéro WhatsApp</Label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="77 123 45 67"
                                className="pl-9"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-slate-500">Message</Label>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] bg-slate-100" onClick={() => setQuickTemplate('RDV')}>Rappel RDV</Button>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] bg-slate-100" onClick={() => setQuickTemplate('DOCS')}>Relance Pièces</Button>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] bg-slate-100" onClick={() => setQuickTemplate('AUDIENCE')}>Info Audience</Button>
                        </div>
                    </div>
                    <Textarea
                        placeholder="Tapez votre message ici..."
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 shadow-md group"
                    onClick={handleSend}
                >
                    Envoyer via WhatsApp Web
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700">
                        Chaque envoi est historisé dans le registre de communication du dossier pour garantir la traçabilité de vos échanges professionnels.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
