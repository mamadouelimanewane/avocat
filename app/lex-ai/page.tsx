"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, Bot, User, FileText, Scale, BookOpen, ChevronRight, Loader2, Paperclip, MoreHorizontal, History, UserCheck, Gavel, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
    citations?: Citation[]
    avatar?: 'lex' | 'aida' | 'procureur'
}

type Citation = {
    id: string
    title: string
    source: string
    excerpt: string
}

type AvatarPersona = {
    id: 'lex' | 'aida' | 'procureur'
    name: string
    title: string
    description: string
    icon: any
    color: string
    welcomeMessage: string
    style: string
}

const AVATARS: AvatarPersona[] = [
    {
        id: 'lex',
        name: "Le Doyen (Ndaje)",
        title: "Sagesse & Coutume",
        description: "L'autorité morale. Idéal pour la stratégie et l'éthique.",
        icon: Gavel,
        color: "from-amber-700 to-amber-900",
        welcomeMessage: "As-salam alaykum Maître. La loi est une chose, la sagesse en est une autre. Parlons stratégie.",
        style: "bg-amber-50 border-amber-200"
    },
    {
        id: 'aida',
        name: "Aïda",
        title: "Executive Assistant",
        description: "Rapide, moderne et précise. Pour la recherche et la rédaction.",
        icon: UserCheck,
        color: "from-pink-500 to-rose-500",
        welcomeMessage: "Bonjour Maître ! Prête à accélérer votre workflow. On rédige quoi aujourd'hui ?",
        style: "bg-rose-50 border-rose-200"
    },
    {
        id: 'procureur',
        name: "Le Procureur",
        title: "Crash Test",
        description: "Hostile et rigoureux. Pour tester vos défenses.",
        icon: ShieldAlert,
        color: "from-slate-700 to-black",
        welcomeMessage: "Votre dossier me semble bien fragile, Maître. Prouvez-moi le contraire.",
        style: "bg-slate-100 border-slate-300"
    }
]

// Mock Database
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
    const [activeAvatar, setActiveAvatar] = useState<AvatarPersona>(AVATARS[1]) // Aïda by default
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: AVATARS[1].welcomeMessage,
            avatar: 'aida'
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

    // Switch Avatar Handler
    const handleAvatarSwitch = (avatar: AvatarPersona) => {
        setActiveAvatar(avatar)
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: avatar.welcomeMessage,
            avatar: avatar.id
        }])
    }

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

        // Simulation of AI Processing with persona style
        setTimeout(() => {
            const relevantCitations = KNOWLEDGE_BASE.filter(k =>
                input.toLowerCase().includes("licenciement") || input.toLowerCase().includes("travail")
            )

            let aiContent = ""

            if (activeAvatar.id === 'lex') {
                aiContent = "Mon jeune confrère, regardons cela avec recul. " + (relevantCitations.length > 0 ? "Les textes sont clairs, mais l'esprit de la loi est plus subtil..." : "Je ne vois rien dans nos tablettes pour le moment.")
            } else if (activeAvatar.id === 'procureur') {
                aiContent = "C'est tout ce que vous avez ? " + (relevantCitations.length > 0 ? "Ces textes ne vous sauveront pas si les faits sont contre vous." : "Votre argumentation manque cruellement de base légale.")
            } else {
                aiContent = "Voici ce que j'ai trouvé Maître. " + (relevantCitations.length > 0 ? "L'analyse est formelle :" : "Je lance une recherche plus approfondie.")
            }

            if (relevantCitations.length > 0) {
                aiContent += "\n\nLa jurisprudence est constante : un licenciement exige une cause réelle et sérieuse. La Cour Suprême l'a rappelé."
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent,
                citations: relevantCitations.length > 0 ? relevantCitations : undefined,
                avatar: activeAvatar.id
            }

            setMessages(prev => [...prev, aiResponse])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">

            {/* Sidebar Avatars (Left) */}
            <div className="w-80 bg-slate-50 border-r border-slate-100 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Nexus Avatars</h2>
                    <p className="text-xs text-slate-500 mt-1">Choisissez votre interlocuteur</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {AVATARS.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => handleAvatarSwitch(avatar)}
                            className={cn(
                                "w-full text-left p-4 rounded-2xl transition-all border-2 relative overflow-hidden group",
                                activeAvatar.id === avatar.id
                                    ? `bg-white border-slate-900 shadow-md`
                                    : "bg-white border-transparent hover:border-slate-200 hover:shadow-sm"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br",
                                    avatar.color
                                )}>
                                    <avatar.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{avatar.name}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{avatar.title}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 pl-16 line-clamp-2 leading-relaxed">
                                {avatar.description}
                            </p>
                            {activeAvatar.id === avatar.id && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-100 to-transparent -mr-8 -mt-8 rounded-full z-0 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700">Mode Immersif</span>
                        </div>
                        <p className="text-[10px] text-indigo-600">Activez la voix pour dialoguer vocalement avec les avatars.</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-slate-50/50">
                {/* Header */}
                <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-br",
                            activeAvatar.color
                        )}>
                            <activeAvatar.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-slate-800">{activeAvatar.name}</h2>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                En ligne • {activeAvatar.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition hover:text-slate-600">
                            <BookOpen className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition hover:text-slate-600">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => {
                        const isAssistant = msg.role === 'assistant';
                        const avatarConfig = isAssistant
                            ? AVATARS.find(a => a.id === (msg.avatar || 'aida'))
                            : null;

                        return (
                            <div key={msg.id} className={`flex gap-6 max-w-4xl mx-auto group ${!isAssistant ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar Bubble */}
                                <div className={cn(
                                    "h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white shadow-sm mt-2 transition-transform hover:scale-110",
                                    isAssistant
                                        ? `bg-gradient-to-br ${avatarConfig?.color || 'from-slate-400 to-slate-500'}`
                                        : "bg-slate-200 text-slate-500"
                                )}>
                                    {isAssistant ? <avatarConfig.icon className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>

                                <div className={`space-y-3 max-w-[75%]`}>
                                    {isAssistant && (
                                        <p className="text-xs font-bold text-slate-400 ml-1">{avatarConfig?.name}</p>
                                    )}

                                    <div className={cn(
                                        "p-6 text-sm md:text-base leading-relaxed shadow-sm",
                                        !isAssistant
                                            ? 'bg-slate-900 text-white rounded-[2rem] rounded-tr-none'
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-[2rem] rounded-tl-none'
                                    )}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>

                                    {/* Citations Area */}
                                    {msg.citations && (
                                        <div className="pl-4 border-l-2 border-slate-200 space-y-2 pt-1 animate-in slide-in-from-left-4 fade-in duration-500">
                                            {msg.citations.map(citation => (
                                                <div key={citation.id} className="bg-white border border-slate-100 p-3 rounded-xl hover:border-amber-400 hover:shadow-md transition cursor-pointer group/citation">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Scale className="h-3 w-3 text-amber-500" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{citation.source}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 text-xs">{citation.title}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex gap-6 max-w-4xl mx-auto">
                            <div className={cn(
                                "h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white shadow-sm mt-2 bg-gradient-to-br",
                                activeAvatar.color
                            )}>
                                <activeAvatar.icon className="h-5 w-5" />
                            </div>
                            <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={handleSend} className="relative group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend(e)
                                    }
                                }}
                                placeholder={`Écrivez à ${activeAvatar.name}...`}
                                className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all resize-none shadow-inner min-h-[64px]"
                            />
                            <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className={cn(
                                        "p-2 rounded-xl transition-all shadow-md",
                                        input.trim() && !isTyping
                                            ? `bg-gradient-to-r ${activeAvatar.color} text-white hover:scale-105 active:scale-95`
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 mt-3">
                            LexAI v2.0 • Identité Culturelle Africaine • Vérifiez les sources.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
