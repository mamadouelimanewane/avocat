"use client"

import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface WavePaymentButtonProps {
    amount: number
    invoiceId: string
}

export function WavePaymentButton({ amount, invoiceId }: WavePaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleWavePayment = () => {
        setIsLoading(true)

        // Simulation de l'intégration Wave Sénégal (Lien de paiement ou USSD Push)
        // En production, on appellerait une API comme PayTech ou le portail Wave Business
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Redirection Wave Sénégal",
                description: `Ouverture de l'application Wave pour régler ${amount.toLocaleString()} FCFA.`,
                className: "bg-sky-50 border-sky-200 text-sky-900"
            })

            // Simulation d'une redirection vers wave.com/pay/...
            window.open(`https://pay.wave.com/checkout?amount=${amount}&ref=${invoiceId}`, '_blank')
        }, 1200)
    }

    return (
        <Button
            onClick={handleWavePayment}
            disabled={isLoading}
            className="w-full bg-[#1da1f2] hover:bg-[#1a91da] text-white font-bold h-12 rounded-xl shadow-lg border-none flex items-center justify-center gap-3 transition-all active:scale-95"
        >
            {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <div className="bg-white p-1 rounded-full">
                        <Wallet className="h-4 w-4 text-[#1da1f2]" />
                    </div>
                    <span>Payer avec Wave Sénégal</span>
                </>
            )}
        </Button>
    )
}
