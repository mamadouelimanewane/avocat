"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    Smartphone,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Wallet
} from 'lucide-react'
import { processMobileMoneyPayment, type MobileMoneyProvider, type PaymentResult } from '@/lib/mobile-money'

interface MobileMoneyPaymentProps {
    factureId: string
    amount: number
    reference: string
    onPaymentSuccess?: () => void
    onPaymentFailed?: (error: string) => void
}

export function MobileMoneyPayment({
    factureId,
    amount,
    reference,
    onPaymentSuccess,
    onPaymentFailed
}: MobileMoneyPaymentProps) {
    const [provider, setProvider] = useState<MobileMoneyProvider>('ORANGE_MONEY')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)

    const handlePayment = async () => {
        setIsProcessing(true)
        setPaymentResult(null)

        try {
            const result = await processMobileMoneyPayment({
                provider,
                phoneNumber,
                amount,
                currency: 'XOF',
                reference,
                factureId
            })

            setPaymentResult(result)

            if (result.success) {
                // Simulate verification after 5 seconds
                setTimeout(() => {
                    if (result.status === 'SUCCESS') {
                        onPaymentSuccess?.()
                    }
                }, 5000)
            } else {
                onPaymentFailed?.(result.message)
            }

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erreur de paiement'
            setPaymentResult({
                success: false,
                message: errorMsg,
                status: 'FAILED'
            })
            onPaymentFailed?.(errorMsg)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatAmount = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(value)
    }

    const getProviderLogo = (prov: MobileMoneyProvider) => {
        const logos = {
            ORANGE_MONEY: '🟠',
            WAVE: '💙',
            FREE_MONEY: '🟢'
        }
        return logos[prov]
    }

    return (
        <Card className="border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle className="text-emerald-900">Paiement Mobile Money</CardTitle>
                        <CardDescription>Payez facilement par téléphone</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Amount Display */}
                <div className="p-4 bg-white rounded-lg border-2 border-emerald-200">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600">Montant à payer</span>
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-emerald-600" />
                            <span className="text-2xl font-bold text-emerald-900">{formatAmount(amount)}</span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Référence: <span className="font-mono font-semibold">{reference}</span>
                    </div>
                </div>

                {/* Provider Selection */}
                <div className="space-y-2">
                    <Label>Opérateur Mobile Money</Label>
                    <Select value={provider} onValueChange={(v) => setProvider(v as MobileMoneyProvider)}>
                        <SelectTrigger className="h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ORANGE_MONEY">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getProviderLogo('ORANGE_MONEY')}</span>
                                    <span className="font-semibold">Orange Money</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="WAVE">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getProviderLogo('WAVE')}</span>
                                    <span className="font-semibold">Wave</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="FREE_MONEY">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getProviderLogo('FREE_MONEY')}</span>
                                    <span className="font-semibold">Free Money</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                    <Label>Numéro de téléphone</Label>
                    <Input
                        type="tel"
                        placeholder="+221 77 123 45 67"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 text-lg"
                        disabled={isProcessing}
                    />
                    <p className="text-xs text-slate-500">
                        Format: +221 XX XXX XX XX
                    </p>
                </div>

                {/* Payment Result */}
                {paymentResult && (
                    <div className={`p-4 rounded-lg border-2 ${paymentResult.success
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {paymentResult.success ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-semibold ${paymentResult.success ? 'text-emerald-900' : 'text-red-900'
                                        }`}>
                                        {paymentResult.success ? 'Transaction initiée' : 'Échec du paiement'}
                                    </span>
                                    <Badge variant={paymentResult.status === 'SUCCESS' ? 'default' : 'secondary'}>
                                        {paymentResult.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-700">{paymentResult.message}</p>
                                {paymentResult.transactionId && (
                                    <p className="text-xs text-slate-500 mt-2 font-mono">
                                        ID: {paymentResult.transactionId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Instructions */}
                {paymentResult?.success && paymentResult.status === 'PENDING' && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Instructions de paiement
                        </h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            {provider === 'ORANGE_MONEY' && (
                                <>
                                    <li>Composez <span className="font-mono font-bold">#144#</span> sur votre téléphone Orange</li>
                                    <li>Vérifiez le montant et la référence</li>
                                    <li>Entrez votre code secret pour confirmer</li>
                                    <li>Vous recevrez un SMS de confirmation</li>
                                </>
                            )}
                            {provider === 'WAVE' && (
                                <>
                                    <li>Ouvrez l&apos;application Wave sur votre téléphone</li>
                                    <li>Vérifiez la notification de paiement</li>
                                    <li>Confirmez avec votre code PIN ou empreinte digitale</li>
                                    <li>Le paiement sera validé instantanément</li>
                                </>
                            )}
                            {provider === 'FREE_MONEY' && (
                                <>
                                    <li>Composez <span className="font-mono font-bold">*145#</span> sur votre téléphone Free</li>
                                    <li>Sélectionnez l&apos;option &quot;Paiement marchand&quot;</li>
                                    <li>Entrez le code de transaction</li>
                                    <li>Confirmez avec votre code secret</li>
                                </>
                            )}
                        </ol>
                    </div>
                )}

                {/* Action Button */}
                <Button
                    onClick={handlePayment}
                    disabled={!phoneNumber || isProcessing || (paymentResult?.success && paymentResult.status === 'PENDING')}
                    className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Traitement en cours...
                        </>
                    ) : paymentResult?.success && paymentResult.status === 'PENDING' ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            En attente de confirmation
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Payer {formatAmount(amount)}
                        </>
                    )}
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-center text-slate-500 pt-2 border-t">
                    🔒 Paiement sécurisé et chiffré • Aucune donnée bancaire n&apos;est stockée
                </div>
            </CardContent>
        </Card>
    )
}
