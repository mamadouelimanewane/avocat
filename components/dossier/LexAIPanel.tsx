
"use client"

import { useState } from "react"
import { Sparkles, X, BrainCircuit, AlertCircle, CheckCircle2, Target, DollarSign, Bot, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { generateExecutiveSummary, askDossierAIAssistant } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface LexAIPanelProps {
    dossierId: string
    onClose?: () => void
}

export function LexAIPanel({ dossierId, onClose }: LexAIPanelProps) {
    const [summary, setSummary] = useState<string | null>(null)
    const [isLoadingSummary, setIsLoadingSummary] = useState(false)

    // Chat State
    const [chatQuery, setChatQuery] = useState("")
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])
    const [isChatLoading, setIsChatLoading] = useState(false)

    const { toast } = useToast()

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true)
        try {
            const result = await generateExecutiveSummary(dossierId)
            if (result.success && result.summary) {
                setSummary(result.summary)
            } else {
                toast({ title: "Erreur", description: "Impossible de générer la synthèse.", variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Erreur", description: "Erreur technique.", variant: "destructive" })
        } finally {
            setIsLoadingSummary(false)
        }
    }

    const handleAskAI = async () => {
        if (!chatQuery.trim()) return

        const userMsg = chatQuery
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }])
        setChatQuery("")
        setIsChatLoading(true)

        try {
            const result = await askDossierAIAssistant(dossierId, userMsg)
            if (result.success && result.answer) {
                setChatHistory(prev => [...prev, { role: 'ai', content: result.answer }])
            } else {
                setChatHistory(prev => [...prev, { role: 'ai', content: "Désolé, une erreur est survenue." }])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsChatLoading(false)
        }
    }

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full md:w-[400px] h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">LexAI Assistant</h3>
                        <p className="text-xs text-slate-500">Intelligence Juridique Active</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8">
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {/* 1. Flash Briefing Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Briefing Flash 60s
                            </h4>
                            {!summary && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                                    onClick={handleGenerateSummary}
                                    disabled={isLoadingSummary}
                                >
                                    {isLoadingSummary ? "Analyse..." : "Générer"}
                                </Button>
                            )}
                        </div>

                        {summary && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-indigo-100 shadow-sm p-4 text-sm space-y-3 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <Sparkles className="h-12 w-12" />
                                </div>

                                <TypewriterText text={summary} />

                                <div className="text-[10px] text-slate-400 text-right italic pt-2 border-t border-slate-50 mt-2">
                                    Généré par LexAI • Vérifiez toujours les sources.
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="h-px bg-slate-200" />

                    {/* 2. Chat Section */}
                    <div className="flex flex-col h-[400px]">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                            Discussion avec le Dossier
                        </h4>

                        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 overflow-y-auto space-y-3 mb-3 text-sm">
                            {chatHistory.length === 0 && (
                                <div className="text-center py-10 text-slate-400">
                                    <BrainCircuit className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p>Posez une question sur les documents ou les faits du dossier.</p>
                                </div>
                            )}

                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 rounded-lg p-3 rounded-bl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Ex: Quelle est la date du bail ?"
                                value={chatQuery}
                                onChange={(e) => setChatQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                                className="bg-white"
                            />
                            <Button size="icon" onClick={handleAskAI} disabled={!chatQuery.trim() || isChatLoading} className="bg-indigo-600 hover:bg-indigo-700">
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState("")

    // Simulate streaming effect
    useState(() => {
        let i = 0
        const timer = setInterval(() => {
            setDisplayedText(text.substring(0, i))
            i += 5 // Speed of "streaming"
            if (i > text.length) clearInterval(timer)
        }, 10)
        return () => clearInterval(timer)
    })

    // Parse displayed text to maintain formatting
    return (
        <div className="prose prose-sm prose-indigo max-w-none">
            {displayedText.split('\n').map((line, i) => {
                // Only style fully rendered lines to avoid flickering
                const isComplete = i < displayedText.split('\n').length - 1 || displayedText.length === text.length

                if (line.includes('URGENCES')) return <div key={i} className="flex items-start gap-2 text-red-600 font-medium bg-red-50 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{line.replace(/\*|#/g, '')}</div>
                if (line.includes('ACTIONS')) return <div key={i} className="flex items-start gap-2 text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />{line.replace(/\*|#/g, '')}</div>
                if (line.includes('SOLDE')) return <div key={i} className="flex items-start gap-2 text-slate-700 font-medium bg-slate-100 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2"><DollarSign className="h-4 w-4 shrink-0 mt-0.5" />{line.replace(/\*|#/g, '')}</div>

                return <p key={i} className="text-slate-600 mb-1 last:mb-0">{line.replace(/\*|#/g, '')}</p>
            })}
            {displayedText.length < text.length && <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1" />}
        </div>
    )
}
