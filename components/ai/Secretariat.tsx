
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, X, Send, Bot, Calendar, FileText, Phone } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SecretariatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Bonjour Maître. Je suis votre Secrétaire Virtuelle. Je peux gérer votre agenda, rédiger des courriers simples ou rechercher un dossier. Que puis-je faire pour vous ?" }
    ])
    const [inputValue, setInputValue] = useState("")
    const [typing, setTyping] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMsg = inputValue
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setInputValue("")
        setTyping(true)

        // Simuler une réponse intelligente
        setTimeout(() => {
            let response = "J'ai bien noté. Je m'en occupe."

            if (userMsg.toLowerCase().includes('facture')) {
                response = "Je peux préparer le brouillon de facture. Quel est le dossier concerné ?"
            } else if (userMsg.toLowerCase().includes('audience')) {
                response = "Vous avez 3 audiences prévues cette semaine. Voulez-vous un récapitulatif ?"
            } else if (userMsg.toLowerCase().includes('client')) {
                response = "Dossier Client identifié. Je prépare la note de synthèse."
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }])
            setTyping(false)
        }, 1500)
    }

    return (
        <>
            {/* Trigger Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-14 w-14 rounded-full bg-indigo-900 shadow-2xl hover:bg-indigo-800 transition-all hover:scale-105"
                    >
                        <Bot className="h-7 w-7 text-white" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
                    </Button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] z-50 shadow-2xl border-indigo-200 animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col">
                    <CardHeader className="bg-indigo-900 text-white p-4 rounded-t-lg flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white/20">
                                <AvatarImage src="/avatars/secretary-ai.png" />
                                <AvatarFallback className="bg-indigo-700">IA</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-sm font-bold">Secrétariat IA</CardTitle>
                                <p className="text-[10px] text-indigo-200 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${m.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 flex gap-1 items-center">
                                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={endRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-3 bg-white border-t border-slate-200">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSend()
                                }}
                            >
                                <Input
                                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                    placeholder="Une tâche pour moi ?"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700" disabled={!inputValue.trim() || typing}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                <Button variant="outline" size="sm" className="whitespace-nowrap text-[10px] h-6 px-2 text-slate-500" onClick={() => setInputValue("Quelles sont mes audiences ?")}>
                                    <Calendar className="mr-1 h-3 w-3" /> Audiences
                                </Button>
                                <Button variant="outline" size="sm" className="whitespace-nowrap text-[10px] h-6 px-2 text-slate-500" onClick={() => setInputValue("Préparer facture")}>
                                    <FileText className="mr-1 h-3 w-3" /> Facture
                                </Button>
                                <Button variant="outline" size="sm" className="whitespace-nowrap text-[10px] h-6 px-2 text-slate-500" onClick={() => setInputValue("Appeler client")}>
                                    <Phone className="mr-1 h-3 w-3" /> Appel
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
