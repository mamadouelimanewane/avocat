"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Clock,
    Gavel,
    Sparkles,
    Brain,
    Bot,
    Activity,
    Filter,
    Mic,
    Globe,
    GitBranch,
    Library,
    Zap,
    PenTool,
    LineChart,
    Briefcase,
    Radar,
    Handshake,
    BrainCircuit,
    Fingerprint,
    Headphones
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DocumentsTab from '@/components/dossier/DocumentsTab'
import FinanceTab from '@/components/dossier/FinanceTab'
import ExpensesTab from '@/components/dossier/ExpensesTab'
import DossierOverview from '@/components/dossier/DossierOverview'
import ProcedureTab from '@/components/dossier/ProcedureTab'
import { JusticePredictor } from '@/components/ai/JusticePredictor'
import { LexAIPanel } from '@/components/dossier/LexAIPanel'
import { WarRoomMode } from '@/components/dossier/WarRoomMode'
import { LexLegalCopilot } from '@/components/ai/LexLegalCopilot'
import { LexAnalyticalAssociate } from '@/components/ai/LexAnalyticalAssociate'
import { LexSifterPro } from '@/components/ai/LexSifterPro'
import { LexAudio } from '@/components/ai/LexAudio'
import { LexNexus } from '@/components/ai/LexNexus'
import { LexLogicArchitect } from '@/components/ai/LexLogicArchitect'
import { LexMateria } from '@/components/ai/LexMateria'
import { LexAutomata } from '@/components/ai/LexAutomata'
import { LexDesignStudio } from '@/components/ai/LexDesignStudio'
import { LexPredictor } from '@/components/ai/LexPredictor'
import { LexClosing } from '@/components/ai/LexClosing'
import { LexSentinel } from '@/components/ai/LexSentinel'
import { LexMediator } from '@/components/ai/LexMediator'
import { LexVoice } from '@/components/ai/LexVoice'
import { LexBotUniverse } from '@/components/ai/LexBotUniverse'
import { LexStrategy } from '@/components/ai/LexStrategy'
import { LexLive } from '@/components/ai/LexLive'
import { LexTwin } from '@/components/ai/LexTwin'
import { LexFlow } from '@/components/ai/LexFlow'
import { AnimatePresence, motion } from 'framer-motion'

interface DossierDetailClientProps {
    dossier: any
    templates: any[]
    expenses: any[]
}

export default function DossierDetailClient({ dossier, templates, expenses }: DossierDetailClientProps) {
    const [isWarRoomOpen, setIsWarRoomOpen] = useState(false)
    const [isLexAIOpen, setIsLexAIOpen] = useState(false)
    const [isCopilotOpen, setIsCopilotOpen] = useState(false)
    const [isAnalyticalOpen, setIsAnalyticalOpen] = useState(false)
    const [isSifterOpen, setIsSifterOpen] = useState(false)
    const [isAudioOpen, setIsAudioOpen] = useState(false)
    const [isNexusOpen, setIsNexusOpen] = useState(false)
    const [isLogicOpen, setIsLogicOpen] = useState(false)
    const [isMateriaOpen, setIsMateriaOpen] = useState(false)
    const [isAutomataOpen, setIsAutomataOpen] = useState(false)
    const [isDesignOpen, setIsDesignOpen] = useState(false)
    const [isPredictOpen, setIsPredictOpen] = useState(false)
    const [isClosingOpen, setIsClosingOpen] = useState(false)
    const [isSentinelOpen, setIsSentinelOpen] = useState(false)
    const [isMediatorOpen, setIsMediatorOpen] = useState(false)
    const [isVoiceOpen, setIsVoiceOpen] = useState(false)
    const [isBotHubOpen, setIsBotHubOpen] = useState(false)
    const [isStrategyOpen, setIsStrategyOpen] = useState(false)
    const [isLiveOpen, setIsLiveOpen] = useState(false)
    const [isTwinOpen, setIsTwinOpen] = useState(false)
    const [isFlowOpen, setIsFlowOpen] = useState(false)

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            <div className="flex-1 space-y-6 w-full min-w-0">
                {/* War Room Overlay */}
                {isWarRoomOpen && (
                    <WarRoomMode dossier={dossier} onClose={() => setIsWarRoomOpen(false)} />
                )}

                {/* Top Navigation */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <Link href="/dossiers" className="hover:text-slate-900 flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Dossiers
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-slate-900">{dossier.reference}</span>
                </div>

                {/* Header Info */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{dossier.title}</h1>
                            <Badge variant={dossier.status === 'OUVERT' ? 'success' : 'default'}>
                                {dossier.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 mt-2 text-base md:text-lg">
                            Client : <span className="font-semibold text-slate-800">{dossier.client?.name}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Link href={`/dossiers/${dossier.id}/war-room`} className="w-full sm:w-auto">
                            <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] border-none h-11 md:h-9"
                            >
                                <Brain className="h-4 w-4" /> LEXVISION WAR ROOM
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-amber-200 h-11 md:h-9"
                            onClick={() => setIsClosingOpen(!isClosingOpen)}
                        >
                            <Briefcase className="h-4 w-4" /> <span className="hidden sm:inline">LEX CLOSING</span><span className="sm:hidden">CLOSING</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-emerald-900 hover:bg-black text-emerald-400 border border-emerald-500 font-black gap-2 shadow-lg shadow-emerald-900 h-11 md:h-9"
                            onClick={() => setIsSentinelOpen(!isSentinelOpen)}
                        >
                            <Radar className="h-4 w-4" /> <span className="hidden sm:inline">LEX SENTINEL</span><span className="sm:hidden">INTEL</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-100 hover:bg-black text-blue-600 border border-blue-200 font-black gap-2 shadow-lg h-11 md:h-9"
                            onClick={() => setIsMediatorOpen(!isMediatorOpen)}
                        >
                            <Handshake className="h-4 w-4" /> <span className="hidden sm:inline">LEX MEDIATOR</span><span className="sm:hidden">ODR</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-violet-900 hover:bg-black text-violet-300 border border-violet-500 font-black gap-2 shadow-lg h-11 md:h-9"
                            onClick={() => setIsVoiceOpen(!isVoiceOpen)}
                        >
                            <Mic className="h-4 w-4" /> <span className="hidden sm:inline">LEX VOICE</span><span className="sm:hidden">VOICE</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-teal-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-teal-200 h-11 md:h-9"
                            onClick={() => setIsPredictOpen(!isPredictOpen)}
                        >
                            <LineChart className="h-4 w-4" /> <span className="hidden sm:inline">LEX PREDICT</span><span className="sm:hidden">PREDICT</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-emerald-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-emerald-900/50 h-11 md:h-9"
                            onClick={() => setIsFlowOpen(!isFlowOpen)}
                        >
                            <Headphones className="h-4 w-4" /> <span className="hidden sm:inline">LEX FLOW</span><span className="sm:hidden">FLOW</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-cyan-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-cyan-900/50 h-11 md:h-9"
                            onClick={() => setIsTwinOpen(!isTwinOpen)}
                        >
                            <Fingerprint className="h-4 w-4" /> <span className="hidden sm:inline">LEX TWIN</span><span className="sm:hidden">TWIN</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-rose-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-rose-900/50 h-11 md:h-9 animate-pulse"
                            onClick={() => setIsLiveOpen(!isLiveOpen)}
                        >
                            <Mic className="h-4 w-4" /> <span className="hidden sm:inline">LEX LIVE AU D'AUDIENCE</span><span className="sm:hidden">LIVE</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-indigo-700 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-indigo-900/50 h-11 md:h-9"
                            onClick={() => setIsStrategyOpen(!isStrategyOpen)}
                        >
                            <BrainCircuit className="h-4 w-4" /> <span className="hidden sm:inline">WAR ROOM</span><span className="sm:hidden">STRAT</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-900 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-slate-400 h-11 md:h-9"
                            onClick={() => setIsBotHubOpen(!isBotHubOpen)}
                        >
                            <Bot className="h-4 w-4" /> <span className="hidden sm:inline">LEX BOT HUB</span><span className="sm:hidden">HUB</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-pink-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-pink-200 h-11 md:h-9"
                            onClick={() => setIsDesignOpen(!isDesignOpen)}
                        >
                            <PenTool className="h-4 w-4" /> <span className="hidden sm:inline">LEX DESIGN</span><span className="sm:hidden">DESIGN</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-orange-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-orange-200 h-11 md:h-9"
                            onClick={() => setIsAutomataOpen(!isAutomataOpen)}
                        >
                            <Zap className="h-4 w-4" /> <span className="hidden sm:inline">LEX OPS</span><span className="sm:hidden">OPS</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-violet-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-violet-200 h-11 md:h-9"
                            onClick={() => setIsMateriaOpen(!isMateriaOpen)}
                        >
                            <Library className="h-4 w-4" /> <span className="hidden sm:inline">LEX MATERIA</span><span className="sm:hidden">RESEARCH</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-cyan-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-cyan-200 h-11 md:h-9"
                            onClick={() => setIsLogicOpen(!isLogicOpen)}
                        >
                            <GitBranch className="h-4 w-4" /> <span className="hidden sm:inline">LEX LOGIC</span><span className="sm:hidden">LOGIC</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-blue-200 h-11 md:h-9"
                            onClick={() => setIsNexusOpen(!isNexusOpen)}
                        >
                            <Globe className="h-4 w-4" /> <span className="hidden sm:inline">LEX NEXUS</span><span className="sm:hidden">PORTAL</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-rose-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-rose-200 h-11 md:h-9"
                            onClick={() => setIsAudioOpen(!isAudioOpen)}
                        >
                            <Mic className="h-4 w-4" /> <span className="hidden sm:inline">LEX AUDIO</span><span className="sm:hidden">AUDIO</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-500 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-amber-200 h-11 md:h-9"
                            onClick={() => setIsSifterOpen(!isSifterOpen)}
                        >
                            <Filter className="h-4 w-4" /> <span className="hidden sm:inline">LEX STRATEGY</span><span className="sm:hidden">STRAT</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-emerald-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-emerald-200 h-11 md:h-9"
                            onClick={() => setIsAnalyticalOpen(!isAnalyticalOpen)}
                        >
                            <Activity className="h-4 w-4" /> <span className="hidden sm:inline">LEX ANALYTICS</span><span className="sm:hidden">ANALYSIS</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-indigo-600 hover:bg-black text-white border-none font-black gap-2 shadow-lg shadow-indigo-200 h-11 md:h-9"
                            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                        >
                            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">LEXAI COPILOT</span><span className="sm:hidden">COPILOT</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 font-medium gap-2 flex-1 sm:flex-none"
                            onClick={() => setIsLexAIOpen(!isLexAIOpen)}
                        >
                            <Bot className="h-4 w-4" /> <span className="hidden sm:inline">Assistant Chat</span><span className="sm:hidden">Chat</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-200 font-bold gap-2 flex-1 sm:flex-none"
                            onClick={() => setIsWarRoomOpen(true)}
                        >
                            <Gavel className="h-4 w-4" /> <span className="hidden sm:inline">Mode Audience</span><span className="sm:hidden">Audience</span>
                        </Button>
                        <Button size="sm" className="hidden lg:flex bg-slate-900 text-white">Facturer</Button>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="mt-8">
                    <Tabs defaultValue="documents" className="w-full">
                        <div className="overflow-x-auto no-scrollbar pb-2">
                            <TabsList className="inline-flex w-auto min-w-full lg:w-[850px] space-x-1 p-1">
                                <TabsTrigger value="overview" className="whitespace-nowrap px-4 py-2">Vue Globale</TabsTrigger>
                                <TabsTrigger value="documents" className="whitespace-nowrap px-4 py-2">GED & Actes</TabsTrigger>
                                <TabsTrigger value="expenses" className="whitespace-nowrap px-4 py-2">Frais</TabsTrigger>
                                <TabsTrigger value="procedure" className="whitespace-nowrap px-4 py-2">Procédure</TabsTrigger>
                                <TabsTrigger value="billing" className="whitespace-nowrap px-4 py-2">Finances</TabsTrigger>
                                <TabsTrigger value="lexai-predict" className="whitespace-nowrap px-4 py-2 bg-indigo-50 text-indigo-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">LexAI Predict</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="mt-6">
                            <TabsContent value="overview">
                                <DossierOverview dossier={dossier} />
                            </TabsContent>

                            <TabsContent value="expenses">
                                <ExpensesTab dossierId={dossier.id} expenses={expenses} />
                            </TabsContent>

                            <TabsContent value="documents">
                                <DocumentsTab dossierId={dossier.id} templates={templates} initialDocuments={dossier.documents} />
                            </TabsContent>

                            <TabsContent value="procedure">
                                <ProcedureTab
                                    dossierId={dossier.id}
                                    currentStage={dossier.stage || 'SAISINE'}
                                    procedureType={dossier.procedureType || 'CIVIL'}
                                />
                            </TabsContent>

                            <TabsContent value="billing">
                                <FinanceTab
                                    dossierId={dossier.id}
                                    carpaTransactions={dossier.carpaTransactions}
                                    expenses={expenses}
                                />
                            </TabsContent>

                            <TabsContent value="lexai-predict">
                                <JusticePredictor initialDescription={dossier.description || ""} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>

            {/* LexAI Side Panel */}
            <AnimatePresence>
                {isLexAIOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 400, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-30"
                    >
                        <LexAIPanel dossierId={dossier.id} onClose={() => setIsLexAIOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexLegal Copilot Side Panel */}
            <AnimatePresence>
                {isCopilotOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-40"
                        style={{ width: 400 }}
                    >
                        <LexLegalCopilot dossierId={dossier.id} onClose={() => setIsCopilotOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexAnalytical Associate Side Panel */}
            <AnimatePresence>
                {isAnalyticalOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-50 shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexAnalyticalAssociate dossierId={dossier.id} onClose={() => setIsAnalyticalOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexSifter Pro Side Panel */}
            <AnimatePresence>
                {isSifterOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[60] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexSifterPro dossierId={dossier.id} onClose={() => setIsSifterOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexAudio Side Panel */}
            <AnimatePresence>
                {isAudioOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[70] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexAudio dossierId={dossier.id} onClose={() => setIsAudioOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexNexus Portal Side Panel */}
            <AnimatePresence>
                {isNexusOpen && (
                    <motion.div
                        initial={{ x: 600, opacity: 0 }} // Wider for Portal view
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 600, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[80] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 600 }} // Wider width for better portal experience
                    >
                        <LexNexus dossierId={dossier.id} onClose={() => setIsNexusOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexLogic Architect Side Panel */}
            <AnimatePresence>
                {isLogicOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[90] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexLogicArchitect dossierId={dossier.id} onClose={() => setIsLogicOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexMateria Research Side Panel */}
            <AnimatePresence>
                {isMateriaOpen && (
                    <motion.div
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[95] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 500 }}
                    >
                        <LexMateria dossierId={dossier.id} onClose={() => setIsMateriaOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexAutomata Ops Side Panel */}
            <AnimatePresence>
                {isAutomataOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[100] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexAutomata dossierId={dossier.id} onClose={() => setIsAutomataOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexDesign Studio Side Panel */}
            <AnimatePresence>
                {isDesignOpen && (
                    <motion.div
                        initial={{ x: 600, opacity: 0 }} // Wider for Canvas
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 600, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[105] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 600 }}
                    >
                        <LexDesignStudio dossierId={dossier.id} onClose={() => setIsDesignOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexPredictor Side Panel */}
            <AnimatePresence>
                {isPredictOpen && (
                    <motion.div
                        initial={{ x: 450, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 450, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[110] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 450 }}
                    >
                        <LexPredictor dossierId={dossier.id} onClose={() => setIsPredictOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexClosing Room Side Panel */}
            <AnimatePresence>
                {isClosingOpen && (
                    <motion.div
                        initial={{ x: 550, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 550, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[115] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 550 }}
                    >
                        <LexClosing dossierId={dossier.id} onClose={() => setIsClosingOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexSentinel Intel Side Panel */}
            <AnimatePresence>
                {isSentinelOpen && (
                    <motion.div
                        initial={{ x: 450, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 450, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[120] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 450 }}
                    >
                        <LexSentinel dossierId={dossier.id} onClose={() => setIsSentinelOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexMediator ODR Side Panel */}
            <AnimatePresence>
                {isMediatorOpen && (
                    <motion.div
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[125] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 500 }}
                    >
                        <LexMediator dossierId={dossier.id} onClose={() => setIsMediatorOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexVoice Coach Side Panel */}
            <AnimatePresence>
                {isVoiceOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[130] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 400 }}
                    >
                        <LexVoice dossierId={dossier.id} onClose={() => setIsVoiceOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LexBot Universe Hub Side Panel */}
            <AnimatePresence>
                {isBotHubOpen && (
                    <motion.div
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[140] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 500 }}
                    >
                        <LexBotUniverse dossierId={dossier.id} onClose={() => setIsBotHubOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* LexStrategy War Room Side Panel */}
            <AnimatePresence>
                {isStrategyOpen && (
                    <motion.div
                        initial={{ x: 600, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 600, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 100 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[150] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 600 }}
                    >
                        <LexStrategy dossierId={dossier.id} onClose={() => setIsStrategyOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* LexLive Courtroom side panel */}
            <AnimatePresence>
                {isLiveOpen && (
                    <motion.div
                        initial={{ x: 650, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 650, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 100 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[160] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 650 }}
                    >
                        <LexLive dossierId={dossier.id} onClose={() => setIsLiveOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* LexTwin Side Panel */}
            <AnimatePresence>
                {isTwinOpen && (
                    <motion.div
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 100 }}
                        className="h-[calc(100vh-8rem)] sticky top-24 z-[170] shadow-2xl overflow-hidden rounded-l-[2rem]"
                        style={{ width: 500 }}
                    >
                        <LexTwin dossierId={dossier.id} onClose={() => setIsTwinOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* LexFlow Audio Bar */}
            <AnimatePresence>
                {isFlowOpen && (
                    <LexFlow onClose={() => setIsFlowOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    )
}
