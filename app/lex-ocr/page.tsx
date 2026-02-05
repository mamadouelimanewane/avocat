"use client"

import { useState } from "react"
import {
    FileSearch,
    Upload,
    Search,
    FileText,
    Cpu,
    CheckCircle2,
    Loader2,
    Copy,
    ShieldCheck,
    Zap,
    MoreHorizontal,
    Tags,
    History,
    Languages
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock Data for OCR
const MOCK_EXTRACTIONS = [
    { id: 1, name: "Contrat_Cession_Draft.pdf", type: "PDF", confidence: 98, date: "Aujourd'hui", status: "EXTRAIT" },
    { id: 2, name: "Facture_Expertise_04.jpg", type: "IMAGE", confidence: 92, date: "Hier", status: "EXTRAIT" },
    { id: 3, name: "Avis_Imposition.pdf", type: "PDF", confidence: 45, date: "02 Fév", status: "ERREUR" },
]

export default function LexOCRPage() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [extractedText, setExtractedText] = useState("")

    const simulateOCR = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setExtractedText(`EXTRACTION IA LEXOCR - RÉSULTAT :\n\nPROJET DE CESSION DE PARTS SOCIALES\n\nEntre les soussignés :\n1. Monsieur Amadou FALL, demeurant à Dakar...\n2. La société AfricaTech SARL...\n\nArticle 1 : Objet de la cession\nLe cédant cède et transporte sous les garanties ordinaires de droit...\n\n[OCR CONFIDENCE: 98.4%]`)
            setIsProcessing(false)
        }, 2000)
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

            {/* NetDocuments Premium style Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-900 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                        <Cpu className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LexOCR Intelligence</h1>
                        <p className="text-slate-500 font-medium">Numérisation haute fidélité & Extraction IA (Standard NetDocuments).</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 bg-white">
                        <History className="h-4 w-4 mr-2" /> Historique scans
                    </Button>
                    <Button className="h-12 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100">
                        <Upload className="h-4 w-4 mr-2" /> Scanner un document
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left: Upload & OCR Engine */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[3rem] border-slate-100 shadow-xl bg-white overflow-hidden border-2 border-dashed border-indigo-200">
                        <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-br from-white to-indigo-50/30">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-indigo-50 relative">
                                <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping" />
                                <FileSearch className="h-10 w-10 text-indigo-600 relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-slate-900">Déposez vos documents ici</h2>
                                <p className="text-slate-500 max-w-sm mx-auto">Soutenu par l'IA GPT-4o, nous extrayons le texte, les montants, les dates et les parties contractantes.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={simulateOCR} className="h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg">
                                    Lancer l&apos;Extraction IA
                                </Button>
                                <Button variant="outline" className="h-12 px-8 rounded-2xl font-bold border-indigo-200 text-indigo-700">Explorateur local</Button>
                            </div>
                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
                                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Sécurité Militaire</span>
                                <span className="flex items-center gap-1"><Languages className="h-3 w-3 text-indigo-500" /> +50 Langues (FR, AR, EN)</span>
                            </div>
                        </div>
                    </Card>

                    {/* Results Pane */}
                    <Card className="rounded-[3rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white px-8 py-6 flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-lg">Extrait LexOCR</CardTitle>
                                <CardDescription className="text-slate-400">Texte structuré récupéré.</CardDescription>
                            </div>
                            <Button variant="ghost" className="text-indigo-400 hover:text-white hover:bg-white/10" onClick={() => setExtractedText("")}>Effacer</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px] p-8 font-mono text-sm leading-relaxed text-slate-700 bg-slate-50/50">
                                {isProcessing ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                                        <p className="font-sans font-bold text-slate-500">Moteur OCR en cours d&apos;analyse...</p>
                                    </div>
                                ) : extractedText ? (
                                    <div className="whitespace-pre-wrap">{extractedText}</div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                                        En attente d&apos;un fichier...
                                    </div>
                                )}
                            </ScrollArea>
                            {extractedText && (
                                <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
                                    <Button variant="outline" className="gap-2 rounded-xl text-xs font-bold"><Copy className="h-4 w-4" /> Copier</Button>
                                    <Button className="gap-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"><FileText className="h-4 w-4" /> Créer un Projet d&apos;Acte</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Insights & Metadata Extraction */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-indigo-600 text-white">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-400" />
                                Extraction Intelligente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Métadonnées détectées</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Date de signature", value: "04/02/2026", confidence: 99 },
                                            { label: "Montant Cession", value: "25.000.000 FCFA", confidence: 95 },
                                            { label: "Notaire", value: "Me Abdoulaye Ba", confidence: 88 },
                                        ].map((meta, i) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold">{meta.label}</p>
                                                    <p className="text-xs font-black text-slate-900">{meta.value}</p>
                                                </div>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">{meta.confidence}%</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full bg-slate-900 text-white rounded-2xl h-10 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Valider & Classer au Dossier
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Tags className="h-4 w-4 text-indigo-600" />
                                Auto-Classification IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Recommandations de rangement basées sur le contenu :</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50/50">#CessionParts</Badge>
                                <Badge variant="outline" className="border-slate-200 text-slate-500">#Protocole</Badge>
                                <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50/50">#Signé</Badge>
                                <Badge variant="outline" className="border-slate-200 text-slate-500">#AfricaTech</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
                        <ShieldCheck className="h-10 w-10 text-emerald-400 mb-6" />
                        <h4 className="text-lg font-black mb-2 tracking-tight whitespace-nowrap">Conformité Archivage</h4>
                        <p className="text-xs text-indigo-200 leading-relaxed mb-6 italic">
                            "Tous les documents extraits sont chiffrés et stockés dans un bunker cloud certifié SEC/FINRA."
                        </p>
                        <Button className="w-full bg-white text-indigo-900 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-50">
                            Télécharger Audit Log
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
