
"use client"

import { useState } from "react"
import {
    Filter,
    X,
    BookOpen,
    Lightbulb,
    CheckCircle2,
    AlertTriangle,
    Info,
    Zap,
    Settings2,
    ChevronRight,
    FileText,
    ShieldCheck,
    Search,
    PlayCircle,
    Copy,
    Save,
    RotateCw,
    Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexSifterProProps {
    dossierId: string
    onClose?: () => void
}

export function LexSifterPro({ dossierId, onClose }: LexSifterProProps) {
    const [isSifting, setIsSifting] = useState(false)
    const [siftProgress, setSiftProgress] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [selectedPlaybook, setSelectedPlaybook] = useState("general")

    // Sifter Categories / Concepts
    const foundConcepts = [
        {
            id: "limitation_liability",
            title: "Limitation de Responsabilité",
            confidence: 98,
            status: "WARNING",
            advice: "La clause limite la responsabilité au montant des honoraires payés. Selon votre politique, vous devriez exiger un plafond d'au moins 2x le montant annuel du contrat.",
            suggestion: "En aucun cas, la responsabilité globale n'excédera deux fois (2x) le montant total des sommes payées au titre du présent contrat."
        },
        {
            id: "termination_notice",
            title: "Délai de Préavis",
            confidence: 95,
            status: "INFO",
            advice: "Le préavis est fixé à 3 mois. C'est conforme aux usages du marché pour ce type de contrat.",
            suggestion: null
        },
        {
            id: "governing_law",
            title: "Loi Applicable",
            confidence: 100,
            status: "SUCCESS",
            advice: "Le contrat est régi par le droit sénégalais et l'OHADA. C'est le standard optimal pour votre cabinet.",
            suggestion: null
        }
    ]

    const missingConcepts = [
        {
            id: "data_privacy",
            title: "Protection des Données (RGPD/Sénégal)",
            advice: "Aucune clause de traitement des données personnelles n'a été trouvée. Obligatoire selon la loi n° 2008-12.",
            suggestion: "Les parties s'engagent à respecter la réglementation relative à la protection des données à caractère personnel..."
        }
    ]

    const handleRunSifter = () => {
        setIsSifting(true)
        setSiftProgress(0)
        setShowResults(false)

        const interval = setInterval(() => {
            setSiftProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsSifting(false)
                    setShowResults(true)
                    return 100
                }
                return prev + 5
            })
        }, 100)
    }

    return (
        <div className="bg-[#f8fafc] border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative overflow-hidden font-sans">
            {/* Header - Corporate Intelligence Feel */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-lg shadow-md">
                        <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-amber-500">Sifter</span> Pro
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Contrôle & Conseils Playbook</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                        <span>Sélection du Playbook</span>
                        <Settings2 className="h-3 w-3" />
                    </div>
                    <Select defaultValue="general" onValueChange={setSelectedPlaybook}>
                        <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl font-bold text-sm h-11">
                            <SelectValue placeholder="Choisir un playbook..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="general">Standard Cabinet (Général)</SelectItem>
                            <SelectItem value="landlord">Bail - Point de vue Bailleur</SelectItem>
                            <SelectItem value="tenant">Bail - Point de vue Preneur</SelectItem>
                            <SelectItem value="vendor">Prestation - Point de vue Client</SelectItem>
                            <SelectItem value="nda">NDA / Confidentialité</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 min-h-full space-y-6">
                    <AnimatePresence mode="wait">
                        {!showResults && !isSifting ? (
                            <div className="space-y-6 animate-in fade-in duration-500 py-4">
                                <div className="bg-amber-500 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-amber-100">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <BookOpen className="w-24 h-24" />
                                    </div>
                                    <h4 className="text-xl font-black mb-2 leading-tight">Vérification de Conformité Playbook</h4>
                                    <p className="text-amber-50 text-sm opacity-90 leading-relaxed font-medium">
                                        Faites passer vos contrats au travers du filtre LexSifter pour recevoir des conseils stratégiques personnalisés.
                                    </p>
                                    <Button
                                        onClick={handleRunSifter}
                                        className="mt-6 bg-slate-900 text-white hover:bg-black font-black rounded-xl px-8 shadow-lg w-full flex items-center justify-center gap-2"
                                    >
                                        <PlayCircle className="h-5 w-5" /> TAMISER LE DOCUMENT
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Sifters Actifs (v8.1)</h5>
                                    <div className="grid gap-2">
                                        <SifterTag label="Juridiction & Loi" />
                                        <SifterTag label="Limitation Responsabilité" />
                                        <SifterTag label="Préavis de Résiliation" />
                                        <SifterTag label="Pénalités de Retard" />
                                        <SifterTag label="Propriété Intellectuelle" />
                                    </div>
                                </div>
                            </div>
                        ) : isSifting ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-100" />
                                    <motion.div
                                        className="absolute inset-0 w-24 h-24 rounded-full border-4 border-amber-500 border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-black text-slate-900">{siftProgress}%</span>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Tamisage en cours...</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Application des filtres {selectedPlaybook}...</p>
                                </div>
                                <Progress value={siftProgress} className="w-64 h-1 bg-slate-100 overflow-hidden" indicatorClassName="bg-amber-500" />
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 py-2">
                                <div className="flex items-center justify-between sticky top-0 bg-[#f8fafc] py-2 z-10">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Conseils & Analyse</h4>
                                    <Button variant="ghost" size="sm" onClick={handleRunSifter} className="h-7 text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                        <RotateCw className="h-3 w-3 mr-1" /> RELANCER
                                    </Button>
                                </div>

                                <Tabs defaultValue="found" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-200/50 p-1 mb-6">
                                        <TabsTrigger value="found" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Détectés ({foundConcepts.length})</TabsTrigger>
                                        <TabsTrigger value="missing" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Manquants ({missingConcepts.length})</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="found" className="space-y-4">
                                        {foundConcepts.map((concept, i) => (
                                            <AdviceCard key={i} concept={concept} />
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="missing" className="space-y-4">
                                        {missingConcepts.map((concept, i) => (
                                            <AdviceCard key={i} concept={concept} isMissing />
                                        ))}
                                    </TabsContent>
                                </Tabs>

                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative shadow-xl">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldCheck className="h-16 w-16" />
                                    </div>
                                    <h5 className="font-black text-sm uppercase tracking-widest mb-2">Synthèse Playbook</h5>
                                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                        Document globalement conforme mais présente des risques sur la protection des données et le plafond de responsabilité. Mise en conformité estimée à <span className="text-amber-400 font-black">15 min</span>.
                                    </p>
                                    <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl text-[10px] h-9 gap-2">
                                        <FileText className="h-3.5 w-3.5" /> GÉNÉRER LE RAPPORT CONSEIL
                                    </Button>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            {/* Footer - LegalSifter Theme Color */}
            <div className="p-4 border-t border-slate-200 bg-white text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Zap className="h-3 w-3 text-amber-500 animate-pulse" />
                Moteur LexSifter Enterprise v4.0
            </div>
        </div>
    )
}

function SifterTag({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-[11px] font-bold text-slate-600">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            {label}
        </div>
    )
}

function AdviceCard({ concept, isMissing = false }: { concept: any, isMissing?: boolean }) {
    const statusColors = {
        WARNING: "border-l-rose-500 text-rose-700 bg-rose-50/30",
        INFO: "border-l-blue-500 text-blue-700 bg-blue-50/30",
        SUCCESS: "border-l-emerald-500 text-emerald-700 bg-emerald-50/30",
        MISSING: "border-l-slate-400 text-slate-700 bg-slate-50/30"
    }

    const iconColors = {
        WARNING: "text-rose-500 bg-rose-50",
        INFO: "text-blue-500 bg-blue-50",
        SUCCESS: "text-emerald-500 bg-emerald-50",
        MISSING: "text-slate-500 bg-slate-50"
    }

    const currentStatus = isMissing ? "MISSING" : concept.status

    return (
        <div className={cn(
            "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group border-l-4",
            statusColors[currentStatus as keyof typeof statusColors]
        )}>
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg", iconColors[currentStatus as keyof typeof iconColors])}>
                            {currentStatus === 'WARNING' && <AlertTriangle className="h-3.5 w-3.5" />}
                            {currentStatus === 'INFO' && <Lightbulb className="h-3.5 w-3.5" />}
                            {currentStatus === 'SUCCESS' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {currentStatus === 'MISSING' && <Search className="h-3.5 w-3.5" />}
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-sm tracking-tight">{concept.title}</h5>
                    </div>
                    {!isMissing && <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px]">{concept.confidence}%</Badge>}
                </div>

                <div className="space-y-2">
                    <div className="flex gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 shrink-0 mt-0.5">Advice:</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{concept.advice}</p>
                    </div>

                    {concept.suggestion && (
                        <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 relative group/suggestion">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Suggestion de rédaction</span>
                            <p className="text-xs text-slate-800 font-bold italic leading-relaxed">"{concept.suggestion}"</p>
                            <div className="mt-3 flex gap-2">
                                <Button size="sm" className="h-7 px-3 text-[10px] bg-slate-900 text-white rounded-lg font-black gap-1.5">
                                    <Copy className="h-3 w-3" /> APPLIQUER
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-slate-400 font-bold">Ignorer</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
