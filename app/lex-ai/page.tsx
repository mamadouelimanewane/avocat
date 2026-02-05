"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Bot, User, FileText, Scale, BookOpen, ChevronRight, Loader2, Paperclip, MoreHorizontal, History } from "lucide-react"

// Types
type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
    citations?: Citation[]
}

type Citation = {
    id: string
    title: string
    source: string
    excerpt: string
}

// Mock Database for RAG (Retrieval Augmented Generation) simulation
const KNOWLEDGE_BASE = [
    {
        id: "leg-1",
        title: "Article L.1232-1 Code du Travail",
        source: "Code du Travail Sénégalais",
        excerpt: "Tout licenciement pour motif personnel doit être motivé et justifié par une cause réelle et sérieuse."
    },
    {
        id: "jur-1",
        title: "Arrêt n° 45 du 12 Janvier 2024",
        source: "Cour Suprême - Chambre Sociale",
        excerpt: "La simple perte de confiance ne constitue pas en soi une cause réelle et sérieuse de licenciement si elle ne repose pas sur des faits objectifs."
    }
]

export default function LexAIPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Bonjour Maître. Je suis LexAI, votre assistant juridique avancé. Je peux analyser vos dossiers, rechercher de la jurisprudence ou rédiger des projets de conclusions. Par quoi commençons-nous ?"
        }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulation of AI Processing
        setTimeout(() => {
            // Simple keyword matching for demo
            const relevantCitations = KNOWLEDGE_BASE.filter(k =>
                input.toLowerCase().includes("licenciement") || input.toLowerCase().includes("travail")
            )

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: relevantCitations.length > 0
                    ? "D'après l'analyse des textes en vigueur et de la jurisprudence récente, voici les éléments de réponse :\n\nLe licenciement doit impérativement reposer sur une **cause réelle et sérieuse**. La Cour Suprême a récemment rappelé que la perte de confiance subjective ne suffit pas."
                    : "Je n'ai pas trouvé de référence spécifique dans ma base immédiate pour cette requête précise, mais je peux effectuer une recherche approfondie sur les bases Lexis et Dalloz. Souhaitez-vous que je lance cette recherche étendue ?",
                citations: relevantCitations.length > 0 ? relevantCitations : undefined
            }

            setMessages(prev => [...prev, aiResponse])
            setIsTyping(false)
        }, 2000)
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">

            {/* Sidebar History (Left) */}
            <div className="w-80 bg-slate-50 border-r border-slate-100 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                        <Sparkles className="h-4 w-4" />
                        Nouvelle Conversation
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Aujourd'hui</p>
                    <button className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-sm text-slate-700 truncate font-medium flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400" />
                        Recherche licenciement
                    </button>
                    <button className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-sm transition text-sm text-slate-700 truncate flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400" />
                        Analyse contrat bail
                    </button>
                </div>
                <div className="p-4 border-t border-slate-100">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Scale className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">Jurisprudence Connectée</span>
                        </div>
                        <p className="text-[10px] text-emerald-600">Base mise à jour : 04 Fév 2026</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Header */}
                <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white shadow-md">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">LexAI Co-Counsel</h2>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online • GPT-4o Legal Edition
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition">
                            <BookOpen className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mt-1 shadow-sm">
                                    <Bot className="h-4 w-4" />
                                </div>
                            )}

                            <div className={`space-y-4 max-w-[80%]`}>
                                <div className={`p-5 rounded-2xl shadow-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                                </div>

                                {/* Citations Area */}
                                {msg.citations && (
                                    <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-left-4 fade-in duration-500">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Sources Juridiques</p>
                                        {msg.citations.map(citation => (
                                            <div key={citation.id} className="bg-white border-l-4 border-amber-400 p-3 rounded-r-xl shadow-sm hover:shadow-md transition cursor-pointer group">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{citation.source}</span>
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 transition" />
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">{citation.title}</h4>
                                                <p className="text-xs text-slate-500 italic line-clamp-2">"{citation.excerpt}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="h-8 w-8 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mt-1">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 max-w-4xl mx-auto">
                            <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mt-1 shadow-sm">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={handleSend} className="relative group">
                            <div className="absolute bottom-full mb-2 left-0 flex gap-2">
                                <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-600 transition">
                                    <FileText className="h-3 w-3" />
                                    Analyser un doc
                                </button>
                                <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-600 transition">
                                    <Scale className="h-3 w-3" />
                                    Jurisprudence
                                </button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend(e)
                                    }
                                }}
                                placeholder="Posez votre question juridique..."
                                className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:bg-white transition-all resize-none shadow-inner max-h-32 min-h-[60px]"
                            />
                            <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className={`p-2 rounded-xl transition-all shadow-md ${input.trim() && !isTyping
                                            ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:scale-105 active:scale-95'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 mt-2">
                            LexAI peut faire des erreurs. Vérifiez toujours les sources citées (Code du Travail, COCC, etc.).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
