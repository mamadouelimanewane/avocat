"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Bot, CheckCircle2, User, HelpCircle, FileQuestion, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Message = {
    id: string
    role: 'user' | 'agent'
    content: string
    timestamp: Date
}

const FAQ_SUGGESTIONS = [
    "Comment créer un nouveau dossier ?",
    "Comment générer une facture ?",
    "Problème de connexion Lexis",
    "Exporter mes données agenda"
]

export function SupportChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'agent',
            content: "Bonjour Maître. Je suis votre assistant support dédié. Comment puis-je vous aider aujourd'hui ?",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const getResponse = async (content: string): Promise<string> => {
        const query = content.toLowerCase()
        if (query.includes("dossier")) {
            return "Pour créer un nouveau dossier, allez dans la section 'Dossiers' (icône mallette) et cliquez sur le bouton 'Nouveau Dossier' en haut à droite. Remplissez ensuite les informations du client et de la juridiction."
        }
        if (query.includes("facture") || query.includes("paiement")) {
            return "La facturation se gère directement depuis chaque dossier ou via le menu 'Comptabilité'. Vous pouvez générer des factures d'honoraires ou des provisions sur frais en un clic."
        }
        if (query.includes("lexis") || query.includes("veille")) {
            return "Le module Lexis-Veille automatise la récupération des arrêts. Si vous avez un problème de connexion, vérifiez que votre abonnement est actif dans 'Paramètres'."
        }
        if (query.includes("export") || query.includes("agenda") || query.includes("données")) {
            return "Vous pouvez exporter vos données (agenda, dossiers, factures) dans l'onglet 'Administration' > 'Sécurité & Sauvegarde' au format JSON."
        }
        if (query.includes("portail") || query.includes("client") || query.includes("extranet")) {
            return "Le portail client est accessible à l'adresse suivante : /portal/login. Vous pouvez y accéder pour que vos clients consultent leurs dossiers et règlent leurs factures."
        }
        if (query.includes("bonjour") || query.includes("salut")) {
            return "Bonjour Maître ! Comment puis-je vous assister dans la gestion de votre cabinet aujourd'hui ?"
        }

        // --- FALLBACK TO AI ---
        try {
            const { generateSupportResponse } = await import('@/app/actions')
            const res = await generateSupportResponse(content)
            if (res.success && res.text) return res.text
            console.log("AI Support Response (failed or empty):", res)
        } catch (e) {
            console.error("AI Support Fallback Error:", e)
        }

        return "Je comprends votre demande concernant '" + content + "'. Un agent spécialisé va prendre le relais pour vous assister précisément. En attendant, n'hésitez pas à consulter le manuel d'utilisation."
    }

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        // Simulate AI/Agent response
        const responseContent = await getResponse(userMsg.content)

        const agentMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: responseContent,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, agentMsg])
        setIsTyping(false)
    }

    const sendFaq = async (question: string) => {
        // UI feedback for selection
        setInputValue(question)

        // Immediate visual user message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: question,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        const responseContent = await getResponse(question)
        const agentMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: responseContent,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, agentMsg])
        setIsTyping(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Trigger Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in zoom-in duration-300"
                >
                    <MessageSquare className="h-8 w-8" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[380px] h-[600px] shadow-2xl border-none flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 fade-in duration-300 rounded-[2rem]">

                    {/* Header */}
                    <div className="bg-slate-900 p-6 text-white shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Bot className="h-24 w-24 text-teal-500" />
                        </div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                <div className="h-12 w-12 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">LexSupport</h3>
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        En ligne • Répond en &lt; 1min
                                    </p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-slate-50 relative flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4 pb-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                            {msg.role === 'agent' ? (
                                                <AvatarFallback className="bg-slate-900 text-teal-400"><Bot className="h-4 w-4" /></AvatarFallback>
                                            ) : (
                                                <AvatarFallback className="bg-slate-200 text-slate-600"><User className="h-4 w-4" /></AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className={cn(
                                            "max-w-[75%] p-3 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-teal-600 text-white rounded-2xl rounded-tr-none"
                                                : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-none"
                                        )}>
                                            {msg.content}
                                            <p className={cn("text-[10px] mt-1 text-right opacity-70", msg.role === 'user' ? "text-teal-100" : "text-slate-400")}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3">
                                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-slate-900 text-teal-400"><Bot className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 h-10 w-16">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* FAQ Suggestions Chips */}
                            {messages.length < 3 && !isTyping && (
                                <div className="flex flex-col gap-2 mt-4 px-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suggestions</p>
                                    {FAQ_SUGGESTIONS.map((faq, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => sendFaq(faq)}
                                            className="text-left text-xs bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 hover:shadow-md px-3 py-2 rounded-xl transition-all flex items-center justify-between group"
                                        >
                                            {faq}
                                            <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-teal-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                        <form onSubmit={handleSendMessage} className="relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Posez votre question..."
                                className="pr-12 pl-4 py-6 rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50 focus:bg-white transition-all shadow-inner"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim() || isTyping}
                                className={cn(
                                    "absolute right-1 top-1.5 h-9 w-9 rounded-lg transition-all",
                                    inputValue.trim() ? "bg-teal-600 hover:bg-teal-500 text-white" : "bg-transparent text-slate-300 hover:bg-slate-100"
                                )}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 mt-2">
                            Support IA disponible 24/7 • <a href="#" className="underline hover:text-teal-600">Contacter un humain</a>
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}
