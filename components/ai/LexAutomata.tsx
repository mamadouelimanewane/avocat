
"use client"

import { useState } from "react"
import {
    Zap,
    FileJson,
    Timer,
    Coins,
    Briefcase,
    Receipt,
    Settings,
    Play,
    CheckCircle2,
    Download,
    RefreshCw,
    PenTool,
    CreditCard,
    PieChart,
    Building,
    FileSignature,
    Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface LexAutomataProps {
    dossierId: string
    onClose?: () => void
}

export function LexAutomata({ dossierId, onClose }: LexAutomataProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [activeOperation, setActiveOperation] = useState<string>("")
    const [progress, setProgress] = useState(0)

    const handleGenerate = () => {
        setIsGenerating(true)
        setProgress(0)
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsGenerating(false)
                    return 100
                }
                return prev + 5
            })
        }, 150)
    }

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Automation Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-orange-500 p-2 rounded-lg shadow-md shadow-orange-200">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-orange-500">Automata</span> Ops
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Corporate & Billing Engine</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <Settings className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="corporate" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 pt-4 bg-slate-50">
                    <TabsList className="grid grid-cols-2 w-full bg-slate-200/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="corporate" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
                            <Building className="h-3 w-3 mr-2" /> BOT CORPORATE
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                            <Coins className="h-3 w-3 mr-2" /> GESTION & TEMPS
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1 bg-slate-50">
                    <div className="p-4 space-y-6">

                        {/* CORPORATE AUTOMATION TAB (Ordalie Style) */}
                        <TabsContent value="corporate" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <Card className="border-none shadow-sm bg-white rounded-xl">
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opération Juridique</label>
                                        <Select onValueChange={setActiveOperation}>
                                            <SelectTrigger className="font-bold text-slate-700 h-11 border-slate-200 bg-slate-50">
                                                <SelectValue placeholder="Sélectionner une opération..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="approbation">Approbation des Comptes (Annuel)</SelectItem>
                                                <SelectItem value="constitution">Constitution de Société (SAS/SARL)</SelectItem>
                                                <SelectItem value="transfert">Transfert de Siège Social</SelectItem>
                                                <SelectItem value="augmentation">Augmentation de Capital</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {activeOperation && (
                                        <div className="bg-slate-50 rounded-lg p-4 border border-dashed border-slate-200 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <FileJson className="h-4 w-4 text-orange-500" />
                                                <span>Pack Documents Requis :</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                <DocBadge label="PV d'Assemblée Générale" />
                                                <DocBadge label="Rapport de Gestion" />
                                                <DocBadge label="Feuille de Présence" />
                                                <DocBadge label="Texte des Résolutions" />
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleGenerate}
                                        disabled={!activeOperation || isGenerating}
                                        className={cn(
                                            "w-full font-black h-12 rounded-xl shadow-lg transition-all",
                                            isGenerating ? "bg-slate-100 text-slate-400" : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200"
                                        )}
                                    >
                                        {isGenerating ? (
                                            <span className="flex items-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" /> GÉNÉRATION EN COURS ({progress}%)
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Zap className="h-4 w-4" /> GÉNÉRER LE PACK JURIDIQUE
                                            </span>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {progress === 100 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="font-bold text-sm text-slate-800">Documents Générés</h4>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> 4 Fichiers Prêts
                                        </Badge>
                                    </div>
                                    <GeneratedFileCard name="PV_AG_Approbation_2025.docx" size="24 KB" />
                                    <GeneratedFileCard name="Rapport_Gestion_VFinal.docx" size="45 KB" />
                                    <GeneratedFileCard name="Feuille_Presence.pdf" size="12 KB" />
                                    <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-700 font-bold h-10">
                                        <Download className="h-4 w-4 mr-2" /> TOUT TÉLÉCHARGER (.ZIP)
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* BILLING & MANAGEMENT TAB (Jarvis Legal Style) */}
                        <TabsContent value="billing" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <MetricCard
                                    label="Temps Passé"
                                    value="12h 30m"
                                    icon={<Timer className="h-4 w-4 text-blue-500" />}
                                    color="bg-blue-50"
                                />
                                <MetricCard
                                    label="À Facturer"
                                    value="2,450 €"
                                    icon={<Receipt className="h-4 w-4 text-emerald-500" />}
                                    color="bg-emerald-50"
                                />
                            </div>

                            {/* Profitability Progress */}
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Rentabilité Dossier</span>
                                        <span className="text-xs font-black text-slate-900">85% du Forfait</span>
                                    </div>
                                    <Progress value={85} className="h-2 bg-slate-100 mb-2" indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600" />
                                    <p className="text-[10px] text-slate-400 font-medium">Attention : Il reste seulement 2h avant de dépasser le forfait estimé.</p>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl shadow-lg hover:bg-black">
                                    <Timer className="h-4 w-4 mr-2 text-emerald-400" /> DÉMARRER LE CHRONO
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-10 font-bold border-slate-200">
                                        <CreditCard className="h-4 w-4 mr-2" /> NOTE DE FRAIS
                                    </Button>
                                    <Button variant="outline" className="h-10 font-bold border-slate-200">
                                        <FileSignature className="h-4 w-4 mr-2" /> FACTURE
                                    </Button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                <div className="bg-slate-50 p-2 border-b border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-500 pl-2">Dernières Activités</span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    <ActivityRow action="Rédaction Conclusions" time="2h 15m" user="Me. Wane" date="Hier" />
                                    <ActivityRow action="Appel Client" time="0h 30m" user="Me. Wane" date="Hier" />
                                    <ActivityRow action="Recherche Jurisprudence" time="1h 00m" user="Associate" date="04 Fév" />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}

function DocBadge({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-100 text-xs font-medium text-slate-600">
            <CheckCircle2 className="h-3 w-3 text-slate-300" />
            {label}
        </div>
    )
}

function GeneratedFileCard({ name, size }: { name: string, size: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-orange-200 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <PenTool className="h-4 w-4" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{size}</p>
                </div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-slate-600">
                <Download className="h-4 w-4" />
            </Button>
        </div>
    )
}

function MetricCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</span>
                <div className={cn("p-1.5 rounded-md", color)}>{icon}</div>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
        </div>
    )
}

function ActivityRow({ action, time, user, date }: { action: string, time: string, user: string, date: string }) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500">
                    {user.charAt(0)}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-700">{action}</p>
                    <p className="text-[9px] text-slate-400">{user} • {date}</p>
                </div>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-[9px]">{time}</Badge>
        </div>
    )
}
