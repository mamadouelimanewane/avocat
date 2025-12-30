
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileUp, CheckCircle, AlertCircle } from "lucide-react"
import { importBankStatement } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"

export function BankStatementImport() {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<{ date: Date, description: string, amount: number, reference?: string }[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            parseCSV(selectedFile)
        }
    }

    const parseCSV = (file: File) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            const lines = text.split('\n').slice(1) // Skip header
            const parsed = lines.map(line => {
                const cols = line.split(',')
                if (cols.length < 3) return null
                return {
                    date: new Date(cols[0]),
                    description: cols[1],
                    amount: parseFloat(cols[2]),
                    reference: cols[3] || ""
                }
            }).filter((item): item is { date: Date, description: string, amount: number, reference: string } => item !== null)
            setPreview(parsed)
        }
        reader.readAsText(file)
    }

    const handleImport = async () => {
        if (preview.length === 0) return
        setIsUploading(true)
        const res = await importBankStatement(preview)
        setIsUploading(false)
        if (res.success) {
            toast({ title: "Import réussi", description: `${res.count} lignes importées.` })
            setFile(null)
            setPreview([])
        } else {
            toast({ title: "Erreur", description: res.message, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900">Import Relevé Bancaire</h3>
                    <p className="text-xs text-slate-500">Format attendu : Date, Description, Montant, Référence</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" /> Choisir CSV
                    </Button>
                </div>
            </div>

            {file && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-2">
                        <FileUp className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                        {preview.slice(0, 5).map((l, i) => (
                            <div key={i} className="flex justify-between border-b pb-1">
                                <span>{l.description}</span>
                                <span className={l.amount > 0 ? 'text-green-600' : 'text-red-600'}>{l.amount} FCFA</span>
                            </div>
                        ))}
                        {preview.length > 5 && <p className="text-slate-400 italic">... et {preview.length - 5} autres lignes</p>}
                    </div>
                    <Button
                        className="w-full mt-3 bg-slate-900 text-white"
                        size="sm"
                        onClick={handleImport}
                        disabled={isUploading}
                    >
                        {isUploading ? "Importation..." : `Importer ${preview.length} lignes`}
                    </Button>
                </div>
            )}
        </div>
    )
}
