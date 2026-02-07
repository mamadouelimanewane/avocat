"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
    Send,
    Sparkles,
    BookOpen,
    Scale,
    Zap,
    Loader2,
    ShieldCheck,
    Gavel,
    Building
} from "lucide-react"
import { cn } from "@/lib/utils"

const suggestions = [
    {
        title: "Conseils OHADA",
        text: "Quelles sont les conditions de validité d'un bail commercial selon l'AUDCG ?",
        icon: BookOpen,
        color: "text-blue-500",
    },
    {
        title: "Droit du Travail",
        text: "Calcul de l'indemnité de licenciement au Sénégal après 5 ans d'ancienneté.",
        icon: Scale,
        color: "text-emerald-500",
    },
    {
        title: "Procédure Civile",
        text: "Quels sont les délais d'appel pour un jugement rendu par défaut ?",
        icon: Zap,
        color: "text-orange-500",
    },
    {
        title: "Droit Pénal",
        text: "Quelles sont les peines encourues pour abus de confiance au Sénégal ?",
        icon: Gavel,
        color: "text-red-500",
    },
    {
        title: "Droit Administratif",
        text: "Comment contester un arrêté préfectoral devant le tribunal administratif ?",
        icon: Building,
        color: "text-purple-500",
    },
    {
        title: "Autres Demandes",
        text: "Pouvez-vous m'aider à analyser ce contrat et identifier les clauses risquées ?",
        icon: Sparkles,
        color: "text-amber-500",
    }
]

function LexAIContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q")

    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (initialQuery && messages.length === 0) {
            setInput(initialQuery)
            const timer = setTimeout(() => {
                handleSendWithQuery(initialQuery)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [initialQuery])

    const handleSendWithQuery = (query: string) => {
        if (!query.trim()) return
        const newMessages = [{ role: 'user' as const, content: query }]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        setTimeout(() => {
            setMessages([...newMessages, {
                role: 'ai',
                content: "J'ai bien reçu votre demande concernant '" + query + "'. D'après l'analyse des textes de loi OHADA et la jurisprudence sénégalaise récente, voici les points clés : [Analyse en cours...]. Souhaitez-vous que je rédige un projet d'acte basé sur ces éléments ?"
            }])
            setIsLoading(false)
        }, 1500)
    }

    const handleSend = () => {
        handleSendWithQuery(input)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] p-8">
            <div className="mb-8">
                <div className="flex items-center gap-x-3 mb-2">
                    <div className="p-2 bg-slate-900 rounded-lg">
                        <Sparkles className="h-6 w-6 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold">LexAI Assistant</h2>
                </div>
                <p className="text-muted-foreground font-light">
                    Votre intelligence juridique augmentée. Posez vos questions sur les fonds OHADA et Sénégalais.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center space-y-8">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">Comment puis-je vous aider aujourd'hui ?</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Je peux analyser vos dossiers, citer la jurisprudence ou vous aider à rédiger des conclusions.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.title}
                                    onClick={() => setInput(suggestion.text)}
                                    className="p-4 border rounded-xl text-left hover:border-slate-900 transition group"
                                >
                                    <suggestion.icon className={cn("h-5 w-5 mb-2", suggestion.color)} />
                                    <p className="font-semibold text-sm group-hover:text-slate-900">{suggestion.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.text}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex w-full",
                            message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                            message.role === 'user'
                                ? "bg-slate-900 text-white rounded-tr-none"
                                : "bg-white border rounded-tl-none text-slate-800"
                        )}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            <span className="text-xs text-slate-500 italic">LexAI analyse la jurisprudence...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative mt-auto">
                <div className="absolute -top-12 left-0 right-0 flex justify-center">
                    <div className="bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-x-1">
                        <ShieldCheck className="h-3 w-3" /> Source d'information : OHADA & Barreau du Sénégal
                    </div>
                </div>
                <div className="flex items-center gap-x-2 bg-white border shadow-lg rounded-2xl p-2 focus-within:ring-2 focus-within:ring-slate-900 transition">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Posez votre question juridique ici..."
                        className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                    />
                    <button
                        disabled={isLoading || !input.trim()}
                        onClick={handleSend}
                        className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Les réponses de l'IA sont basées sur les textes chargés. Vérifiez toujours auprès des sources officielles.
                </p>
            </div>
        </div>
    )
}

export default function LexAIPage() {
    return (
        <Suspense fallback={<div>Chargement de l'assistant...</div>}>
            <LexAIContent />
        </Suspense>
    )
}
