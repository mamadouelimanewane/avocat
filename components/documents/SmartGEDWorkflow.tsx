"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CheckCircle2, Clock, PlayCircle, FolderOpen, Tag, Sparkles, UploadCloud, ArrowRight, UserCheck, Stamp } from "lucide-react"

// Mock Data for "Parapheur" (Validation Circuit)
const VALIDATION_QUEUE = [
    {
        id: 1,
        title: "Conclusions Récapitulatives - Affaire SOC/BTP",
        type: "PROCÉDURE",
        author: { name: "Me Diop", initial: "MD" },
        date: "Il y a 2h",
        steps: [
            { label: "Rédaction", status: "DONE", by: "Me Diop" },
            { label: "Revue Senior", status: "DONE", by: "Me Ndiaye" },
            { label: "Validation Associé", status: "CURRENT", by: "Vous" },
            { label: "Signature & Tampon", status: "PENDING", by: "Secrétariat" }
        ]
    },
    {
        id: 2,
        title: "Protocole d'Accord Transactionnel",
        type: "CONTRAT",
        author: { name: "Me Fall", initial: "MF" },
        date: "Hier 16:30",
        steps: [
            { label: "Rédaction", status: "DONE", by: "Me Fall" },
            { label: "Revue Client", status: "WAITING", by: "Client Externe" },
            { label: "Signature", status: "PENDING", by: "Parties" }
        ]
    }
]

export function SmartGEDWorkflow() {
    const [activeTab, setActiveTab] = useState("parapheur")
    const [isThinking, setIsThinking] = useState(false)
    const [classifierResult, setClassifierResult] = useState<any>(null)

    const handleDrop = (e: any) => {
        e.preventDefault()
        setIsThinking(true)
        // Simulate AI Processing
        setTimeout(() => {
            setIsThinking(false)
            setClassifierResult({
                filename: "scan_20240104.pdf",
                detectedType: "Assignation en Paiement",
                confidence: 98,
                suggestedFolder: "/Contentieux/2026/Recouvrement",
                suggestedTags: ["Urgent", "Commercial", "Créance"],
                summary: "Demande de paiement de 12.5M FCFA suite à factures impayées (Bons de commande n°45 et 46)."
            })
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Card className="flex-1 border-none shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Stamp className="h-5 w-5 text-emerald-400" />
                            Parapheur Numérique
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {VALIDATION_QUEUE.length} documents en attente de votre signature.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex -space-x-2 overflow-hidden">
                            <Avatar className="inline-block h-8 w-8 ring-2 ring-slate-900"><AvatarFallback className="bg-amber-500 text-white text-xs">MD</AvatarFallback></Avatar>
                            <Avatar className="inline-block h-8 w-8 ring-2 ring-slate-900"><AvatarFallback className="bg-purple-500 text-white text-xs">MF</AvatarFallback></Avatar>
                            <div className="h-8 w-8 rounded-full bg-slate-700 ring-2 ring-slate-900 flex items-center justify-center text-xs text-slate-300 font-medium">+2</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 border-none shadow-md bg-gradient-to-br from-indigo-900 to-indigo-800 text-white cursor-pointer hover:scale-[1.01] transition-transform"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-300" />
                            Auto-Classifier IA
                        </CardTitle>
                        <CardDescription className="text-indigo-200">
                            Glissez un document ici pour le ranger automatiquement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-4">
                        {isThinking ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <Sparkles className="h-8 w-8 text-indigo-300 mb-2" />
                                <span className="text-xs font-mono">Lecture Sémantique...</span>
                            </div>
                        ) : (
                            <UploadCloud className="h-10 w-10 text-indigo-400 opacity-50" />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="parapheur" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
                    <TabsTrigger value="parapheur" className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none px-4 py-2">
                        Circuit de Validation
                    </TabsTrigger>
                    <TabsTrigger value="classifier" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-4 py-2">
                        Classement Intelligent
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="parapheur" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {VALIDATION_QUEUE.map(doc => (
                        <Card key={doc.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {doc.date}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">{doc.title}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-slate-200">{doc.author.initial}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-slate-600">Proposé par {doc.author.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full relative pt-4 md:pt-0">
                                        {/* Stepper Visualization */}
                                        <div className="flex items-center justify-between relative z-10 w-full">
                                            {doc.steps.map((step, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-2 group relative">
                                                    {/* Connection Line */}
                                                    {idx < doc.steps.length - 1 && (
                                                        <div className={`absolute top-3 left-[50%] w-full h-0.5 -z-10 ${step.status === 'DONE' ? 'bg-emerald-500' : 'bg-slate-200'
                                                            }`} style={{ width: 'calc(100% + 2rem)' }} />
                                                    )}

                                                    <div className={`
                                                        h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all
                                                        ${step.status === 'DONE' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                            step.status === 'CURRENT' ? 'bg-amber-500 border-amber-500 text-white animate-pulse' :
                                                                step.status === 'WAITING' ? 'bg-blue-100 border-blue-300 text-blue-500' :
                                                                    'bg-slate-100 border-slate-200 text-slate-300'}
                                                    `}>
                                                        {step.status === 'DONE' ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold uppercase text-slate-600">{step.label}</p>
                                                        <p className="text-[10px] text-slate-400 truncate max-w-[80px]">{step.by}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-[120px]">
                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-full">
                                            <CheckCircle2 className="mr-2 h-3 w-3" /> Valider
                                        </Button>
                                        <Button size="sm" variant="outline" className="w-full text-slate-500">
                                            Rejeter
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="classifier" className="mt-6">
                    {classifierResult ? (
                        <Card className="bg-indigo-50 border-indigo-200 overflow-hidden animate-in zoom-in duration-300">
                            <CardHeader className="bg-white/50 border-b border-indigo-100">
                                <CardTitle className="text-indigo-800 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" /> Analyse Terminée
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Document Détecté</p>
                                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-indigo-500" />
                                            {classifierResult.detectedType}
                                        </h3>
                                        <Badge className="mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Confiance IA: {classifierResult.confidence}%</Badge>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Résumé IA</p>
                                        <p className="text-sm text-slate-700 leading-relaxed italic">
                                            "{classifierResult.summary}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-emerald-500">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Dossier Virtuel Suggéré</p>
                                        <div className="flex items-center gap-2 text-emerald-700 font-medium">
                                            <FolderOpen className="h-5 w-5" />
                                            {classifierResult.suggestedFolder}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-2">Tags Automatiques</p>
                                        <div className="flex flex-wrap gap-2">
                                            {classifierResult.suggestedTags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                    <Tag className="h-3 w-3" /> {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmer le Classement
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer"
                            onClick={() => handleDrop({ preventDefault: () => { } })}
                        >
                            <UploadCloud className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-700">Zone de Classement Automatique</h3>
                            <p className="max-w-md mx-auto mt-2 text-sm">
                                Glissez n'importe quel fichier ici. L'IA analysera son contenu sémantique pour déterminer son type, son dossier de rattachement et ses tags.
                            </p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
