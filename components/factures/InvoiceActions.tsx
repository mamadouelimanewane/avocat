
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, CreditCard, CheckCircle } from "lucide-react"
import { updateInvoiceStatus, registerPayment } from "@/app/actions"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

export function InvoiceActions({ facture }: { facture: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [amount, setAmount] = useState(facture.amountTTC - (facture.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0))
    const [method, setMethod] = useState("VIREMENT")

    const handleValidate = async () => {
        if (!confirm("Voulez-vous vraiment valider cette facture ? Elle ne sera plus modifiable.")) return
        setIsLoading(true)
        await updateInvoiceStatus(facture.id, "EMISE")
        setIsLoading(false)
    }

    const handlePayment = async () => {
        setIsLoading(true)
        const res = await registerPayment({
            factureId: facture.id,
            amount,
            method,
            date: new Date()
        })
        if (res.success) {
            setIsPaymentOpen(false)
        } else {
            alert(res.message)
        }
        setIsLoading(false)
    }

    const remaining = facture.amountTTC - (facture.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0)

    return (
        <div className="flex gap-2">
            {facture.status === 'BROUILLON' && (
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleValidate}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <Send className="mr-2 h-4 w-4" /> Valider & Émettre
                </Button>
            )}

            {(facture.status === 'EMISE' || facture.status === 'PARTIELLE') && (
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <CreditCard className="mr-2 h-4 w-4" /> Enregistrer Paiement
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enregistrer un règlement</DialogTitle>
                            <DialogDescription>
                                Montant restant à payer : <span className="font-bold text-slate-900">{formatCurrency(remaining)}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Montant reçu</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Mode de paiement</Label>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VIREMENT">Virement Bancaire</SelectItem>
                                        <SelectItem value="CHEQUE">Chèque</SelectItem>
                                        <SelectItem value="ESPECES">Espèces</SelectItem>
                                        <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handlePayment} disabled={isLoading}>
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
