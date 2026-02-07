
"use client"

import { useState } from "react"
import {
    Bot,
    Briefcase,
    Users,
    UserCircle2,
    FileText,
    MessageSquare,
    Sparkles,
    Zap,
    Send,
    MoreHorizontal,
    BookOpen,
    Library
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface LexBotUniverseProps {
    dossierId: string
    onClose?: () => void
}

type AgentType = "hr" | "contract" | "public" | "lextenso"

import { generateHRAssistance, generateContractAnalysis, generatePublicLegalAdvice, generateDoctrinalResearch } from "@/app/actions"
import { Loader2 } from "lucide-react"

export function LexBotUniverse({ dossierId, onClose }: LexBotUniverseProps) {
    const [activeAgent, setActiveAgent] = useState<AgentType>("hr")
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', text: string }>>([
        { role: 'ai', text: "Bonjour Maître. Je suis LexHR, votre spécialiste en Droit Social. Comment puis-je vous aider sur ce dossier ?" }
    ])
    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)

    const agents = [
        {
            id: "hr",
            name: "LexHR",
            role: "Social & Salariés",
            icon: Users,
            color: "bg-pink-500",
            textColor: "text-pink-500",
            borderColor: "border-pink-200",
            desc: "Inspiré par Dydu. Expert CSE, Licenciements et RH."
        },
        {
            id: "contract",
            name: "LexContract",
            role: "Négociation & CLM",
            icon: FileText,
            color: "bg-indigo-500",
            textColor: "text-indigo-500",
            borderColor: "border-indigo-200",
            desc: "Inspiré par Tomorro. Analyse et commente vos contrats."
        },
        {
            id: "public",
            name: "LexPublic",
            role: "Qualification Client",
            icon: UserCircle2,
            color: "bg-cyan-500",
            textColor: "text-cyan-500",
            borderColor: "border-cyan-200",
            desc: "Inspiré par JuriBot. Filtre les demandes entrantes."
        },
        {
            id: "lextenso",
            name: "LexDoctrinal",
            role: "Revues & Base",
            icon: Library,
            color: "bg-red-600",
            textColor: "text-red-600",
            borderColor: "border-red-200",
            desc: "Inspiré par Lextenso. Accès à la doctrine et aux revues."
        }
    ]

    const handleSend = async () => {
        if (!input.trim() || isThinking) return

        const userMsg = input
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setInput("")
        setIsThinking(true)

        try {
            let response: { success: boolean, text?: string, message?: string } = { success: false }

            if (activeAgent === 'hr') {
                response = await generateHRAssistance(userMsg, dossierId)
            } else if (activeAgent === 'contract') {
                response = await generateContractAnalysis(userMsg, dossierId)
            } else if (activeAgent === 'public') {
                response = await generatePublicLegalAdvice(userMsg, "Général")
            } else if (activeAgent === 'lextenso') {
                response = await generateDoctrinalResearch(userMsg)
            }

            if (response && response.success && response.text) {
                setMessages(prev => [...prev, { role: 'ai', text: response.text! }])
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "Je suis navré, je n'ai pas pu traiter cette demande pour le moment." }])
            }
        } catch (error) {
            console.error("Agent Error:", error)
            setMessages(prev => [...prev, { role: 'ai', text: "Une erreur de connexion neuronale est survenue." }])
        } finally {
            setIsThinking(false)
        }
    }

    const currentAgent = agents.find(a => a.id === activeAgent) || agents[0]

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Multi-Agent Hub Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 p-2 rounded-lg shadow-md shadow-slate-300">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-slate-600">Bot</span> Universe
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Multi-Agent Orchestrator</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Agent Selector Bar */}
                <div className="bg-white border-b border-slate-100 p-3 overflow-x-auto no-scrollbar">
                    <div className="flex gap-3 min-w-max">
                        {agents.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => { setActiveAgent(agent.id as AgentType); setMessages([]); }}
                                className={cn(
                                    "flex items-center gap-3 p-2 pr-4 rounded-xl border transition-all duration-200 group",
                                    activeAgent === agent.id
                                        ? `bg-slate-50 ${agent.borderColor} shadow-sm ring-1 ring-inset ${agent.borderColor}`
                                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm", agent.color)}>
                                    <agent.icon className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className={cn("text-xs font-black", activeAgent === agent.id ? "text-slate-900" : "text-slate-600")}>
                                        {agent.name}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{agent.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <ScrollArea className="flex-1 bg-[#f8fafc]">
                    <div className="p-4 space-y-6 max-w-3xl mx-auto">

                        {/* Agent Context Card */}
                        <div className={cn("p-3 rounded-xl border bg-white/50 backdrop-blur text-xs flex gap-2 items-center", currentAgent.borderColor)}>
                            <InfoIcon color={currentAgent.textColor} />
                            <span className="text-slate-600 font-medium">
                                <span className={cn("font-bold", currentAgent.textColor)}>Mode Actif :</span> {currentAgent.desc}
                            </span>
                        </div>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-4", msg.role === 'ai' ? "flex-row" : "flex-row-reverse")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white",
                                    msg.role === 'ai' ? currentAgent.color : "bg-slate-200"
                                )}>
                                    {msg.role === 'ai' ? <Bot className="h-4 w-4 text-white" /> : <div className="h-4 w-4 bg-slate-500 rounded-full" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm max-w-[85%]",
                                    msg.role === 'ai'
                                        ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                                        : "bg-slate-900 text-white rounded-tr-none"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex gap-4">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white", currentAgent.color)}>
                                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                                </div>
                                <span className="text-xs text-slate-400 font-bold self-center animate-pulse">
                                    {currentAgent.name} réfléchit...
                                </span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="relative max-w-3xl mx-auto flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Posez une question à ${currentAgent.name}...`}
                            disabled={isThinking}
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-slate-300 focus:ring-slate-300 font-medium pr-12"
                        />
                        <Button
                            onClick={handleSend}
                            size="icon"
                            disabled={isThinking || !input.trim()}
                            className={cn("absolute right-2 top-2 h-8 w-8 rounded-lg transition-colors", currentAgent.color)}
                        >
                            {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-white" />}
                        </Button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                            <Sparkles className="h-3 w-3" /> Powered by Multi-LLM Orchestrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
function InfoIcon({ color }: { color: string }) {
    return (
        <svg
            className={cn("h-4 w-4", color)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}
