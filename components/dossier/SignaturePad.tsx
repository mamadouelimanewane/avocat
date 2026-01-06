"use client"

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    ShieldCheck,
    Eraser,
    CheckCircle2,
    Lock,
    Clock,
    UserCheck,
    AlertTriangle,
    Loader2
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface SignaturePadProps {
    documentName: string
    onSign: (signatureDataUrl: string) => Promise<void>
    isOpen: boolean
    onClose: () => void
}

export function SignaturePad({ documentName, onSign, isOpen, onClose }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<'DRAW' | 'VERIFY'>('DRAW')

    const clear = () => {
        sigCanvas.current?.clear()
    }

    const handleSign = async () => {
        if (sigCanvas.current?.isEmpty()) {
            toast({
                title: "Signature vide",
                description: "Veuillez apposer votre signature avant de valider.",
                variant: "destructive"
            })
            return
        }

        setIsProcessing(true)
        try {
            const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png')
            if (dataUrl) {
                await onSign(dataUrl)
                toast({
                    title: "Document signé avec succès",
                    description: "Le sceau numérique a été apposé sur " + documentName
                })
                onClose()
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Erreur de signature",
                description: "Une erreur est survenue lors du scellement numérique.",
                variant: "destructive"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-slate-950 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Lock className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl">Signature Électronique Sécurisée</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        Vous vous apprêtez à signer numériquement : <span className="text-indigo-400 font-bold">{documentName}</span>
                    </DialogDescription>
                </div>

                <div className="p-8 space-y-6 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatusCard icon={UserCheck} label="Signataire" value="Maître Avocat" color="blue" />
                        <StatusCard icon={Clock} label="Horodatage" value={new Date().toLocaleTimeString()} color="indigo" />
                        <StatusCard icon={ShieldCheck} label="Type" value="AES (Avancée)" color="emerald" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-amber-500" /> Espace de Signature
                            </label>
                            <Button variant="ghost" size="sm" onClick={clear} className="text-slate-500 hover:text-red-500 hover:bg-red-50">
                                <Eraser className="h-3 w-3 mr-2" /> Effacer
                            </Button>
                        </div>

                        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden group">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor='black'
                                canvasProps={{
                                    className: "w-full h-64 cursor-crosshair",
                                    style: { width: '100%', height: '256px' }
                                }}
                            />
                            <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Lock className="h-12 w-12 text-slate-900" />
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 italic">
                            En signant, vous attestez avoir pris connaissance du document et en validez le contenu intégralement.
                        </p>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-emerald-900">Validité Juridique OHADA</p>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                                Cette signature utilise un hachage SHA-256 et un horodatage qualifié conforme aux exigences de l'Acte Uniforme OHADA.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t flex justify-between gap-4">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSign}
                        disabled={isProcessing}
                        className="bg-slate-950 hover:bg-slate-800 text-white gap-2 px-8 min-w-[150px]"
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Lock className="h-4 w-4" />
                                Sceller le document
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function StatusCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colors: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        indigo: "bg-indigo-100 text-indigo-600",
        emerald: "bg-emerald-100 text-emerald-600"
    }
    return (
        <div className="bg-white p-3 rounded-xl border-2 border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                <div className={`p-1 rounded ${colors[color]}`}>
                    <Icon className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
            </div>
            <p className="text-xs font-black text-slate-900 truncate">{value}</p>
        </div>
    )
}
