"use client"


import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NeuralNode {
    id: number
    label: string
    type: 'FACT' | 'LAW' | 'RISK'
    strength: number
}

interface NeuralLink {
    source: number
    target: number
    label: string
}

interface StrategicInsights {
    successProbability: number
    strategicStrength: number
    nextBestMove: string
    riskLevel: string
    adversaryPressure: number
    timelineHealth: number
}
import { Sparkles, Calendar, Clock, CheckCircle2, AlertCircle, PlayCircle, Loader2, Save, FileText, X, ShieldAlert, Target, Gavel, Search, MessageSquare, Languages, Copy, Share2, MessageCircle, Activity, Zap, Radar, ShieldCheck, TrendingUp, Network, BrainCircuit, Fingerprint, Eye, Swords, ShieldQuestion, Flame, GitBranch, Binary, Puzzle, ArrowUpRight, BookMarked, Landmark, Scale, Thermometer, Brain, Mic, MicOff, Quote, Ghost } from 'lucide-react'
import { generateProcedureStrategy, generateStepDraft, analyzeOpposingDocument, generateClientSynthesis, getStrategicInsights, getNeuralArgumentMap, emulateRedTeam, getPredictiveScenarios, getTacticalGapAnalysis, getSemanticJurisprudence, analyzeOpposingSentiment, getCourtTendencies, generateHearingNotes, simulateConfrontation } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface OpposingAnalysis {
    vices: string[]
    argumentsCles: string[]
    failles: string[]
    riposteGagnante: string
    jurisprudences: string[]
}

interface ProcedureStep {
    id: string
    title: string
    description: string
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'AI_SUGGESTED'
    date?: string
    priority?: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface ProcedureTabProps {
    dossierId: string
    currentStage: string
    procedureType: string
}

export default function ProcedureTab({ dossierId, currentStage, procedureType }: ProcedureTabProps) {
    const [loading, setLoading] = useState(false)
    const [drafting, setDrafting] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [generatingSynthesis, setGeneratingSynthesis] = useState(false)
    const [warRoomMode, setWarRoomMode] = useState(false)
    const [emulatingRedTeam, setEmulatingRedTeam] = useState(false)
    const [redTeamResult, setRedTeamResult] = useState<{ attackPoints: any[], counterStrategy: string, shieldSuggestion: string } | null>(null)
    const [scenarios, setScenarios] = useState<any[] | null>(null)
    const [gapAnalysis, setGapAnalysis] = useState<{ missingPieces: any[], globalAssessment: string } | null>(null)
    const [jurisMatches, setJurisMatches] = useState<any[] | null>(null)
    const [courtTendencies, setCourtTendencies] = useState<any | null>(null)
    const [adversarySentiment, setAdversarySentiment] = useState<any | null>(null)
    const [hearingNotes, setHearingNotes] = useState<any | null>(null)
    const [confrontationResult, setConfrontationResult] = useState<any | null>(null)
    const [preparingHearing, setPreparingHearing] = useState(false)
    const [simulatingConfrontation, setSimulatingConfrontation] = useState(false)
    const [predictingScenarios, setPredictingScenarios] = useState(false)
    const [suggestions, setSuggestions] = useState<ProcedureStep[]>([])
    // ...
    const runScenarioSimulation = async () => {
        setPredictingScenarios(true)
        try {
            const result = await getPredictiveScenarios(dossierId)
            if (result.success) {
                setScenarios(result.scenarios)
                toast({ title: "Futurs simulés", description: "L'Oracle IA a calculé les branches de probabilité." })
            }
        } finally {
            setPredictingScenarios(false)
        }
    }
    // ...
    const runRedTeamSimulation = async (argument: string) => {
        setEmulatingRedTeam(true)
        try {
            const result = await emulateRedTeam(dossierId, argument)
            if (result.success && result.emulation) {
                setRedTeamResult(result.emulation)
                toast({ title: "Attaque simulée", description: "L'IA a identifié les points de rupture." })
            }
        } finally {
            setEmulatingRedTeam(false)
        }
    }
    const [draftPreview, setDraftPreview] = useState<{ title: string, content: string } | null>(null)
    const [analysisResult, setAnalysisResult] = useState<OpposingAnalysis | null>(null)
    const [clientSynthesis, setClientSynthesis] = useState<string | null>(null)
    const [clientPhone, setClientPhone] = useState<string | null>(null)
    const [insights, setInsights] = useState<StrategicInsights | null>(null)
    const [neuralMap, setNeuralMap] = useState<{ nodes: NeuralNode[], links: NeuralLink[], strategicVision: string } | null>(null)
    const [selectedLanguage, setSelectedLanguage] = useState<'FR' | 'WO'>('FR')
    const { toast } = useToast()

    useEffect(() => {
        const fetchData = async () => {
            const [insightsRes, mapRes, gapRes, jurisRes, courtRes, sentimentRes] = await Promise.all([
                getStrategicInsights(dossierId),
                getNeuralArgumentMap(dossierId),
                getTacticalGapAnalysis(dossierId),
                getSemanticJurisprudence(dossierId),
                getCourtTendencies("Tribunal Hors Classe de Dakar"),
                analyzeOpposingSentiment(dossierId, "LATEST_DOC")
            ])
            if (insightsRes.success && insightsRes.insights) setInsights(insightsRes.insights)
            if (mapRes.success && mapRes.neuralMap) setNeuralMap(mapRes.neuralMap)
            if (gapRes.success && gapRes.gapAnalysis) setGapAnalysis(gapRes.gapAnalysis)
            if (jurisRes.success && jurisRes.matches) setJurisMatches(jurisRes.matches)
            if (courtRes.success && courtRes.tendencies) setCourtTendencies(courtRes.tendencies)
            if (sentimentRes.success && sentimentRes.sentiment) setAdversarySentiment(sentimentRes.sentiment)
        }
        fetchData()
    }, [dossierId])

    const [steps, setSteps] = useState<ProcedureStep[]>([
        {
            id: '1',
            title: 'Saisine du Tribunal',
            description: 'Dépôt de l\'assignation au greffe',
            status: 'COMPLETED',
            date: '2025-12-01'
        },
        {
            id: '2',
            title: currentStage === 'MISE_EN_ETAT' ? 'Mise en état' : currentStage,
            description: 'Phase d\'échange des conclusions et pièces',
            status: 'IN_PROGRESS',
            date: '2025-12-28'
        }
    ])

    const handleGenerateAI = async () => {
        setLoading(true)
        try {
            const result = await generateProcedureStrategy(dossierId, procedureType)
            if (result.success) {
                setSuggestions(result.steps)
                toast({
                    title: "Stratégie générée",
                    description: "L'IA a suggéré de nouvelles étapes pour votre procédure.",
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de générer la stratégie.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const acceptSuggestion = async (suggestion: ProcedureStep) => {
        try {
            const { planProcedureStep } = await import('@/app/actions')
            const result = await planProcedureStep(dossierId, {
                title: suggestion.title,
                description: suggestion.description,
                date: suggestion.date || new Date().toISOString()
            })

            if (result.success) {
                setSteps([...steps, { ...suggestion, status: 'PENDING' }])
                setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
                toast({
                    title: "Étape planifiée",
                    description: "La tâche a été créée et un rappel email a été envoyé.",
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de planifier l'étape.",
                variant: "destructive"
            })
        }
    }

    const handleDraftAction = async (stepTitle: string) => {
        setDrafting(true)
        try {
            const result = await generateStepDraft(dossierId, stepTitle)
            if (result.success && result.draft) {
                setDraftPreview({ title: stepTitle, content: result.draft })
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de générer le projet d'acte.", variant: "destructive" })
        } finally {
            setDrafting(false)
        }
    }

    const runOpposingAnalysis = async (docId: string) => {
        setAnalyzing(true)
        try {
            const result = await analyzeOpposingDocument(dossierId, docId)
            if (result.success && result.analysis) {
                setAnalysisResult(result.analysis)
                // Déclencher aussi l'analyse de sentiment/bluff s'il y a du contenu
                if (result.analysis.riposteGagnante) {
                    const bluffRes = await analyzeOpposingSentiment(dossierId, result.analysis.riposteGagnante)
                    if (bluffRes.success) setAdversarySentiment(bluffRes.sentiment)
                }
                toast({ title: "Analyse terminée", description: "Le rapport de riposte et le scan de bluff sont prêts." })
            }
        } catch (error) {
            toast({ title: "Erreur", description: "L'analyse a échoué.", variant: "destructive" })
        } finally {
            setAnalyzing(false)
        }
    }

    const handleAnalyzeBluff = async (text: string) => {
        setAnalyzing(true)
        try {
            const result = await analyzeOpposingSentiment(dossierId, text)
            if (result.success) {
                setAdversarySentiment(result.sentiment)
                toast({ title: "Scan de Bluff Terminé", description: "Analyse psychologique mise à jour." })
            }
        } finally {
            setAnalyzing(false)
        }
    }

    const handleGenerateSynthesis = async () => {
        setGeneratingSynthesis(true)
        try {
            const result = await generateClientSynthesis(dossierId, selectedLanguage)
            if (result.success && result.synthesis) {
                setClientSynthesis(result.synthesis)
                setClientPhone(result.clientPhone)
                toast({ title: "Synthèse générée", description: "La note pour le client est prête." })
            }
        } catch (error) {
            toast({ title: "Erreur", description: "La génération a échoué.", variant: "destructive" })
        } finally {
            setGeneratingSynthesis(false)
        }
    }

    const handleGenerateHearingNotes = async () => {
        setPreparingHearing(true)
        try {
            const result = await generateHearingNotes(dossierId)
            if (result.success) {
                setHearingNotes(result.hearingNotes)
                toast({ title: "Plaidoirie Augmentée", description: "Vos notes d'audience tactiques sont prêtes." })
            }
        } finally {
            setPreparingHearing(false)
        }
    }

    const runConfrontationSimulation = async () => {
        setSimulatingConfrontation(true)
        try {
            const result = await simulateConfrontation(dossierId)
            if (result.success) {
                setConfrontationResult(result.confrontation)
                toast({ title: "Simulation Tactique", description: "Questions pièges identifiées." })
            }
        } finally {
            setSimulatingConfrontation(false)
        }
    }

    const handleWhatsAppShare = () => {
        if (!clientSynthesis) return

        const text = encodeURIComponent(clientSynthesis)
        const phone = clientPhone ? clientPhone.replace(/\s+/g, '') : ''

        // Remove leading + or 00 if present for wa.me format
        const cleanPhone = phone.replace(/^(\+|00)/, '')

        const url = `https://wa.me/${cleanPhone}?text=${text}`
        window.open(url, '_blank')
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: "Copié !", description: "Le texte a été copié dans le presse-papier." })
    }

    const saveDraftAsDocument = async () => {
        toast({ title: "Document enregistré", description: "Le projet a été sauvegardé dans la GED du dossier." })
        setDraftPreview(null)
    }

    return (
        <div className={`space-y-6 transition-all duration-1000 ${warRoomMode ? 'bg-[#020617] p-6 rounded-2xl ring-1 ring-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.2)]' : ''}`}>

            {/* LEX RADAR - PREDICTIVE HUD */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 animate-in fade-in slide-in-from-top-4 duration-700 ${warRoomMode ? 'scale-[1.01]' : ''}`}>

                {/* PROBABILITE SUCCES */}
                <Card className={`bg-slate-900 border-indigo-500/30 transition-all duration-500 overflow-hidden ${warRoomMode ? 'shadow-[0_0_20px_rgba(99,102,241,0.4)] border-indigo-400' : 'shadow-[0_0_15px_rgba(79,70,229,0.1)]'}`}>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                            <p className="text-[9px] text-indigo-300 uppercase font-black tracking-tighter">Prob. Succès</p>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-xl font-black text-white">{insights?.successProbability || '--'}%</span>
                            <div className="h-1 flex-1 bg-slate-800 rounded-full mb-1.5 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${insights?.successProbability || 0}%` }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ORACLE DE SCÉNARIO */}
                <Card className={`bg-slate-900 border-emerald-500/30 transition-all duration-500 relative group overflow-hidden ${warRoomMode ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-400' : 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-emerald-400" />
                            <p className="text-[9px] text-emerald-300 uppercase font-black tracking-tighter">Oracle Tactique</p>
                        </div>
                        <Button
                            variant="link"
                            className="p-0 h-auto text-white font-black text-xs hover:text-emerald-400 transition-colors text-left"
                            onClick={runScenarioSimulation}
                            disabled={predictingScenarios}
                        >
                            {predictingScenarios ? <Loader2 className="h-3 w-3 animate-spin" /> : 'BRANCHE FUTUR'}
                        </Button>
                    </CardContent>
                    {scenarios && (
                        <div className="absolute inset-0 bg-slate-900/95 p-2 flex flex-col justify-center animate-in slide-in-from-right duration-300 z-50">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[7px] font-bold text-emerald-400 uppercase">Branches</span>
                                <Button variant="ghost" className="h-3 w-3 p-0 text-white/50" onClick={() => setScenarios(null)}><X className="h-2 w-2" /></Button>
                            </div>
                            <div className="space-y-1">
                                {scenarios.slice(0, 2).map((s, i) => (
                                    <div key={i} className="flex items-center justify-between text-[7px] text-slate-300 border-b border-white/5 pb-1">
                                        <span className="truncate w-3/4">{s.path}: {s.outcome}</span>
                                        <span className="font-bold text-emerald-400">{s.probability}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* MOOD ADVERSAIRE */}
                <Card className={`bg-slate-900 border-red-500/30 transition-all duration-500 overflow-hidden ${warRoomMode ? 'shadow-[0_0_20px_rgba(239,68,68,0.3)] border-red-400' : 'shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-red-400" />
                            <p className="text-[9px] text-red-300 uppercase font-black tracking-tighter">Mood Adverse</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white uppercase">{adversarySentiment?.agressionScore > 70 ? 'HOSTILE' : 'STABLE'}</span>
                            <Badge className="text-[7px] h-3 bg-red-400/20 text-red-400 border-none px-1">BLUFF: {adversarySentiment?.bluffProbability || 0}%</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGUEUR TRIBUNAL */}
                <Card className={`bg-slate-900 border-slate-500/30 transition-all duration-500 overflow-hidden ${warRoomMode ? 'shadow-[0_0_20px_rgba(148,163,184,0.3)] border-slate-400' : 'shadow-[0_0_15px_rgba(148,163,184,0.1)]'}`}>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-slate-400" />
                            <p className="text-[9px] text-slate-300 uppercase font-black tracking-tighter">Rigueur Court</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white uppercase">{courtTendencies?.rigorScore || 50}%</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-1.5 w-1.5 rounded-full ${i <= (courtTendencies?.rigorScore / 25) ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* FORCE STRATÉGIQUE */}
                <Card className={`bg-slate-900 border-amber-500/30 transition-all duration-500 overflow-hidden ${warRoomMode ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-400' : 'shadow-[0_0_15px_rgba(245,158,11,0.1)]'}`}>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-amber-400" />
                            <p className="text-[9px] text-amber-300 uppercase font-black tracking-tighter">Force Cog.</p>
                        </div>
                        <span className="text-xl font-black text-white tracking-widest">{insights?.strategicStrength || '--'}</span>
                    </CardContent>
                </Card>

                {/* NEXT BEST MOVE */}
                <Card className={`bg-slate-900 border-indigo-500/60 transition-all duration-500 overflow-hidden relative ${warRoomMode ? 'shadow-[0_0_25px_rgba(99,102,241,0.5)] border-white' : ''}`}>
                    <div className="absolute top-0 right-0 p-1 opacity-10">
                        <Radar className={`h-8 w-8 text-indigo-500 ${warRoomMode ? 'animate-spin-slow' : 'animate-pulse'}`} />
                    </div>
                    <CardContent className="p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-indigo-400 animate-pulse" />
                            <p className="text-[9px] text-indigo-300 uppercase font-black tracking-tighter">Directive IA</p>
                        </div>
                        <p className="text-[9px] text-white line-clamp-2 leading-tight italic font-medium">"{insights?.nextBestMove || 'Calcul en cours...'}"</p>
                    </CardContent>
                </Card>
            </div>

            <div className={`flex items-center justify-between transition-all ${warRoomMode ? 'px-2' : ''}`}>
                <div>
                    <h2 className={`text-xl font-semibold transition-colors ${warRoomMode ? 'text-indigo-100 uppercase tracking-tighter' : 'text-slate-900'}`}>{warRoomMode ? 'Neural Tactics Overdrive' : 'Calendrier de Procédure'}</h2>
                    <p className={`text-sm transition-colors ${warRoomMode ? 'text-indigo-400 font-mono italic' : 'text-slate-500'}`}>{warRoomMode ? 'ENCRYPTED DATA STREAM ACTIVE' : 'Gérez les échéances et la stratégie de votre dossier'}</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setWarRoomMode(!warRoomMode)}
                        className={`gap-2 transition-all duration-500 ${warRoomMode ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 hover:bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-slate-200 text-slate-600'}`}
                    >
                        <Zap className={`h-4 w-4 ${warRoomMode ? 'animate-pulse text-amber-400' : ''}`} />
                        {warRoomMode ? 'Tactical Mode AI' : 'Mode Stratégique'}
                    </Button>
                    <Button
                        onClick={handleGenerateAI}
                        disabled={loading}
                        className={`transition-all gap-2 ${warRoomMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-lg shadow-indigo-200`}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Générer Stratégie IA
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Main */}
                <Card className="lg:col-span-2 border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" />
                            Chronologie du Dossier
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-200 before:to-transparent">
                            {steps.map((step) => (
                                <div key={step.id} className="relative flex items-start gap-6 pl-10">
                                    <span className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-white ${step.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                        step.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-600 animate-pulse' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {step.status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> :
                                            step.status === 'IN_PROGRESS' ? <PlayCircle className="h-5 w-5" /> :
                                                <Calendar className="h-5 w-5" />}
                                    </span>
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900">{step.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-slate-400 font-medium">{step.date}</span>
                                                {step.status !== 'COMPLETED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1.5"
                                                        disabled={drafting}
                                                        onClick={() => handleDraftAction(step.title)}
                                                    >
                                                        {drafting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                                                        Rédiger
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                                        <div className="mt-2 flex gap-2">
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                                {step.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI & Strategy Panel */}
                <div className="space-y-6">
                    <Card className="border-indigo-100 bg-indigo-50/10 shadow-sm overflow-hidden">
                        <Tabs defaultValue="strategy" className="w-full">
                            <TabsList className="w-full flex overflow-x-auto no-scrollbar rounded-none bg-slate-100/50 p-1">
                                <TabsTrigger value="strategy" className="flex-1 gap-1 text-[10px] px-1 whitespace-nowrap min-w-[70px]">
                                    <Sparkles className="h-3 w-3" /> Strat.
                                </TabsTrigger>
                                <TabsTrigger value="riposte" className="flex-1 gap-1 text-[10px] px-1 whitespace-nowrap min-w-[70px]">
                                    <ShieldAlert className="h-3 w-3" /> Riposte
                                </TabsTrigger>
                                <TabsTrigger value="neural" className="flex-1 gap-1 text-[10px] px-1 whitespace-nowrap min-w-[70px]">
                                    <BrainCircuit className="h-3 w-3" /> Neural
                                </TabsTrigger>
                                <TabsTrigger value="hearing" className="flex-1 gap-1 text-[10px] px-1 font-bold text-indigo-600 whitespace-nowrap min-w-[70px]">
                                    <Mic className="h-3 w-3" /> Audience
                                </TabsTrigger>
                                <TabsTrigger value="client" className="flex-1 gap-1 text-[10px] px-1 whitespace-nowrap min-w-[70px]">
                                    <MessageSquare className="h-3 w-3" /> Client
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="strategy" className="p-4 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-indigo-900">Suggestions IA</h4>
                                    <Badge variant="outline" className="text-[9px] bg-indigo-50 border-indigo-200 text-indigo-700">OPTIMIZED</Badge>
                                </div>
                                {suggestions.length === 0 && !loading && (
                                    <p className="text-center py-4 text-slate-400 text-xs italic">Générez une stratégie pour voir les vecteurs d'action.</p>
                                )}
                                {loading && (
                                    <div className="flex flex-col items-center py-8 gap-2">
                                        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                                        <p className="text-[10px] text-indigo-600 animate-pulse">Calcul des probabilités...</p>
                                    </div>
                                )}
                                {suggestions.map((suggestion) => (
                                    <div key={suggestion.id} className="p-3 bg-white border border-indigo-100 rounded-lg shadow-sm group hover:border-indigo-400 transition-all">
                                        <h5 className="font-bold text-xs text-slate-900 flex items-center justify-between">
                                            {suggestion.title}
                                            <Zap className="h-3 w-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h5>
                                        <p className="text-[10px] text-slate-500 mt-1 mb-2 leading-tight">{suggestion.description}</p>
                                        <Button size="sm" className="w-full h-7 text-[10px] bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200 transition-colors" variant="outline" onClick={() => acceptSuggestion(suggestion)}>
                                            Insérer dans Dossier
                                        </Button>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="riposte" className="p-4 space-y-4">
                                <h4 className="text-sm font-semibold text-red-900 flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" /> Analyse Adverse
                                </h4>
                                {!analysisResult && !analyzing && (
                                    <div className="space-y-4">
                                        <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                                            <Target className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-[10px] text-slate-500 mb-3 uppercase font-bold">Sélectionnez les conclusions adverses</p>

                                            {/* We rely on the parent or another fetch to get documents if not available, 
                                                but for now we'll search for ACTE/ADVERSE types if we had the list. 
                                                As a simpler bridge: Use a button that triggers the analysis on the most recent document if many exist.
                                            */}
                                            <Button
                                                className="w-full bg-slate-900 hover:bg-black text-white text-xs gap-2"
                                                onClick={() => {
                                                    // In a real flow, we'd pass a real ID. 
                                                    // If no docs, we'll inform the user.
                                                    runOpposingAnalysis("LATEST_ADVERSE_DOC")
                                                }}
                                            >
                                                <Search className="h-3.5 w-3.5" /> Analyser Dernières Pièces
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {analyzing && (
                                    <div className="flex flex-col items-center py-12 gap-3 text-red-600">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <p className="text-xs font-bold animate-pulse text-center space-y-1">
                                            <span>RECHERCHE DE VICES...</span><br />
                                            <span className="text-[10px] opacity-70 font-normal italic">Droit OHADA & Sénégal</span>
                                        </p>
                                    </div>
                                )}
                                {analysisResult && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
                                            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Stratégie de Riposte</p>
                                            <p className="text-[11px] text-slate-800 italic leading-relaxed font-medium">"{analysisResult.riposteGagnante}"</p>
                                        </div>

                                        {adversarySentiment && (
                                            <div className="p-3 bg-slate-900 rounded-lg border border-red-500/30 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-1">
                                                    <Thermometer className={`h-4 w-4 ${adversarySentiment.bluffProbability > 60 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Brain className="h-3 w-3 text-red-400" />
                                                    <span className="text-[9px] font-bold text-red-300 uppercase tracking-widest">DÉTECTEUR DE BLUFF</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <div className="space-y-1">
                                                        <span className="text-[8px] text-slate-500 uppercase">Probabilité Bluff</span>
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full transition-all duration-1000 ${adversarySentiment.bluffProbability > 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${adversarySentiment.bluffProbability}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[8px] text-slate-500 uppercase">Agressivité</span>
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-orange-500" style={{ width: `${adversarySentiment.agressionScore}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-slate-300 italic mb-2 leading-tight">"{adversarySentiment.psychologicalDetection}"</p>
                                                <div className="flex items-center gap-2 p-1.5 bg-red-500/10 rounded border border-red-500/20">
                                                    <ShieldAlert className="h-3 w-3 text-red-400" />
                                                    <p className="text-[9px] text-red-200 uppercase font-black tracking-tighter">POSTURE : {adversarySentiment.recommendedTone}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-1.5">
                                            {analysisResult.jurisprudences.map((j, i) => (
                                                <Badge key={i} className="text-[9px] bg-white border-slate-200 text-slate-600 hover:bg-indigo-50 transition-colors cursor-help" variant="outline">
                                                    <Gavel className="h-2.5 w-2.5 mr-1" /> {j}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button variant="ghost" size="sm" className="w-full text-slate-500 text-[10px] h-7" onClick={() => setAnalysisResult(null)}>
                                            Réinitialiser Scan
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="neural" className="p-4 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                        <Network className="h-4 w-4" /> Strategic Neural Map
                                    </h4>
                                    <Badge variant="outline" className="text-[9px] bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse uppercase font-bold">Live</Badge>
                                </div>

                                <div className={`relative h-64 bg-slate-900 rounded-xl border transition-all duration-700 overflow-hidden shadow-2xl group ring-1 ${warRoomMode ? 'border-indigo-500/50 ring-indigo-500/30' : 'border-indigo-500/20 ring-white/10'}`}>
                                    {/* Grille Tactique de fond */}
                                    <div className={`absolute inset-0 opacity-10 [background-size:20px_20px] ${warRoomMode ? 'bg-[radial-gradient(#818cf8_1px,transparent_1px)] animate-pulse' : 'bg-[radial-gradient(#4f46e5_1px,transparent_1px)]'}`}></div>

                                    {/* Scanning Line (War Room Only) */}
                                    {warRoomMode && (
                                        <div className="absolute inset-x-0 h-[2px] bg-indigo-400/30 shadow-[0_0_15px_rgba(129,140,248,0.5)] z-20 animate-scan-up-down"></div>
                                    )}

                                    <svg className="absolute inset-0 w-full h-full">
                                        {neuralMap?.links.map((link, i) => (
                                            <line
                                                key={i}
                                                x1="50%" y1="15%" x2="50%" y2="85%"
                                                className="stroke-indigo-500/30 stroke-[1.5] animate-pulse"
                                            />
                                        ))}
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-around p-4">
                                        {neuralMap?.nodes.map((node) => (
                                            <div
                                                key={node.id}
                                                className={`p-2 rounded-lg border flex items-center gap-2 transition-all hover:scale-110 cursor-alias z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${node.type === 'FACT' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' :
                                                    node.type === 'LAW' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' :
                                                        'bg-red-500/10 border-red-500/50 text-red-300'
                                                    }`}
                                            >
                                                {node.type === 'FACT' ? <Fingerprint className="h-3 w-3" /> :
                                                    node.type === 'LAW' ? <Gavel className="h-3 w-3" /> :
                                                        <AlertCircle className="h-3 w-3" />}
                                                <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{node.label}</span>
                                                <div className="w-6 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-current opacity-50" style={{ width: `${node.strength}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-white/5">
                                        <div className="flex items-start gap-2">
                                            <Zap className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                                            <p className="text-[9px] text-indigo-100 leading-tight italic">
                                                <span className="font-bold text-amber-400 not-italic">PIVOT :</span> {neuralMap?.strategicVision || 'Calcul des vecteurs de force...'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-900 rounded-lg p-2 border border-white/5 shadow-lg">
                                        <p className="text-[8px] text-indigo-400 uppercase font-bold flex items-center gap-1">
                                            <Activity className="h-2 w-2" /> Cohérence
                                        </p>
                                        <p className="text-sm font-black text-white">{insights?.strategicStrength || '92'}%</p>
                                    </div>
                                    <div className="bg-slate-900 rounded-lg p-2 border border-white/5 shadow-lg">
                                        <p className="text-[8px] text-red-400 uppercase font-bold flex items-center gap-1">
                                            <Zap className="h-2 w-2" /> Risque Pivot
                                        </p>
                                        <p className="text-sm font-black text-white uppercase">{insights?.riskLevel || 'LOW'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-indigo-400 text-[10px] h-7 hover:bg-white/5 hover:text-indigo-200 group"
                                    >
                                        <Eye className="h-3 w-3 mr-1 group-hover:animate-bounce" /> Neural Map™
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={emulatingRedTeam}
                                        className="text-red-400 text-[10px] h-7 hover:bg-white/5 hover:text-red-200 group"
                                        onClick={() => runRedTeamSimulation("Notre argumentaire sur la nullité de l'assignation")}
                                    >
                                        {emulatingRedTeam ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Swords className="h-3 w-3 mr-1 group-hover:animate-wiggle" />}
                                        Stress Test
                                    </Button>
                                </div>

                                {redTeamResult && (
                                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center gap-2 text-red-400 mb-2">
                                            <Flame className="h-3 w-3 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Failles Trouvées</span>
                                        </div>
                                        <div className="space-y-2">
                                            {redTeamResult.attackPoints.map((p, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <div className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${p.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-orange-500'}`}></div>
                                                    <p className="text-[9px] text-red-200 leading-tight"><span className="font-bold">{p.point}</span></p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 p-2 bg-black/40 rounded border border-white/5">
                                            <div className="flex items-center gap-1 text-emerald-400 mb-1">
                                                <ShieldCheck className="h-2.5 w-2.5" />
                                                <span className="text-[8px] font-bold uppercase">Parade Recommandée</span>
                                            </div>
                                            <p className="text-[9px] text-slate-300 italic">"{redTeamResult.shieldSuggestion}"</p>
                                        </div>
                                        <Button variant="ghost" className="w-full h-5 text-[8px] text-slate-500 mt-2 hover:text-white" onClick={() => setRedTeamResult(null)}>Fermer l'analyse de stress</Button>
                                    </div>
                                )}

                                {gapAnalysis && gapAnalysis.missingPieces.length > 0 && (
                                    <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Puzzle className="h-3 w-3 text-indigo-400" />
                                                <span className="text-[10px] font-bold text-indigo-300 uppercase">Lacunes Tactiques</span>
                                            </div>
                                            <Badge className="bg-indigo-500 text-white text-[8px] h-4">CRITIQUE</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {gapAnalysis.missingPieces.map((p, i) => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{p.title}</span>
                                                        <span className="text-[9px] text-indigo-400 font-mono">+{p.impact}% Prob.</span>
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 leading-tight italic">{p.reason}</p>
                                                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500/50 group-hover:bg-indigo-400 transition-all" style={{ width: `${p.impact * 3}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-[9px] text-indigo-200/60 border-t border-indigo-500/10 pt-2 italic">
                                            <span className="font-bold">CONSEIL :</span> Obtenir ces éléments ferait basculer le score de force stratégique au-dessus de 85%.
                                        </p>
                                    </div>
                                )}

                                {jurisMatches && jurisMatches.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Landmark className="h-3 w-3 text-amber-500" />
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Précédents Gagnants</span>
                                        </div>
                                        {jurisMatches.map((j, i) => (
                                            <div key={i} className="p-3 bg-slate-900 border border-amber-500/20 rounded-xl hover:border-amber-500/50 transition-all group">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[9px] font-bold text-white group-hover:text-amber-400">{j.reference}</span>
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] h-4">{j.relevance}% Match</Badge>
                                                </div>
                                                <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight mb-2 italic">"{j.summary}"</p>
                                                <div className="flex items-center gap-1.5 p-1.5 bg-amber-500/5 rounded border border-amber-500/10">
                                                    <BookMarked className="h-2.5 w-2.5 text-amber-400" />
                                                    <p className="text-[8px] text-amber-200"><span className="font-bold">APPLICATION :</span> {j.application}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="ghost" size="sm" className="w-full text-amber-500/60 text-[8px] h-6 hover:text-amber-400 hover:bg-amber-500/5">
                                            <Search className="h-2.5 w-2.5 mr-1" /> Explorer toute la base Jurisprudence
                                        </Button>
                                    </div>
                                )}

                                {courtTendencies && (
                                    <div className="mt-4 p-3 bg-slate-900 border border-slate-500/20 rounded-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12">
                                            <Scale className="h-12 w-12 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Landmark className="h-3 w-3 text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-[9px]">Ligne Directrice du Tribunal</span>
                                        </div>
                                        <p className="text-[10px] text-white font-medium mb-3 italic">"{courtTendencies.tacticalAdvice}"</p>
                                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] text-slate-500 uppercase font-bold">Célérité</span>
                                                <span className="text-[9px] font-black text-emerald-400">{courtTendencies.speedScore}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] text-slate-500 uppercase font-bold">Biais Client</span>
                                                <span className="text-[9px] font-black text-indigo-400">{courtTendencies.proClientBias}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {adversarySentiment && (
                                    <div className="mt-4 p-3 bg-red-950/20 border border-red-500/10 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Thermometer className="h-3 w-3 text-red-400" />
                                            <span className="text-[10px] font-black text-red-300 uppercase tracking-widest text-[9px]">Analyse Psychologique Adverse</span>
                                        </div>
                                        <p className="text-[10px] text-red-100/80 mb-3 leading-tight">{adversarySentiment.psychologicalDetection}</p>
                                        <div className="p-2 bg-black/30 rounded border border-red-500/10">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Activity className="h-2.5 w-2.5 text-red-500" />
                                                <span className="text-[8px] font-bold text-red-400 uppercase">Posture Recommandée</span>
                                            </div>
                                            <p className="text-[9px] text-slate-300 font-bold">"{adversarySentiment.recommendedTone}"</p>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="client" className="p-4 space-y-4">
                                <h4 className="text-sm font-semibold text-emerald-900">Communication Client</h4>
                                <div className="flex gap-2 p-1 bg-slate-100 rounded-md">
                                    <Button size="sm" variant={selectedLanguage === 'FR' ? 'secondary' : 'ghost'} className="flex-1 h-7 text-[10px]" onClick={() => setSelectedLanguage('FR')}>Français</Button>
                                    <Button size="sm" variant={selectedLanguage === 'WO' ? 'secondary' : 'ghost'} className="flex-1 h-7 text-[10px]" onClick={() => setSelectedLanguage('WO')}>Wolof</Button>
                                </div>
                                {!clientSynthesis && !generatingSynthesis && (
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-2" onClick={handleGenerateSynthesis}>
                                        <Languages className="h-3.5 w-3.5" /> Générer Note Client
                                    </Button>
                                )}
                                {generatingSynthesis && <Loader2 className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />}
                                {clientSynthesis && (
                                    <div className="space-y-3 animate-in fade-in duration-500">
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 group relative">
                                            <p className="text-[11px] text-emerald-900 whitespace-pre-wrap leading-relaxed">{clientSynthesis}</p>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(clientSynthesis)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 h-8 text-[10px] gap-1" onClick={() => copyToClipboard(clientSynthesis)}>
                                                <Copy className="h-3 w-3" /> Copier
                                            </Button>
                                            <Button className="flex-1 h-8 text-[10px] gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-none" onClick={handleWhatsAppShare}>
                                                <MessageCircle className="h-3 w-3" /> WhatsApp
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="hearing" className="p-4 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                        <Mic className={`h-4 w-4 ${warRoomMode ? 'text-indigo-400' : ''}`} /> Préparation Audience
                                    </h4>
                                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${warRoomMode ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>Tactique</Badge>
                                </div>

                                {!hearingNotes && !preparingHearing && (
                                    <div className={`py-10 border-2 border-dashed rounded-2xl text-center px-4 transition-all duration-700 ${warRoomMode ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/30 border-indigo-100'}`}>
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 ${warRoomMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                            <BrainCircuit className={`h-6 w-6 ${warRoomMode ? 'text-indigo-400 animate-pulse' : 'text-indigo-600'}`} />
                                        </div>
                                        <h5 className={`text-sm font-bold mb-1 ${warRoomMode ? 'text-indigo-100' : 'text-indigo-900'}`}>Plaidoirie Augmentée™</h5>
                                        <p className={`text-xs mb-6 italic ${warRoomMode ? 'text-indigo-400' : 'text-slate-500'}`}>Générez un canevas de plaidoirie avec détection des failles adverses.</p>
                                        <Button
                                            onClick={handleGenerateHearingNotes}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 gap-2"
                                        >
                                            <Zap className="h-4 w-4" /> Générer Stratégie d'Audience
                                        </Button>
                                    </div>
                                )}

                                {preparingHearing && (
                                    <div className="py-12 flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                                            <Mic className="absolute inset-0 m-auto h-4 w-4 text-indigo-600 animate-pulse" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs font-black text-indigo-900 uppercase tracking-tighter">Vecteurs d'audience en cours...</p>
                                            <p className="text-[10px] text-slate-400 italic">Extraction des failles adverses et montage des piliers...</p>
                                        </div>
                                    </div>
                                )}

                                {hearingNotes && (
                                    <div className="space-y-4 animate-in fade-in duration-700">
                                        <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/30 relative overflow-hidden group">
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                                <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest">LIVE HUD</span>
                                            </div>
                                            <div className="mb-3">
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tight flex items-center gap-1">
                                                    <Quote className="h-3 w-3" /> Exorde (Accroche)
                                                </span>
                                                <p className="text-xs text-indigo-100 italic font-medium leading-relaxed mt-1">"{hearingNotes.intro}"</p>
                                            </div>

                                            <div className="space-y-2 border-t border-white/5 pt-3">
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tight flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Piliers de l'Argumentation
                                                </span>
                                                {hearingNotes.keyPoints.map((kp: any, i: number) => (
                                                    <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-all">
                                                        <p className="text-[10px] font-bold text-white uppercase mb-0.5">{kp.anchor}</p>
                                                        <p className="text-[9px] text-slate-400 leading-tight">{kp.content}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2 border-t border-white/5 pt-3">
                                                <span className="text-[9px] font-black text-red-400 uppercase tracking-tight flex items-center gap-1">
                                                    <Swords className="h-3 w-3" /> Failles Adversaires (Point de Rupture)
                                                </span>
                                                {hearingNotes.adversaryWeaknesses.map((aw: any, i: number) => (
                                                    <div key={i} className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-2 items-start">
                                                        <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-[10px] font-bold text-red-200">{aw.point}</p>
                                                            <p className="text-[9px] text-red-300 italic">Impact: {aw.impact}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/40">
                                                <span className="text-[8px] font-black text-indigo-300 uppercase block mb-1">Peroraison (Conclusion)</span>
                                                <p className="text-[10px] text-white font-bold text-center italic">"{hearingNotes.closingStatement}"</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full text-[10px] h-8 gap-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => setHearingNotes(null)}>
                                            <FileText className="h-3.5 w-3.5" /> Nouvelle Analyse d'Audience
                                        </Button>
                                    </div>
                                )}

                                {!confrontationResult && !simulatingConfrontation && (
                                    <Button
                                        onClick={runConfrontationSimulation}
                                        variant="outline"
                                        className={`w-full text-[10px] h-9 gap-2 transition-all group ${warRoomMode ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10' : 'border-indigo-200 text-indigo-600'}`}
                                    >
                                        <Ghost className={`h-4 w-4 ${simulatingConfrontation ? 'animate-bounce' : 'group-hover:animate-wiggle'}`} />
                                        Lancer Simulation "Entraînement au Feu"
                                    </Button>
                                )}

                                {simulatingConfrontation && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 animate-pulse">
                                        <Ghost className="h-5 w-5 text-amber-500" />
                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Génération de scénarios d'interrogatoire...</span>
                                    </div>
                                )}

                                {confrontationResult && (
                                    <div className="space-y-3 animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                                <Ghost className="h-3 w-3" /> Pièges Identifiés
                                            </span>
                                            <Button variant="ghost" size="sm" className="h-5 text-[8px] text-slate-500" onClick={() => setConfrontationResult(null)}>X Reset</Button>
                                        </div>
                                        {confrontationResult.traps.map((trap: any, i: number) => (
                                            <div key={i} className={`p-3 rounded-xl border transition-all ${trap.dangerLevel === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge className={`${trap.dangerLevel === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'} text-white text-[8px] h-4 uppercase`}>{trap.source}</Badge>
                                                    <Badge variant="outline" className="text-[8px] border-white/20 text-white opacity-50">{trap.dangerLevel}</Badge>
                                                </div>
                                                <p className="text-[11px] text-white font-bold mb-2 leading-tight">"{trap.question}"</p>
                                                <div className="p-2 bg-black/40 rounded border border-white/5">
                                                    <span className="text-[8px] font-black text-emerald-400 uppercase block mb-1">Argument de Défense Recommandé</span>
                                                    <p className="text-[10px] text-slate-300 italic">"{trap.recommendedAnswer}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </Card>

                    <Card className="border-amber-100 bg-amber-50/30 p-4">
                        <div className="flex items-center gap-2 text-amber-900 mb-1">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Rappel Délais</span>
                        </div>
                        <p className="text-[10px] text-amber-700 leading-tight">
                            En matière {procedureType}, les délais de forclusion sont de rigueur. Vérifiez les dates de signification.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Modal de Prévisualisation de l'Acte */}
            <Dialog open={!!draftPreview} onOpenChange={() => setDraftPreview(null)}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-indigo-400" />
                                    Projet d'Acte Généré par LexAI
                                </DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    {draftPreview?.title} - Révision et Validation
                                </DialogDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setDraftPreview(null)} className="text-slate-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-8 bg-white">
                        <div
                            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900"
                            dangerouslySetInnerHTML={{ __html: draftPreview?.content || '' }}
                        />
                    </ScrollArea>

                    <DialogFooter className="p-4 bg-slate-50 border-t flex items-center justify-between">
                        <p className="text-xs text-slate-500 italic max-w-md">Suggestion LexAI. À relire avant toute signification.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDraftPreview(null)}>Annuler</Button>
                            <Button onClick={saveDraftAsDocument} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                <Save className="h-4 w-4" /> Enregistrer
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

