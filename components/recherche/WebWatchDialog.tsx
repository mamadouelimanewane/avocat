
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, RefreshCw, Check, Sparkles, Plus } from "lucide-react"
import { triggerWebWatch, createJurisprudence } from "@/app/actions"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export function WebWatchDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [keywords, setKeywords] = useState("Droit des affaires OHADA, jurisprudence sociale Sénégal")
    const [findings, setFindings] = useState<any[]>([])

    const handleScan = async () => {
        setIsScanning(true)
        setFindings([])

        // Call Server Action
        const res = await triggerWebWatch(keywords)

        // @ts-ignore
        if (res.success && res.findings) {
            // @ts-ignore
            setFindings(res.findings)
        }
        setIsScanning(false)
    }

    const handleImport = async (item: any) => {
        await createJurisprudence({
            title: item.title,
            summary: item.summary,
            content: item.content || item.summary || "Contenu non disponible",
            type: item.type || "JURISPRUDENCE",
            date: new Date(item.date),
            court: item.court,
            reference: item.reference,
            keywords: ['VEILLE', 'WEB']
        })
        toast({
            title: "Succès",
            description: "Décision ajoutée à la bibliothèque."
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Globe className="mr-2 h-4 w-4 text-blue-500" /> Veille Juridique Web
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-amber-500" /> Agent de Veille Juridique
                    </DialogTitle>
                    <DialogDescription>
                        L'IA parcourt les sources juridiques (OHADA.org, Cour Suprême...) pour trouver les dernières décisions.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Mots-clés de la veille..."
                        />
                        <Button onClick={handleScan} disabled={isScanning}>
                            {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Lancer le scan'}
                        </Button>
                    </div>

                    {isScanning && (
                        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                            Analyse des sources externes en cours...
                        </div>
                    )}

                    {!isScanning && findings.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-900">Résultats trouvés :</p>
                            {findings.map((item, idx) => (
                                <div key={idx} className="p-3 border rounded-md hover:bg-slate-50 flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.summary}</p>
                                        <p className="text-xs text-blue-600 underline">{item.url}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleImport(item)}>
                                        <Plus className="h-4 w-4" /> Importer
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
