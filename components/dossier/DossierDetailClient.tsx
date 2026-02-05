"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Clock,
    Gavel,
    Sparkles,
    Brain
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
import { AnimatePresence, motion } from 'framer-motion'

interface DossierDetailClientProps {
    dossier: any
    templates: any[]
    expenses: any[]
}

export default function DossierDetailClient({ dossier, templates, expenses }: DossierDetailClientProps) {
    const [isWarRoomOpen, setIsWarRoomOpen] = useState(false)
    const [isLexAIOpen, setIsLexAIOpen] = useState(false)

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
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 font-medium gap-2 flex-1 sm:flex-none"
                            onClick={() => setIsLexAIOpen(!isLexAIOpen)}
                        >
                            <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">LexAI Assistant</span><span className="sm:hidden">LexAI</span>
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
                        className="h-[calc(100vh-8rem)] sticky top-24"
                    >
                        <LexAIPanel dossierId={dossier.id} onClose={() => setIsLexAIOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
