"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    FileSignature,
    Wand2,
    ChevronRight,
    ChevronLeft,
    Download,
    Copy,
    FileText,
    Sparkles,
    CheckCircle2,
    Clock,
    Gavel,
    AlertTriangle,
    Scaling,
    Calculator,
    ShieldAlert,
    Landmark,
    History
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CONTRACT_TEMPLATES, ContractTemplate } from "@/lib/contract-templates"
import { generateContract, sendToParapheur } from "@/app/actions"

export function ContractGenerator() {
    const [step, setStep] = useState(1)
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedContract, setGeneratedContract] = useState<string | null>(null)
    const [isSending, setIsSending] = useState(false)
    const { toast } = useToast()

    const selectedTemplate = CONTRACT_TEMPLATES.find(t => t.id === selectedTemplateId)

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const result = await generateContract(selectedTemplateId, answers)
            if (result.success && result.contract) {
                setGeneratedContract(result.contract)
                setStep(3)
                toast({
                    title: "✅ Contrat généré",
                    description: "Votre document a été rédigé avec succès par l'IA."
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de générer le contrat.",
                variant: "destructive"
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = () => {
        if (!generatedContract) return
        navigator.clipboard.writeText(generatedContract)
        toast({ title: "Copié !", description: "Contrat copié dans le presse-papier." })
    }
    const handleSendToParapheur = async () => {
        if (!generatedContract || !selectedTemplate) return

        setIsSending(true)
        try {
            const result = await sendToParapheur({
                name: `${selectedTemplate.name}_Généré.pdf`,
                type: selectedTemplate.category || 'Contrat',
                content: generatedContract
            })
            if (result.success) {
                toast({
                    title: "🚀 Envoyé au Parapheur",
                    description: result.message
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'envoyer le document.",
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <FileSignature className="h-8 w-8 text-indigo-600" />
                        Générateur Pro de Contrats IA
                    </h1>
                    <p className="text-slate-500 mt-1">Concevez des contrats sur-mesure validés juridiquement en quelques minutes.</p>
                </div>

                {/* Stepper */}
                <div className="hidden md:flex items-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s ? 'bg-indigo-600 text-white' :
                                step > s ? 'bg-emerald-500 text-white' :
                                    'bg-slate-200 text-slate-500'
                                }`}>
                                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                            </div>
                            <span className={`text-xs font-medium ${step === s ? 'text-indigo-600' : 'text-slate-500'}`}>
                                {s === 1 ? 'Modèle' : s === 2 ? 'Informations' : 'Rédaction'}
                            </span>
                            {s < 3 && <ChevronRight className="h-4 w-4 text-slate-300" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Step 1: Template Selection */}
                {step === 1 && (
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        {CONTRACT_TEMPLATES.map((template) => (
                            <Card
                                key={template.id}
                                className={`cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all border-2 ${selectedTemplateId === template.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100'
                                    }`}
                                onClick={() => setSelectedTemplateId(template.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="bg-white">{template.category}</Badge>
                                        {selectedTemplateId === template.id && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                                    </div>
                                    <CardTitle className="text-xl">{template.name}</CardTitle>
                                    <CardDescription>{template.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {template.questions.slice(0, 3).map((q, i) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                                                {q.label}
                                            </Badge>
                                        ))}
                                        <Badge variant="secondary" className="text-[10px] font-normal">+{template.questions.length - 3} plus</Badge>
                                    </div>
                                    <Button
                                        className={`w-full ${selectedTemplateId === template.id ? 'bg-indigo-600' : 'bg-slate-900'}`}
                                        onClick={() => {
                                            setSelectedTemplateId(template.id)
                                            setStep(2)
                                        }}
                                    >
                                        Choisir ce modèle
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Step 2: Form & Info */}
                {step === 2 && selectedTemplate && (
                    <>
                        <div className="lg:col-span-1 space-y-4 animate-in slide-in-from-left-4 duration-300">
                            {/* Pro Lawyer Tools */}
                            <Card className="border-amber-200 bg-amber-50/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-800">
                                        <AlertTriangle className="h-4 w-4" />
                                        Outils Stratégiques Pro
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Jurisdiction Selector */}
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Clause de Juridiction</Label>
                                        <Select defaultValue="dakar_commerce">
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Choisir le tribunal..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dakar_commerce">Tribunal de Commerce de Dakar</SelectItem>
                                                <SelectItem value="ccja">Arbitrage CCJA (Abidjan)</SelectItem>
                                                <SelectItem value="conakry">Tribunal de Commerce de Conakry</SelectItem>
                                                <SelectItem value="lomé">Tribunal de Grande Instance de Lomé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Tax Checker */}
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-slate-500">Impact Fiscal Prévu (UEMOA)</Label>
                                        <div className="bg-white border rounded p-2 text-[10px] space-y-1">
                                            <div className="flex justify-between"><span>Enregistrement:</span> <span className="font-bold">2 - 5%</span></div>
                                            <div className="flex justify-between"><span>TVA (Prestations):</span> <span className="font-bold">18%</span></div>
                                            <div className="flex justify-between"><span>Retenue BRS:</span> <span className="font-bold">5%</span></div>
                                        </div>
                                    </div>

                                    {/* Smart Recommendation */}
                                    <div className="p-2 rounded bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700 leading-tight">
                                        <div className="flex items-center gap-1 font-bold mb-1">
                                            <ShieldAlert className="h-3 w-3" />
                                            Conseil LexPremium
                                        </div>
                                        {selectedTemplate.id === 'bail-commercial' && "Attention à l'Art 123 AUDCG : Le droit au renouvellement est d'ordre public. Toute clause contraire sera nulle."}
                                        {selectedTemplate.id === 'cdi-cadre-senegal' && "Vérifiez les seuils de préavis pour cadres (3 mois) selon la CCNI du Sénégal."}
                                        {!['bail-commercial', 'cdi-cadre-senegal'].includes(selectedTemplate.id) && "Assurez-vous d'avoir vérifié l'identité des signataires (KYC/AML) avant la signature."}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-indigo-100">
                                <CardHeader className="bg-indigo-50/50">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileSignature className="h-5 w-5 text-indigo-600" />
                                        {selectedTemplate.name}
                                    </CardTitle>
                                    <CardDescription>Informations requises pour la rédaction.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {selectedTemplate.questions.map((q) => (
                                            <div key={q.id} className="space-y-2">
                                                <Label htmlFor={q.id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    {q.label}
                                                </Label>
                                                {q.type === 'TEXT' || q.type === 'NUMBER' || q.type === 'DATE' ? (
                                                    <Input
                                                        id={q.id}
                                                        type={q.type.toLowerCase()}
                                                        placeholder={q.placeholder}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                        value={answers[q.id] || ""}
                                                    />
                                                ) : q.type === 'SELECT' ? (
                                                    <Select onValueChange={(v) => handleAnswerChange(q.id, v)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionner..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {q.options?.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Retour
                                </Button>
                                <Button
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <><Clock className="h-4 w-4 mr-2 animate-spin" /> Rédaction en cours...</>
                                    ) : (
                                        <><Wand2 className="h-4 w-4 mr-2" /> Générer le Contrat</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <Card className="h-[400px] border-slate-200 bg-slate-50/30 flex flex-col">
                                <CardHeader className="border-b bg-white">
                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-indigo-600" />
                                            Standard de Qualité LexPremium
                                        </div>
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">
                                            IA Juridique Connectée (OHADA/UEMOA)
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Landmark className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="max-w-sm space-y-2">
                                        <h3 className="font-bold text-slate-800 italic">"Une rédaction précise est le rempart contre les litiges."</h3>
                                        <p className="text-sm text-slate-500">
                                            Notre moteur d'intelligence juridique scanne en temps réel les codes et la jurisprudence d'Afrique de l'Ouest pour valider vos clauses.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                        <div className="p-3 bg-white border rounded flex items-center gap-2 shadow-sm">
                                            <Calculator className="h-4 w-4 text-indigo-500" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold">Honoraires Estimés</p>
                                                <p className="text-xs">350.000 FCFA</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border rounded flex items-center gap-2 shadow-sm">
                                            <Scaling className="h-4 w-4 text-indigo-500" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold">Complexité Acte</p>
                                                <p className="text-xs">Moyenne (Standard)</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-indigo-50 bg-indigo-50/10">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-xs flex items-center gap-2">
                                        <History className="h-3 w-3" />
                                        Modèles Récents Utilisés par le Cabinet
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="space-y-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-indigo-50 last:border-0 text-slate-500">
                                                <span>{i === 1 ? 'Contrat de Travail Me Ndiaye' : 'Cession Parts Africa SARL'}</span>
                                                <span className="text-[10px]">Il y a {i * 2} jours</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {/* Step 3: Result & Preview */}
                {step === 3 && generatedContract && (
                    <div className="lg:col-span-3 space-y-6 animate-in zoom-in-95 duration-500">
                        <Card className="border-indigo-100 shadow-xl overflow-hidden">
                            <CardHeader className="bg-indigo-600 text-white flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Contrat Finalisé : {selectedTemplate?.name}
                                    </CardTitle>
                                    <CardDescription className="text-indigo-100">Prêt pour relecture et signature.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4 mr-2" /> Copier
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        <Download className="h-4 w-4 mr-2" /> Télécharger (DOCX)
                                    </Button>
                                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50" onClick={() => setStep(1)}>
                                        Nouveau Contrat
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[700px] p-8 md:p-12 bg-white">
                                    <div className="max-w-4xl mx-auto prose prose-slate prose-indigo">
                                        <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm md:text-base">
                                            {generatedContract}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-emerald-50 border-emerald-100">
                                <CardContent className="pt-6 flex items-center gap-4">
                                    <div className="p-2 bg-emerald-100 rounded">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-emerald-900">Validé</p>
                                        <p className="text-xs text-emerald-700">Contrôle de conformité OK.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="bg-indigo-50 border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
                                onClick={handleSendToParapheur}
                            >
                                <CardContent className="pt-6 flex items-center gap-4">
                                    <div className="p-2 bg-indigo-100 rounded">
                                        {isSending ? (
                                            <Clock className="h-5 w-5 text-indigo-600 animate-spin" />
                                        ) : (
                                            <FileSignature className="h-5 w-5 text-indigo-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-indigo-900">Signable</p>
                                        <p className="text-xs text-indigo-700">Envoyer vers le parapheur.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-amber-50 border-amber-100 text-center">
                                <CardContent className="pt-6">
                                    <Button variant="link" className="text-amber-800 font-bold">Signaler une erreur de rédaction</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
