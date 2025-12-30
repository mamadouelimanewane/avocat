"use client"

import { useState, useRef } from "react"
import SignatureCanvas from 'react-signature-canvas'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, PenTool, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { signDocument } from "@/app/actions"

interface SignatureDialogProps {
    documentId: string
    documentName: string
    onSigned?: () => void
}

export function SignatureDialog({ documentId, documentName, onSigned }: SignatureDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const sigCanvas = useRef<SignatureCanvas>(null)
    const { toast } = useToast()

    const clear = () => sigCanvas.current?.clear()

    const save = async () => {
        if (sigCanvas.current?.isEmpty()) {
            toast({
                title: "Signature vide",
                description: "Veuillez signer dans le cadre avant de valider.",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png')

        if (!signatureDataUrl) return

        try {
            await signDocument(documentId, signatureDataUrl)

            toast({
                title: "Document signé !",
                description: "Votre signature a été apposée électroniquement.",
            })

            setOpen(false)
            if (onSigned) onSigned()
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'apposer la signature.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <PenTool className="h-4 w-4" /> Signer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Signature Électronique</DialogTitle>
                    <DialogDescription>
                        Apposez votre signature pour valider le document : <br />
                        <strong>{documentName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 p-1">
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                            className: "w-full h-40 cursor-crosshair"
                        }}
                    />
                </div>
                <div className="text-xs text-center text-slate-400">
                    Tracez votre signature ci-dessus à l'aide de votre souris ou doigt.
                </div>

                <DialogFooter className="flex justify-between sm:justify-between items-center mt-4">
                    <Button variant="ghost" onClick={clear} disabled={loading}>
                        Effacer
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
                            Annuler
                        </Button>
                        <Button onClick={save} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Valider la Signature
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
