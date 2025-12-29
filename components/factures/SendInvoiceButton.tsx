"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SendInvoiceButton({ facture }: { facture: any }) {
    const [open, setOpen] = useState(false)
    const [sending, setSending] = useState(false)
    const [email, setEmail] = useState(facture.client?.email || "")
    const [subject, setSubject] = useState(`Facture ${facture.number} - ${facture.client?.name || 'Cabinet LexPremium'}`)
    const [message, setMessage] = useState(`Bonjour ${facture.client?.name || 'Cher client'},\n\nVeuillez trouver ci-joint votre facture n°${facture.number} datée du ${new Date(facture.issueDate).toLocaleDateString()}. \n\nNous restons à votre disposition pour toute précision.\n\nCordialement,\n\nVotre Avocat.`)

    const handleSend = async () => {
        if (!email) {
            toast({
                title: "Email manquant",
                description: "Veuillez saisir une adresse email valide.",
                variant: "destructive"
            })
            return
        }

        setSending(true)

        // Simulation d'envoi par email (API call would go here)
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast({
            title: "Facture envoyée",
            description: `L'email a été envoyé avec succès à ${email}.`,
            className: "bg-indigo-50 border-indigo-200 text-indigo-900"
        })

        setSending(false)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Send className="mr-2 h-4 w-4" /> Envoyer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Envoyer la facture par email</DialogTitle>
                    <DialogDescription>
                        Vérifiez les informations et personnalisez le message pour le client.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Destinataire (Email)</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="client@exemple.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Objet de l'email</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[150px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
                        Annuler
                    </Button>
                    <Button onClick={handleSend} disabled={sending} className="bg-indigo-900 hover:bg-indigo-800 text-white">
                        {sending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" /> Envoyer l'email
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
