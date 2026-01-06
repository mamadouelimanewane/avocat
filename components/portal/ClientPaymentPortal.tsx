"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Smartphone,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Zap,
    Loader2,
    Lock,
    ExternalLink,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

interface PaymentPortalProps {
    invoiceId: string
    amount: number
    clientName: string
}

export function ClientPaymentPortal({ invoiceId, amount, clientName }: PaymentPortalProps) {
    const [method, setMethod] = useState<'WAVE' | 'OM'>('WAVE')
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<'SELECT' | 'REDIRECT' | 'SUCCESS'>('SELECT')

    const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'

    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulation d'appel API Mobile Money
        await new Promise(resolve => setTimeout(resolve, 2000))
        setStep('REDIRECT')

        // Simuler une redirection puis un succès automatique après 3s
        setTimeout(() => {
            setStep('SUCCESS')
            setIsProcessing(false)
            toast({
                title: "Paiement Confirmé !",
                description: `Votre règlement de ${formattedAmount} a été validé.`,
            })
        }, 4000)
    }

    return (
        <Card className="max-w-md mx-auto border-none shadow-2xl overflow-hidden bg-white">
            <AnimatePresence mode="wait">
                {step === 'SELECT' && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <CardHeader className="bg-slate-900 text-white p-8">
                            <div className="flex justify-between items-start mb-4">
                                <Badge className="bg-indigo-600">PORTAIL CLIENT SÉCURISÉ</Badge>
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <CardTitle className="text-3xl font-black">{formattedAmount}</CardTitle>
                            <CardDescription className="text-slate-400">Règlement de la facture <span className="text-white font-bold">#{invoiceId}</span></CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Choisir le mode de paiement</Label>
                                <RadioGroup defaultValue="WAVE" className="grid grid-cols-1 gap-3" onValueChange={(v: any) => setMethod(v as any)}>
                                    <PaymentOption
                                        id="WAVE"
                                        label="Wave"
                                        description="Payer avec votre application Wave"
                                        color="blue"
                                        logo={<div className="h-8 w-8 bg-sky-400 rounded-full flex items-center justify-center font-black text-white text-[10px]">W</div>}
                                    />
                                    <PaymentOption
                                        id="OM"
                                        label="Orange Money"
                                        description="Code USSD ou Application OM"
                                        color="orange"
                                        logo={<div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center font-black text-white text-[10px]">OM</div>}
                                    />
                                </RadioGroup>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5" />
                                <p className="text-[11px] text-slate-500 font-medium">
                                    En cliquant sur "Procéder au paiement", vous allez être redirigé vers l'interface sécurisée de <span className="font-bold">{method === 'WAVE' ? 'Wave' : 'Orange Money'}</span>.
                                </p>
                            </div>

                            <Button
                                className={`w-full h-14 rounded-2xl text-lg font-black transition-all ${isProcessing ? 'bg-slate-100' : 'bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Procéder au paiement <ArrowRight className="h-5 w-5" />
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </motion.div>
                )}

                {step === 'REDIRECT' && (
                    <motion.div
                        key="redirect"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center space-y-8"
                    >
                        <div className="relative mx-auto h-24 w-24 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`absolute inset-0 rounded-full opacity-20 ${method === 'WAVE' ? 'bg-sky-500' : 'bg-orange-500'}`}
                            />
                            <Smartphone className={`h-12 w-12 ${method === 'WAVE' ? 'text-sky-600' : 'text-orange-600'}`} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 italic">Redirection vers {method === 'WAVE' ? 'Wave' : 'Orange Money'}...</h3>
                            <p className="text-sm text-slate-500 font-medium">Veuillez valider la transaction sur votre téléphone.</p>
                        </div>
                        <div className="flex justify-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                    </motion.div>
                )}

                {step === 'SUCCESS' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center space-y-8"
                    >
                        <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Paiement Réussi !</h3>
                            <p className="text-sm text-slate-500 font-medium px-4">
                                Votre paiement de <span className="font-bold text-slate-900">{formattedAmount}</span> a été traité avec succès.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Numéro de Reçu</p>
                                <p className="text-xs font-black text-slate-900">LEX-PAY-8829-192</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl" onClick={() => window.location.reload()}>
                            Retour au portail
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-slate-50 p-4 border-t flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sécurisé par LexPay</span>
                </div>
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Certifié PCI-DSS</span>
                </div>
            </div>
        </Card>
    )
}

function PaymentOption({ id, label, description, color, logo }: { id: string, label: string, description: string, color: string, logo: any }) {
    return (
        <Label
            htmlFor={id}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all [&:has([data-state=checked])]:border-indigo-600 [&:has([data-state=checked])]:bg-indigo-50/30"
        >
            <RadioGroupItem value={id} id={id} className="sr-only" />
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {logo}
            </div>
            <div className="flex-1">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{label}</p>
                <p className="text-[10px] font-medium text-slate-500">{description}</p>
            </div>
            <div className="h-5 w-5 rounded-full border-2 border-slate-200 flex items-center justify-center [&:has([data-state=checked])]:border-indigo-600">
                <div className="h-2 w-2 rounded-full bg-indigo-600 hidden group-has-[:checked]:block" />
            </div>
        </Label>
    )
}
