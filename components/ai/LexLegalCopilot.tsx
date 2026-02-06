
"use client"

import { useState } from "react"
import {
    Sparkles,
    X,
    ShieldAlert,
    CheckCircle2,
    Zap,
    BookOpen,
    MessageSquare,
    RotateCcw,
    ChevronRight,
    AlertCircle,
    Info,
    FileSignature,
    PenTool,
    Search,
    Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexLegalCopilotProps {
    dossierId: string
    onClose?: () => void
}

export function LexLegalCopilot({ dossierId, onClose }: LexLegalCopilotProps) {
    const [activeTab, setActiveTab] = useState("review")
    const [isScanning, setIsScanning] = useState(false)
    const [scanProgress, setScanProgress] = useState(0)
    const [showResults, setShowResults] = useState(false)

    // Review Results
    const risks = [
        {
            title: "Indemnité forfaitaire agressive",
            severity: "HIGH",
            detail: "Le montant de 10% par jour de retard est considéré comme manifestement excessif par la jurisprudence OHADA.",
            fix: "Réduire à 0.5% ou plafonner l'indemnité à 10% du montant total."
        },
        {
            title: "Clause de non-concurrence floue",
            severity: "MEDIUM",
            detail: "La limitation géographique 'Toute l'Afrique' pourrait être invalidée car trop vaste.",
            fix: "Limiter à des zones géographiques précises (UEMOA ou pays spécifiques)."
        }
    ]

    const missingClauses = [
        { name: "Force Majeure (Spécifique contextuelle)", status: "Missing" },
        { name: "Règlement des différends (Arbitrage CCJA)", status: "Missing" },
        { name: "Confidentialité post-contractuelle", status: "Missing" }
    ]

    const handleStartScan = () => {
        setIsScanning(true)
        setScanProgress(0)
        setShowResults(false)

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsScanning(false)
                    setShowResults(true)
                    return 100
                }
                return prev + 5
            })
        }, 150)
    }

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                        <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 tracking-tight">LexLegal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Copilot</span></h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Technologie Spellbook™ Intégrée</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8">
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="review" className="flex-1 flex flex-col min-h-0" onValueChange={setActiveTab}>
                <div className="px-4 pt-4 bg-white/50 border-b border-slate-100">
                    <TabsList className="grid grid-cols-4 w-full bg-slate-100/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="review" className="text-[10px] sm:text-xs font-bold gap-1 rounded-lg">
                            <ShieldAlert className="h-3 w-3" /> <span className="hidden sm:inline">Analyse</span>
                        </TabsTrigger>
                        <TabsTrigger value="draft" className="text-[10px] sm:text-xs font-bold gap-1 rounded-lg">
                            <PenTool className="h-3 w-3" /> <span className="hidden sm:inline">Rédaction</span>
                        </TabsTrigger>
                        <TabsTrigger value="missing" className="text-[10px] sm:text-xs font-bold gap-1 rounded-lg">
                            <AlertCircle className="h-3 w-3" /> <span className="hidden sm:inline">Manques</span>
                        </TabsTrigger>
                        <TabsTrigger value="explain" className="text-[10px] sm:text-xs font-bold gap-1 rounded-lg">
                            <Info className="h-3 w-3" /> <span className="hidden sm:inline">Expliquer</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 min-h-full">
                        <AnimatePresence mode="wait">
                            <TabsContent value="review" className="mt-0 outline-none space-y-6">
                                {!showResults && !isScanning ? (
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <ShieldAlert className="w-24 h-24" />
                                            </div>
                                            <h4 className="text-xl font-black mb-2 leading-tight">Scanner de Risques Intelligents</h4>
                                            <p className="text-indigo-100 text-sm opacity-90 leading-relaxed font-medium">
                                                Identifiez instantanément les clauses abusives, les risques cachés et les déséquilibres contractuels.
                                            </p>
                                            <Button
                                                onClick={handleStartScan}
                                                className="mt-6 bg-white text-indigo-600 hover:bg-slate-50 font-black rounded-xl px-8 shadow-lg w-full"
                                            >
                                                LANCER L'ANALYSE SPELLBOOK
                                            </Button>
                                        </div>

                                        <div className="grid gap-4">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fonctionnalités Clés</h5>
                                            <FeatureItem
                                                icon={<Zap className="h-4 w-4 text-amber-500" />}
                                                title="Détection des Red Flags"
                                                desc="Alerte sur les clauses potentiellement dangereuses."
                                            />
                                            <FeatureItem
                                                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                title="Analyse de la Loi Applicable"
                                                desc="Vérifie la conformité avec OHADA / Sénégal."
                                            />
                                        </div>
                                    </div>
                                ) : isScanning ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full border-4 border-slate-100" />
                                            <motion.div
                                                className="absolute inset-0 w-24 h-24 rounded-full border-4 border-indigo-600 border-t-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xl font-black text-slate-900">{scanProgress}%</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-slate-900">Analyse du Contrat en Cours...</p>
                                            <p className="text-sm text-slate-500 mt-1">Comparaison avec 50,000+ précédents...</p>
                                        </div>
                                        <Progress value={scanProgress} className="w-64 h-1 bg-slate-100 overflow-hidden" />
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Résultats du Scan</h4>
                                            <Button variant="ghost" size="sm" onClick={handleStartScan} className="h-7 text-[10px] font-bold text-indigo-600">
                                                <RotateCcw className="h-3 w-3 mr-1" /> RE-SCANNER
                                            </Button>
                                        </div>

                                        {risks.map((risk, i) => (
                                            <div key={i} className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                                <div className={cn(
                                                    "px-5 py-3 flex items-center justify-between",
                                                    risk.severity === 'HIGH' ? "bg-rose-50" : "bg-amber-50"
                                                )}>
                                                    <div className="flex items-center gap-2">
                                                        <ShieldAlert className={cn(
                                                            "h-4 w-4",
                                                            risk.severity === 'HIGH' ? "text-rose-600" : "text-amber-600"
                                                        )} />
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            risk.severity === 'HIGH' ? "text-rose-600" : "text-amber-600"
                                                        )}>{risk.severity} RISK</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 space-y-4">
                                                    <h5 className="font-bold text-slate-900 text-lg">{risk.title}</h5>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{risk.detail}</p>
                                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Correction suggérée</p>
                                                        <p className="text-sm text-indigo-700 font-medium italic">"{risk.fix}"</p>
                                                        <Button size="sm" className="mt-4 w-full bg-slate-900 text-white rounded-lg gap-2 text-xs font-bold">
                                                            <Sparkles className="h-3 w-3" /> APPLIQUER LA CORRECTION
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="draft" className="mt-0 outline-none space-y-6">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                                        <h4 className="text-xl font-black mb-2">LexDraft Assistant</h4>
                                        <p className="text-indigo-200 text-sm font-medium opacity-80 leading-relaxed">
                                            Décrivez la clause que vous souhaitez ajouter et Spellbook la rédigera pour vous.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Instruction de Rédaction</label>
                                        <Textarea
                                            placeholder="Ex: Rédige une clause de limitation de responsabilité à 50% du montant du contrat..."
                                            className="min-h-[120px] rounded-2xl border-slate-200 shadow-sm focus:ring-indigo-500/10 focus:border-indigo-500/30 text-sm leading-relaxed"
                                        />
                                    </div>

                                    <Button className="w-full bg-indigo-600 hover:bg-black text-white rounded-2xl h-14 font-black shadow-lg shadow-indigo-100 gap-2 text-base">
                                        <Sparkles className="h-5 w-5" /> GENERER LA CLAUSE
                                    </Button>

                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <QuickDraftButton label="Clause de Résiliation" />
                                        <QuickDraftButton label="Clause de Force Majeure" />
                                        <QuickDraftButton label="Juridiction Compétente" />
                                        <QuickDraftButton label="Confidentialité" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="missing" className="mt-0 outline-none space-y-6">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Analyse de Complétude</h4>
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">Contrat Type: SERVICES</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {missingClauses.map((clause, i) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        <FileSignature className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{clause.name}</p>
                                                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-0.5">{clause.status}</p>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Zap className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-center">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <h5 className="font-bold text-emerald-900">8 Clauses de base détectées</h5>
                                        <p className="text-xs text-emerald-700 mt-2 font-medium">Votre contrat respecte les standards fondamentaux.</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="explain" className="mt-0 outline-none space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Simplificateur Juridique</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Copiez-collez une clause complexe ci-dessous pour obtenir une explication en langage clair pour votre client.
                                    </p>

                                    <Textarea
                                        placeholder="Collez la clause 'illisible' ici..."
                                        className="min-h-[150px] rounded-2xl border-slate-200 text-sm"
                                    />

                                    <Button className="w-full bg-slate-900 text-white rounded-2xl h-12 font-bold gap-2">
                                        <MessageSquare className="h-4 w-4" /> TRADUIRE EN FRANÇAIS SIMPLE
                                    </Button>

                                    <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-10 text-slate-400">
                                        <Info className="h-10 w-10 opacity-20 mb-3" />
                                        <p className="text-xs font-bold uppercase tracking-widest">En attente de texte</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Footer Insight */}
                <div className="p-4 border-t border-slate-100 bg-white/50 text-[10px] text-slate-400 font-medium italic flex items-center justify-center gap-2">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    Propulsé par LexAI Core v4.2 - Dernière mise à jour: Aujourd'hui
                </div>
            </Tabs>
        </div>
    )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="shrink-0">{icon}</div>
            <div>
                <p className="font-bold text-slate-900 text-xs">{title}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">{desc}</p>
            </div>
            <ChevronRight className="h-3 w-3 text-slate-300 ml-auto self-center" />
        </div>
    )
}

function QuickDraftButton({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 p-3 text-left bg-white border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
            <Zap className="h-3 w-3 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[10px] font-black text-slate-600 group-hover:text-indigo-900">{label}</span>
        </button>
    )
}
