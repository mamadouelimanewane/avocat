"use client"

import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Eraser, Check, X } from "lucide-react"

interface SignaturePadProps {
    onSave: (signatureData: string) => void
    onCancel: () => void
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas | null>(null)
    const [isEmpty, setIsEmpty] = useState(true)

    const clear = () => {
        sigCanvas.current?.clear()
        setIsEmpty(true)
    }

    const save = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const data = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
            onSave(data)
        }
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Apposez votre signature ici</span>
                <Button variant="ghost" size="sm" onClick={clear} className="text-slate-500 hover:text-red-500">
                    <Eraser className="h-4 w-4 mr-1" />
                    Effacer
                </Button>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-md bg-slate-50 overflow-hidden">
                <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                        className: "signature-canvas w-full h-48 cursor-crosshair",
                    }}
                    onBegin={() => setIsEmpty(false)}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                </Button>
                <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={save}
                    disabled={isEmpty}
                >
                    <Check className="h-4 w-4 mr-1" />
                    Valider la signature
                </Button>
            </div>
            <style jsx global>{`
                .signature-canvas {
                    width: 100% !important;
                    height: 192px !important;
                }
            `}</style>
        </div>
    )
}
