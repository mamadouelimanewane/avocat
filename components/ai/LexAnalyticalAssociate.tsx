
"use client"

import { useState } from "react"
import {
    Activity,
    X,
    Database,
    BarChart3,
    Layers,
    FileSearch,
    MessageSquare,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Calendar,
    Users,
    MapPin,
    Cpu,
    Search,
    Workflow,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface LexAnalyticalAssociateProps {
    dossierId: string
    onClose?: () => void
}

export function LexAnalyticalAssociate({ dossierId, onClose }: LexAnalyticalAssociateProps) {
    const [activeTab, setActiveTab] = useState("snapshot")
    const [isProcessing, setIsProcessing] = useState(false)
    const [processProgress, setProcessProgress] = useState(0)
    const [dataExtracted, setDataExtracted] = useState(false)

    // Extracted Data Mock
    const metadata = [
        { label: "Parties", value: "Société X vs. Groupe Y", icon: <Users className="h-4 w-4" /> },
        { label: "Valeur Litige", value: "45,000,000 FCFA", icon: <BarChart3 className="h-4 w-4" /> },
        { label: "Juridiction", value: "Tribunal de Commerce de Dakar", icon: <MapPin className="h-4 w-4" /> },
        { label: "Échéance Prochaine", value: "15 Mars 2026", icon: <Calendar className="h-4 w-4" /> },
        { label: "Loi Applicable", value: "Droit OHADA", icon: <ShieldCheck className="h-4 w-4" /> },
    ]

    const risks = [
        { label: "Conformité KYC", score: 85, color: "bg-emerald-500" },
        { label: "Solidité Preuves", score: 62, color: "bg-amber-500" },
        { label: "Délai de Prescription", score: 92, color: "bg-emerald-500" },
        { label: "Risque Financier", score: 45, color: "bg-rose-500" },
    ]

    const handleRunAnalysis = () => {
        setIsProcessing(true)
        setProcessProgress(0)
        setDataExtracted(false)

        const interval = setInterval(() => {
            setProcessProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsProcessing(false)
                    setDataExtracted(true)
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    return (
        <div className="bg-slate-900 border-l border-white/10 w-full h-full flex flex-col shadow-2xl relative text-white">
            {/* Dark Mode Specific Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                        <Cpu className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-white tracking-tight">Lex<span className="text-emerald-400">Analytical</span> Associate</h3>
                        <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest">Technologie Leah AI™ Intégrée</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-full h-8 w-8 text-slate-400">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="snapshot" className="flex-1 flex flex-col min-h-0" onValueChange={setActiveTab}>
                <div className="px-4 pt-4 bg-slate-950/40">
                    <TabsList className="grid grid-cols-3 w-full bg-slate-800/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="snapshot" className="text-[10px] font-bold gap-1 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                            <Layers className="h-3 w-3" /> SNAPSHOT
                        </TabsTrigger>
                        <TabsTrigger value="cross" className="text-[10px] font-bold gap-1 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                            <MessageSquare className="h-3 w-3" /> CROSS-CHAT
                        </TabsTrigger>
                        <TabsTrigger value="due-diligence" className="text-[10px] font-bold gap-1 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                            <Workflow className="h-3 w-3" /> AUDIT
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 min-h-full">
                        <AnimatePresence mode="wait">
                            <TabsContent value="snapshot" className="mt-0 outline-none space-y-6">
                                {!dataExtracted && !isProcessing ? (
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Database className="w-24 h-24" />
                                            </div>
                                            <h4 className="text-xl font-black mb-2 leading-tight">Extraction de Données Structurées</h4>
                                            <p className="text-emerald-100 text-sm opacity-90 leading-relaxed font-medium">
                                                Transformez vos documents PDF non structurés en une base de données exploitable instantanément.
                                            </p>
                                            <Button
                                                onClick={handleRunAnalysis}
                                                className="mt-6 bg-white text-emerald-800 hover:bg-emerald-50 font-black rounded-xl px-8 shadow-lg w-full"
                                            >
                                                LANCER L'EXTRACTION LEAH
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <StatCard icon={<FileSearch className="h-4 w-4 text-emerald-400" />} label="Citations" value="Directes" />
                                            <StatCard icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} label="Précision" value="99.8%" />
                                        </div>
                                    </div>
                                ) : isProcessing ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full border-4 border-white/5" />
                                            <motion.div
                                                className="absolute inset-0 w-24 h-24 rounded-full border-4 border-emerald-50 border-t-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <span className="text-lg font-black text-white">{processProgress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-lg font-bold text-white">Indexation "Deep Document"</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Moteur d'orchestration Leah v3.0</p>
                                        </div>
                                        <Progress value={processProgress} className="w-64 h-1 bg-white/5" indicatorClassName="bg-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Snapshot du Dossier</h4>
                                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5">Prêt</Badge>
                                        </div>

                                        {/* Metadata Extract */}
                                        <div className="space-y-3">
                                            {metadata.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-emerald-400">{item.icon}</div>
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Risk Map */}
                                        <div className="space-y-4 pt-4">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Indicateurs de Performance</h4>
                                            <div className="space-y-4">
                                                {risks.map((risk, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                            <span>{risk.label}</span>
                                                            <span className={risk.score > 70 ? "text-emerald-400" : "text-amber-400"}>{risk.score}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${risk.score}%` }}
                                                                transition={{ delay: i * 0.1, duration: 1 }}
                                                                className={cn("h-full rounded-full", risk.color)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="cross" className="mt-0 outline-none space-y-6">
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-white/5">
                                        <h4 className="text-lg font-black mb-2 text-emerald-400">Multi-Document Chat</h4>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                            Interrogez Leah sur l'ensemble des documents du dossier (Baux, contrats, pièces judiciaires, factures). Leah fait les liens entre eux.
                                        </p>
                                    </div>

                                    <div className="bg-slate-950 rounded-2xl p-6 border border-white/5 h-64 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                                            <MessageSquare className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">En attente de connexion Leah Core...</p>
                                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl">ACTIVER LE CROSS-CHAT</Button>
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Questions suggérées</h5>
                                        <SuggestedQuestion text="Quelles sont les contradictions entre le bail et l'avenant ?" />
                                        <SuggestedQuestion text="Sors-moi un tableau des dates d'échéance de toutes les pièces." />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="due-diligence" className="mt-0 outline-none space-y-6">
                                <div className="space-y-6">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
                                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
                                        <div>
                                            <h5 className="font-bold text-amber-500">Audit de Conformité (Sénégal)</h5>
                                            <p className="text-xs text-amber-500/70 mt-1 font-medium leading-relaxed">
                                                Leah a détecté 2 anomalies dans la structuration des pièces pour ce type de dossier (Civil - Foncier).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <AuditItem status="pass" label="Conformité Décret 2024-X" />
                                        <AuditItem status="fail" label="Attestation de Droit d'Usage" />
                                        <AuditItem status="warning" label="Vérification État Réel" />
                                    </div>
                                </div>
                            </TabsContent>
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Footer Insight */}
                <div className="p-4 border-t border-white/5 bg-slate-950 text-[10px] text-emerald-500/50 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Activity className="h-3 w-3 animate-pulse" />
                    Connecté via Leah-Hub Enterprise
                </div>
            </Tabs>
        </div>
    )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1 hover:bg-white/10 transition-all cursor-pointer">
            <div className="mb-1">{icon}</div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black text-white">{value}</span>
        </div>
    )
}

function SuggestedQuestion({ text }: { text: string }) {
    return (
        <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 text-left text-xs font-bold text-slate-300 hover:bg-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between group">
            <span className="line-clamp-1">{text}</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
        </button>
    )
}

function AuditItem({ status, label }: { status: 'pass' | 'fail' | 'warning', label: string }) {
    const icons = {
        pass: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
        fail: <X className="h-4 w-4 text-rose-500" />,
        warning: <AlertCircle className="h-4 w-4 text-amber-500" />
    }

    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/1) flex items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
                {icons[status]}
                <span className="text-sm font-bold text-slate-300">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-700" />
        </div>
    )
}
