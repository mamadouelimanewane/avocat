"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Gavel } from 'lucide-react'
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
import { Sparkles } from 'lucide-react'

export default function DossierDetailClient({ dossier, templates, expenses }: DossierDetailClientProps) {
    const [isWarRoomOpen, setIsWarRoomOpen] = useState(false)
    const [isLexAIOpen, setIsLexAIOpen] = useState(false)

    return (
        <div className="flex h-full gap-6">
            <div className="flex-1 space-y-6">
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
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{dossier.title}</h1>
                            <Badge variant={dossier.status === 'OUVERT' ? 'success' : 'default'} className="mt-1">
                                {dossier.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 mt-2 text-lg">
                            Client : <span className="font-semibold text-slate-800">{dossier.client?.name}</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 font-medium gap-2"
                            onClick={() => setIsLexAIOpen(!isLexAIOpen)}
                        >
                            <Sparkles className="h-4 w-4" /> LexAI Assitant
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-black border-amber-500 font-bold gap-2"
                            onClick={() => setIsWarRoomOpen(true)}
                        >
                            <Gavel className="h-4 w-4" /> Mode Audience
                        </Button>
                        <Button variant="outline" size="sm">
                            <Clock className="mr-2 h-4 w-4" /> Saisir Temps
                        </Button>
                        <Button size="sm" className="bg-slate-900 text-white">Facturer</Button>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="mt-8">
                    <Tabs defaultValue="documents" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-[800px]">
                            <TabsTrigger value="overview">Vue Global</TabsTrigger>
                            <TabsTrigger value="documents">GED & Actes</TabsTrigger>
                            <TabsTrigger value="expenses">Frais</TabsTrigger>
                            <TabsTrigger value="procedure">Procédure</TabsTrigger>
                            <TabsTrigger value="billing">Finances</TabsTrigger>
                            <TabsTrigger value="lexai-predict" className="bg-indigo-50 text-indigo-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">LexAI Predict</TabsTrigger>
                        </TabsList>

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
